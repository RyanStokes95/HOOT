/**
 * Author: Ryan Stokes
 * File: teacher.js
 * Last Modified: 2026-05-28
 */

// Contains all the API routes that relate to the teacher role.

// Each is protected with requireAuth and requireRole("teacher") middleware to ensure only authenticated teachers can access these routes.

// Each route is also protected with a generic rate limiter to prevent abuse, which allows 100 requests per 15 minutes per user.

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
    editTask,
    addBulletin,
    deleteBulletin,
    editBulletin,
    addFeedback,
} from "../controllers/teacherController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleCheck.js";
import { genericLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Create routes use the POST method.

router.post("/create-class", requireAuth, requireRole("teacher"), genericLimiter, createClass);

router.post("/add-subject", requireAuth, requireRole("teacher"), genericLimiter, addSubject);

router.post("/add-feedback", requireAuth, requireRole("teacher"), genericLimiter, addFeedback);

router.post("/add-homework", requireAuth, requireRole("teacher"), genericLimiter, addHomework);

router.post("/add-task", requireAuth, requireRole("teacher"), genericLimiter, addTask);

router.post("/add-bulletin", requireAuth, requireRole("teacher"), genericLimiter, addBulletin);

// Update routes use the PUT method.

router.put("/approve-student", requireAuth, requireRole("teacher"), genericLimiter, approveStudent);

router.put("/edit-subject", requireAuth, requireRole("teacher"), genericLimiter, editSubject);

router.put("/edit-homework", requireAuth, requireRole("teacher"), genericLimiter, editHomework);

router.put("/edit-task", requireAuth, requireRole("teacher"), genericLimiter, editTask);

router.put("/edit-bulletin", requireAuth, requireRole("teacher"), genericLimiter, editBulletin);

// Delete routes use the DELETE method.

router.delete("/delete-student", requireAuth, requireRole("teacher"), genericLimiter, deleteStudent);

router.delete("/delete-subject", requireAuth, requireRole("teacher"), genericLimiter, deleteSubject);

router.delete("/delete-homework", requireAuth, requireRole("teacher"), genericLimiter, deleteHomework);

router.delete("/delete-task", requireAuth, requireRole("teacher"), genericLimiter, deleteTask);

router.delete("/delete-bulletin", requireAuth, requireRole("teacher"), genericLimiter, deleteBulletin);

export default router;