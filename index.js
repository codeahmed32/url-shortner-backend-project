import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ConnectDb from "./Utils/ConnectDb.js";
import router from "./Routes/urlsRouter.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

ConnectDb();

app.get("/", (req, res) => {
    res.send("Getting Result");
});

// App routes
app.use("/", router);

const PORT = process.env.PORT || 5050;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});