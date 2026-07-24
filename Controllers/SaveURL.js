import { nanoid } from "nanoid";
import { URLs } from "../model/url.js";
import { setCache } from "../Utils/redis.js";

export const SaveURL = async (req, res) => {
    let { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ ok: false, message: "URL is required" });
    }

    longUrl = longUrl.trim();

    if (!/^https?:\/\//i.test(longUrl)) {
        longUrl = `https://${longUrl}`;
    }

    // URL Validation
    try {
        const parsedUrl = new URL(longUrl);
        if (!parsedUrl.hostname.includes('.')) {
            throw new Error("Invalid domain name");
        }
    } catch (err) {
        return res.status(400).json({
            ok: false,
            message: "Invalid URL format"
        });
    }

    try {
        // 1. Check if longUrl already exists in Database
        const existingUrl = await URLs.findOne({ longUrl });
        if (existingUrl) {
            const host = req.get('host');
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            return res.status(200).json({
                ok: true,
                message: "URL Already Shortened",
                shortUrl: `${protocol}://${host}/${existingUrl.shortId}`
            });
        }

        // 2. Generate unique shortId with collision retry
        let shortId = nanoid(8);
        let attempts = 0;
        
        while (await URLs.findOne({ shortId }) && attempts < 5) {
            shortId = nanoid(8);
            attempts++;
        }

        // 3. Save to Mongo
        const newUrl = new URLs({ shortId, longUrl });
        await newUrl.save();

        // 4. Save to Redis Cache (Non-blocking)
        await setCache(shortId, longUrl, 7200);

        // 5. Build Short URL with Protocol Proxy Safety
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');

        return res.status(201).json({
            ok: true,
            message: "URL Shortened Successfully",
            shortUrl: `${protocol}://${host}/${shortId}`
        });

    } catch (err) {
        console.error("Save URL Database Error:", err);
        return res.status(500).json({
            ok: false,
            message: "Internal Server Error"
        });
    }
};