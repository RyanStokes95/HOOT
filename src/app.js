/**
 * Author: Ryan Stokes
 * File: app.js
 * Last Modified: 2026-01-25
 */

import express from "express";
import session from "express-session";
import { buildSessionStore } from "./sessionStore.js";
import itemsRouter from "./routes/items.js";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config();

/*
 - Creates and exports the Express application instance without binding to a port.
 - Used by server.js (runtime) and by tests (Supertest/Jest).
*/

const app = express();

// Middleware
// Needed to parse JSON bodies
app.use(express.json());

// Enable sessions only in certain environments
const enableSessions = 
process.env.NODE_ENV === "production" || 
process.env.NODE_ENV === "development" || 
process.env.NODE_ENV === "integration";

// Needed for non-integration/test environments to not be able to have sessions
let store

// Session middleware configuration
//if in enabled environment, set up session management
if(enableSessions) {
    // Needed for Heroku deployment behind a proxy
    app.set("trust proxy", 1);

    //Session and Cookie management setup using express-session and connect-mongo
    const store = buildSessionStore();

    // Session middleware
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store,
            // Producton cookie settings for security, will only be used in production environment
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                // 15 minutes - 1000 = milliseconds so 1000*60 = 1 minute, *15 = 15 minutes
                maxAge: 1000 * 60 * 15
            }
        })
    );
};

// Routes mounted on express app
// Infrastructure testing endpoint

// Basic root endpoint to verify the app is running, currently used to test deployment
app.get("/", (req, res) => res.status(200).json({ status: "running" }));

// Checks health of the application by responding with 200 OK and { ok: true } if the app is running
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

//API endpoints

app.use("/api/items", itemsRouter);

app.use("/api/auth", authRouter);

export { store };
export default app;

