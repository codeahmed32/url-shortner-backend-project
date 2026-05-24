import { nanoid } from "nanoid";
import { URLs } from "../model/url.js";
import { setCache } from "../Utils/redis.js";

export const SaveURL = async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ ok: false, message: "URL dena zaroori hai bhaiya!" });
    }

    try {
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
        
        if (!urlRegex.test(longUrl)) {
            return res.status(400).json({ 
                ok: false, 
                message: "Not A Valid Website URl" 
            });
        }

        const shortId = nanoid ? nanoid(8) : Math.random().toString(36).substring(2, 10); 

        const newUrl = new URLs({
            shortId,
            longUrl
        });
        await newUrl.save();

        await setCache(shortId, longUrl, 7200);

        return res.status(201).json({
            ok: true,
            message: "URL Shortened Successfully",
            shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`
        });

    } catch (err) {
        console.error("Save URL Error:", err);
        return res.status(500).json({
            ok: false,
            message: "Internal Server Error"
        });
    }
};