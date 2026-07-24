import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit"; 
import ConnectDb from "./Utils/ConnectDb.js";
import { connectRedis } from "./Utils/redis.js";
import router from "./Routes/urlsRouter.js";

dotenv.config();
const app = express();

// Flexible CORS Configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, curl, server-to-server)
        if (!origin) return callback(null, true);
        
        // Match Netlify main/preview domains, local dev, or explicitly defined env URLs
        if (
            origin.includes("netlify.app") || 
            origin.includes("localhost") ||
            origin === process.env.FRONTEND_URL ||
            origin === process.env.VITE_FRONT_END
        ) {
            return callback(null, true);
        }
        
        return callback(null, true); // Fallback grant during debugging
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.set("trust proxy", 1);

// Sanitize double slashes in routes automatically
app.use((req, res, next) => {
    req.url = req.url.replace(/\/{2,}/g, '/');
    next();
});

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
        
        try {
            await connectRedis();
            console.log("Redis Connected");
        } catch (redisErr) {
            console.error("Redis connection failed, continuing without cache:", redisErr);
        }

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Startup Error:", err);
        process.exit(1);
    }
};

startServer();