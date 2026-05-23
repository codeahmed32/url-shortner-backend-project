import { URLs } from "../model/url.js";

export const RedirectURL = async (req, res) => {
    const { shortId } = req.params;
    try {
        const element = await URLs.findOne({ shortId: shortId });

        if (!element) {
            return res.status(404).send("<h1>URL Not Found</h1><p>The requested short link does not exist.</p>");
        }

        console.log("Redirecting to:", element.longUrl);
        
        return res.redirect(element.longUrl);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            message: "Internal Server Error"
        });
    }
};