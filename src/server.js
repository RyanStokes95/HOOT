import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

// Testing route
app.get("/", (req, res) => {
  res.json({ status: "running" });
});

// Connects to MongoDB then starts the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
