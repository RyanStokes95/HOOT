/**
 * Author: Ryan Stokes
 * File: teacher.js
 */

import express from "express";
import {
    joinClass,
    completeTask
} from "../controllers/parentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleCheck.js";
import { genericLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Route to join a class, only accessible to authenticated parents
router.post("/join-class", requireAuth, requireRole("parent"), genericLimiter, joinClass);

router.post("/complete-task", requireAuth, requireRole("parent"), genericLimiter, completeTask);

export default router;