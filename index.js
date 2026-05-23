import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ConnectDb from "./Utils/ConnectDb.js";
import { connectRedis } from "./Utils/redis.js"; // Fix 1: Added missing import
import router from "./Routes/urlsRouter.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// App routes
app.use("/", router);

app.get("/", (req, res) => {
    res.send("Getting Result");
});

const PORT = process.env.PORT || 5050;

// Fix 2: Wrap connections inside a clean async block before starting server listener
const startServer = async () => {
    try {
        // Connect MongoDB
        await ConnectDb();
        
        // Connect Redis
        await connectRedis();

        // Start listening only after databases are securely attached
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Database connection failure at startup:", err);
        process.exit(1); // Stop server instantiation if downstream hooks fail
    }
};

startServer();