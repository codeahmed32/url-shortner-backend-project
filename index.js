import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ConnectDb from "./Utils/ConnectDb.js";
import router from "./Routes/urlsRouter.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

ConnectDb();

app.get("/", (req , res) => {
    res.send("Getting Result")
})
app.use("/", router);

app.listen(5050, () => {
    console.log("Port 5050 Connected")
})
