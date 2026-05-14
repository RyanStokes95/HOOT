/**
 * Author: Ryan Stokes
 * File: app.js
 * Last Modified: 2026-05-13
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
import dotenv from "dotenv";
import csurf from "csurf";

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

// CSRF protection middleware, should be used after session middleware since it relies on sessions to store the CSRF token
// Will be disabled in integration testing environment to allow Supertest to make requests without needing to handle CSRF tokens.
if (process.env.NODE_ENV !== "integration" && process.env.NODE_ENV !== "test") {
    app.use(csurf());

    app.use((req, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        next();
    });
}

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
// Infrastructure testing endpoint to verify the app is running and responding to requests, used by Supertest in tests
app.get("/", (req, res) => res.render("index", {title: "HOOT | Home", layout: "layouts/indexLayout"}));

// Navigation Endpoints
app.get("/login", (req, res) => res.render("login", {title: "HOOT | Login"}));

app.get("/logout", (req, res) => res.render("index", {title: "HOOT | Home", layout: "layouts/indexLayout"}));

app.get("/home", (req, res) => res.render("index", {title: "HOOT | Home", layout: "layouts/indexLayout"}));

app.get("/registerTeacher", (req, res) => res.render("registerTeacher", {title: "HOOT | Teacher Sign Up"}));

app.get("/registerParent", (req, res) => res.render("registerParent", {title: "HOOT | Parent Sign Up"}));

// Secure Role Based Access Endpoints
// Teacher dashboard route with requireAuth and requireRole middleware to ensure only authenticated teachers can access
app.get("/teacher/dashboard", requireAuthPage, requireRole("teacher"), (req, res) => {
  res.render("dashTeacher", { title: "HOOT | Teacher Dashboard", layout: "layouts/dashLayout" });
});

// Parent dashboard route with requireAuth and requireRole middleware to ensure only authenticated parents can access
app.get("/parent/dashboard", requireAuthPage, requireRole("parent"), (req, res) => {
  res.render("dashParent", { title: "HOOT | Parent Dashboard", layout: "layouts/dashLayout" });
});

// Checks health of the application by responding with 200 OK and { ok: true } if the app is running
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

//API endpoints
app.use("/api/items", itemsRouter);

app.use("/api/auth", authRouter);

// Protected teacher routes, require authentication and teacher role to access any endpoints defined in teacherRouter
app.use("/api/teacher", requireAuthPage, requireRole("teacher"), teacherRouter);

export { store };
export default app;

