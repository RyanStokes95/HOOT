/**
 * Author: Ryan Stokes
 * File: app.js
 * Last Modified: 2026-04-28
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
import dotenv from "dotenv";

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
app.set("layout", "layouts/main")
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
            secret: process.env.SESSION_SECRET,
            resave: false,
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

// Routes mounted on express app
// Infrastructure testing endpoint to verify the app is running and responding to requests, used by Supertest in tests
app.get("/", (req, res) => res.render("index", {title: "HOOT | Home"}));

// Navigation Endpoints
app.get("/login", (req, res) => res.render("login", {title: "HOOT | Login"}));

app.get("/logout", (req, res) => res.render("index", {title: "HOOT | Home"}));

app.get("/home", (req, res) => res.render("index", {title: "HOOT | Home"}));

app.get("/registerTeacher", (req, res) => res.render("registerTeacher", {title: "HOOT | Teacher Sign Up"}));

app.get("/registerParent", (req, res) => res.render("registerParent", {title: "HOOT | Parent Sign Up"}));

// Secure Role Based Access Endpoints
// Teacher dashboard route with requireAuth and requireRole middleware to ensure only authenticated teachers can access
app.get("/teacher/dashboard", requireAuthPage, requireRole("teacher"), (req, res) => {
  res.render("dashTeacher", { title: "HOOT | Teacher Dashboard", layout: "layouts/dash" });
});

// Parent dashboard route with requireAuth and requireRole middleware to ensure only authenticated parents can access
app.get("/parent/dashboard", requireAuthPage, requireRole("parent"), (req, res) => {
  res.render("dashParent", { title: "HOOT | Parent Dashboard", layout: "layouts/dash" });
});

// Checks health of the application by responding with 200 OK and { ok: true } if the app is running
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

//API endpoints
app.use("/api/items", itemsRouter);

app.use("/api/auth", authRouter);

export { store };
export default app;

