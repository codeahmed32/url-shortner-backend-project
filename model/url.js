// making schema 
import mongoose from "mongoose";
const URLschema = mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    longUrl: {
        type: String,
        required: true,
    },
});

export const URLs = mongoose.model("urls", URLschema); 
