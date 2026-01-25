/**
 * Author: Ryan Stokes
 * File: auth.js
 * Last Modified: 2026-01-25
 */

import express from "express";
// imports controller functions and auth middleware
import {
    registerParent,
    registerTeacher,
    login,
    logout,
    me
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

// Creates an instance of an Express router
const router = express.Router();
 
// Auth routes, creates endpoints for registration, login, logout, and user info
router.post("/register-parent", registerParent);
router.post("/register-teacher", registerTeacher);
router.post("/login", login);
router.post("/logout", logout);
// Session-protected route to get current user info, calls requireAuth middleware first then me controller
router.get("/me", requireAuth, me);

// Export the router to be mounted in app.js
export default router;
