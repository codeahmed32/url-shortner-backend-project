import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./Routes/urlsRouter.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://link-shortner-project.netlify.app",
}));

app.use(express.json());

app.use("/", router);

app.get("/", (req, res) => {
  res.send("Backend Working");
});

const startServer = async () => {
  try {

    console.log("Connecting MongoDB...");

    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5050;

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

  } catch (err) {
    console.log("Startup Error:", err);
  }
};

startServer();