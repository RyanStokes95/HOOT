/**
 * Author: Ryan Stokes
 * File: teacher.js
 * Last Modified: 2026-05-18
 */

import express from "express";
import {
    joinClass
} from "../controllers/parentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleCheck.js";
import { genericLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Route to join a class, only accessible to authenticated parents
router.post("/join-class", requireAuth, requireRole("parent"), genericLimiter, joinClass);

export default router;