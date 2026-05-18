/**
 * Author: Ryan Stokes
 * File: teacher.js
 * Last Modified: 2026-05-18
 */

import express from "express";
import rateLimit from "express-rate-limit";
import {
    createClass
} from "../controllers/teacherController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleCheck.js";

const router = express.Router();

const createClassLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
});

// Route to create a new class, only accessible to authenticated teachers
router.post("/create-class", requireAuth, requireRole("teacher"), createClassLimiter, createClass);

export default router;