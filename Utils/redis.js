import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST, 
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 18523,
    },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("Connected to Redis Successfully");
        }
    } catch (err) {
        console.error("Redis Connection Failed:", err);
        throw err;
    }
};

export const setCache = async (key, value, expireSeconds = 7200) => {
    try {
        if (!redisClient.isOpen) await connectRedis();
        await redisClient.set(key, value, {
            EX: expireSeconds,
        });
    } catch (err) {
        console.error("Redis Set Cache Error:", err);
    }
};

export const getCache = async (key) => {
    try {
        if (!redisClient.isOpen) await connectRedis();
        const data = await redisClient.get(key);
        return data; 
    } catch (err) {
        console.error("Redis Get Cache Error:", err);
        return null;
    }
};

export default redisClient;