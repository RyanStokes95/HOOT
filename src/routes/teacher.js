/**
 * Author: Ryan Stokes
 * File: teacher.js
 * Last Modified: 2026-05-21
 */

import express from "express";
import {
    createClass,
    addSubject,
    approveStudent,
    deleteStudent,
    deleteSubject,
    editSubject
} from "../controllers/teacherController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleCheck.js";
import { genericLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Route to create a new class, only accessible to authenticated teachers
router.post("/create-class", requireAuth, requireRole("teacher"), genericLimiter, createClass);

router.post("/add-subject", requireAuth, requireRole("teacher"), genericLimiter, addSubject);

router.put("/approve-student", requireAuth, requireRole("teacher"), genericLimiter, approveStudent);

router.put("/edit-subject", requireAuth, requireRole("teacher"), genericLimiter, editSubject);

router.delete("/delete-student", requireAuth, requireRole("teacher"), genericLimiter, deleteStudent);

router.delete("/delete-subject", requireAuth, requireRole("teacher"), genericLimiter, deleteSubject);

export default router;