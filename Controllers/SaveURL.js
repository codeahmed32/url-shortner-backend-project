import { URLs } from "../model/url.js";
import { generateShortID } from "../Utils/Keys.js";

export const SaveURL = async (req, res) => {
    const { longUrl } = req.body;
    try {
        const shortId = generateShortID(7);
        const newURL = new URLs({ longUrl: longUrl, shortId: shortId });
        await newURL.save();
        const shortURL = `http://localhost:5050/${shortId}`;
        res.status(200).json({
            ok: true,
            shortURL: shortURL,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok:false,
        });
    }
};