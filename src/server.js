/**
 * Author: Ryan Stokes
 * File: server.js
 * Last Modified: 2026-05-14
 */

import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db.js";

// Load environment variables from .env file, with quiet mode to suppress warnings if .env is missing
dotenv.config({ quiet: true });

// Heroku will set PORT environment variable, otherwise default to 3000
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start the server using db.js

connectDB()
    .then(() => {

        console.log("MongoDB connected");

        app.listen(PORT, () =>
            console.log(`Listening on port ${PORT}`)
        );

    })
    .catch((err) => {

        console.error("MongoDB connection failed:", err.message);

        process.exit(1);

    });