import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start the server

//Express is imported from app.js, app variable is set to express()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });