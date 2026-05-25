/**
 * Author: Ryan Stokes
 * File: teacher.js
 * Last Modified: 2026-05-21
 */

import express from "express";
import {
    createClass,
    approveStudent,
    deleteStudent,
    addSubject,
    deleteSubject,
    editSubject,
    addHomework,
    editHomework,
    deleteHomework,
    addTask,
    deleteTask,
    editTask
} from "../controllers/teacherController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleCheck.js";
import { genericLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Route to create a new class, only accessible to authenticated teachers
router.post("/create-class", requireAuth, requireRole("teacher"), genericLimiter, createClass);

router.post("/add-subject", requireAuth, requireRole("teacher"), genericLimiter, addSubject);

router.post("/add-homework", requireAuth, requireRole("teacher"), genericLimiter, addHomework);

router.post("/add-task", requireAuth, requireRole("teacher"), genericLimiter, addTask);

router.put("/approve-student", requireAuth, requireRole("teacher"), genericLimiter, approveStudent);

router.put("/edit-subject", requireAuth, requireRole("teacher"), genericLimiter, editSubject);

router.put("/edit-homework", requireAuth, requireRole("teacher"), genericLimiter, editHomework);

router.put("/edit-task", requireAuth, requireRole("teacher"), genericLimiter, editTask);

router.delete("/delete-student", requireAuth, requireRole("teacher"), genericLimiter, deleteStudent);

router.delete("/delete-subject", requireAuth, requireRole("teacher"), genericLimiter, deleteSubject);

router.delete("/delete-homework", requireAuth, requireRole("teacher"), genericLimiter, deleteHomework);

router.delete("/delete-task", requireAuth, requireRole("teacher"), genericLimiter, deleteTask);

export default router;