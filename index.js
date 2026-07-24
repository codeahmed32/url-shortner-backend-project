import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit"; 
import ConnectDb from "./Utils/ConnectDb.js";
import { connectRedis } from "./Utils/redis.js";
import router from "./Routes/urlsRouter.js";

dotenv.config();
const app = express();

// CORS Configuration
app.use(cors({
    origin: [
        process.env.FRONTEND_URL, 
        process.env.VITE_FRONT_END, 
        "https://link-shortner-project.netlify.app", 
        "http://localhost:5173"
    ].filter(Boolean), // Removes undefined/empty values
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json());
app.set("trust proxy", 1);

// Rate Limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    message: { ok: false, message: "Enough of the requests" }
});

app.use("/save", limiter);

// Root Route FIRST
app.get("/", (req, res) => {
    res.send("URL Shortener API is Running Securely...");
});

// API Routes AFTER
app.use("/", router);

const PORT = process.env.PORT || 5050;

const startServer = async () => {
    try {
        await ConnectDb();
        console.log("Mongo Connected");
        await connectRedis();
        console.log("Redis Connected");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Startup Error:", err);
        process.exit(1);
    }
};

startServer();