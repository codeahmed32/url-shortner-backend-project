import express from "express";
import { SaveURL } from "../Controllers/SaveURL.js";
import { RedirectURL } from "../Controllers/RedirectURL.js";

const router = express.Router();

// Specific routes FIRST
router.post("/save", SaveURL);

// Catch-all param route LAST
router.get("/:shortId", RedirectURL);

export default router;