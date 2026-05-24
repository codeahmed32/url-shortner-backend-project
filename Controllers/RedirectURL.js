import { URLs } from "../model/url.js";
import { getCache, setCache } from "../Utils/redis.js";

export const RedirectURL = async (req, res) => {
    const { shortId } = req.params;
    try {
        const urlFromCache = await getCache(shortId);
        
        if (urlFromCache) {
            console.log("Fetched from Redis Cache:", urlFromCache);
            return res.redirect(urlFromCache); 
        }

        const element = await URLs.findOne({ shortId: shortId });
        if (!element) {
            return res.status(404).send("<h1>URL Not Found</h1><p>The requested short link does not exist.</p>");
        }

        console.log("Redirecting to:", element.longUrl);
        
        await setCache(shortId, element.longUrl, 7200);
        
        return res.redirect(element.longUrl);
    } catch (err) {
        console.log("Redirection Error:", err);
        return res.status(500).json({
            ok: false,
            message: "Internal Server Error"
        });
    }
};