import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

// Prefer direct URL connection string, fallback to parameters
const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_USERNAME || 'default'}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 18523}`;

const redisClient = createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000), // Prevent crashing on disconnect
        connectTimeout: 5000 // Timeout fast instead of hanging
    }
});

redisClient.on('error', (err) => console.error('Redis Silent Error:', err.message));

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("Connected to Redis Successfully");
        }
    } catch (err) {
        console.error("Redis Connection Failed (Bypassing cache):", err.message);
        // DO NOT THROW ERR. Let application run without cache.
    }
};

export const setCache = async (key, value, expireSeconds = 7200) => {
    try {
        if (redisClient.isOpen) {
            await redisClient.set(key, value, { EX: expireSeconds });
        }
    } catch (err) {
        console.error("Redis Set Cache Error:", err.message);
    }
};

export const getCache = async (key) => {
    try {
        if (redisClient.isOpen) {
            return await redisClient.get(key);
        }
        return null;
    } catch (err) {
        console.error("Redis Get Cache Error:", err.message);
        return null;
    }
};

export default redisClient;