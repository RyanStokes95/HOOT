/**
 * Author: Ryan Stokes
 * File: app.js
 */

import express from "express";
import session from "express-session";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import { buildSessionStore } from "./sessionStore.js";
import { requireAuthPage } from "./middleware/authMiddleware.js";
import { requireRole } from "./middleware/roleCheck.js";
import itemsRouter from "./routes/items.js";
import authRouter from "./routes/auth.js";
import teacherRouter from "./routes/teacher.js";
import parentRouter from "./routes/parent.js";
import pageRouter from "./routes/pages.js";
import dotenv from "dotenv";

// quiet to stop dotenv logging in console when starting the server.
dotenv.config({ quiet: true });

// __dirname and __filename replacement in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
 - Creates and exports the Express application instance without binding to a port.
 - Used by server.js (runtime) and by tests (Supertest/Jest).
*/
const app = express();

// Middleware
// Needed to parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));
// Needed to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory, such as CSS, JS, and images
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");
// Set the views directory
app.set("views", path.join(__dirname, "views"));
// Set the layout for express-ejs-layouts, main.ejs will be the default layout for all views
app.set("layout", "layouts/mainLayout")
// Use express-ejs-layouts middleware to enable layout support in EJS templates
app.use(expressLayouts);

// Enable sessions only in certain environments
const enableSessions = 
process.env.NODE_ENV === "production" || 
process.env.NODE_ENV === "development" || 
process.env.NODE_ENV === "integration";

// Needed for non-integration/test environments to not be able to have sessions
let store

// Session middleware configuration
// if in enabled environment, set up session management
if(enableSessions) {
    // Needed for Heroku deployment behind a proxy
    app.set("trust proxy", 1);

    // Session and Cookie management setup using express-session and connect-mongo
    store = buildSessionStore();

    // Session middleware
    app.use(
        session({
            // Secret key for signing the session ID cookie, should be set in environment variables for security
            secret: process.env.SESSION_SECRET,
            // Don't resave session if unmodified, helps reduce unnecessary session store writes
            resave: false,
            // Don't create a session until something is stored in it.
            saveUninitialized: false,
            store,
            // Production cookie settings for security, will only be used in production environment
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

//Flow of authentication and session management in the app:

/** 
    EJS page
    ↓
    Form submit / fetch
    ↓
    API auth route
    ↓
    Controller logic
    ↓
    Session created
    ↓
    Redirect / frontend navigation
    ↓
    Dashboard route
    ↓
    Dashboard EJS rendered 
*/

// Routes mounted on express app

// Page routes for rendering EJS templates, includes public pages and protected dashboard pages for teachers and parents
app.use("/", pageRouter);

// Checks health of the application by responding with 200 OK and { ok: true } if the app is running
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

//API endpoints
// Test route to verify API is working, responds with 200 OK and { api: "working" } if the route is hit successfully
app.use("/api/items", itemsRouter);

// Authentication routes for registering and logging in teachers and parents, handles session creation and management
app.use("/api/auth", authRouter);

// Protected teacher routes, require authentication and teacher role to access any endpoints defined in teacherRouter
app.use("/api/teacher", requireAuthPage, requireRole("teacher"), teacherRouter);

// Protected parent routes, require authentication and parent role to access any endpoints defined in parentRouter
app.use("/api/parent", requireAuthPage, requireRole("parent"), parentRouter);

export { store };
export default app;

