import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    console.log("Connected to Redis Successfully");
};

export const setCache = async (key, value, expireSeconds = 3600) => {
    try {
        await redisClient.set(key, JSON.stringify(value), {
            EX: expireSeconds
        });
    } catch (err) {
        console.error("Redis Set Cache Error:", err);
    }
};

export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data;
    } catch (err) {
        console.error("Redis Get Cache Error:", err);
        return null;
    }
};

export default redisClient;