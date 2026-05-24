import { nanoid } from "nanoid";
import { URLs } from "../model/url.js";
import { setCache } from "../Utils/redis.js";

export const SaveURL = async (req, res) => {
    let { longUrl } = req.body; 

    if (!longUrl) {
        return res.status(400).json({ ok: false, message: "URL is Important " });
    }

    longUrl = longUrl.trim();

    if (!/^https?:\/\//i.test(longUrl)) {
        longUrl = `https://${longUrl}`;
    }

    try {
        const parsedUrl = new URL(longUrl);
        
        if (!parsedUrl.hostname.includes('.')) {
            throw new Error("Invalid domain name");
        }
    } catch (err) {
        return res.status(400).json({ 
            ok: false, 
            message: "Invalid SiteLink" 
        });
    }

    try {
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
        console.error("Save URL Database Error:", err);
        return res.status(500).json({
            ok: false,
            message: "Internal Server Error"
        });
    }
};