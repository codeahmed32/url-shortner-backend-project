import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ConnectDb from "./Utils/ConnectDb.js";
import { connectRedis } from "./Utils/redis.js";
import router from "./Routes/urlsRouter.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: "https://link-shortner-project.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json());

app.use("/", router);

app.get("/", (req, res) => {
    res.send("Getting Result");
});

const PORT = process.env.PORT || 5050;

const startServer = async () => {
    try {

        await ConnectDb();
        console.log("Mongo Connected");
        await connectRedis();
        console.log("Redis Connected")

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Startup Error:", err);
        process.exit(1);
    }
};

startServer();