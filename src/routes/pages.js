/**
 * Author: Ryan Stokes
 * File: pages.js
 */

import express from "express";
import { requireAuthPage } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleCheck.js";
import { genericLimiter } from "../middleware/rateLimiters.js";
import { 
  renderParentDashboard, 
  renderTeacherDashboard 
} from "../controllers/pagesController.js";

const router = express.Router();

// Public navigation pages
router.get("/", (req, res) =>
  res.render("index", {
    title: "HOOT | Home",
    layout: "layouts/indexLayout"
  })
);

router.get("/home", (req, res) =>
  res.render("index", {
    title: "HOOT | Home",
    layout: "layouts/indexLayout"
  })
);

router.get("/login", (req, res) =>
  res.render("auth", {
    title: "HOOT | Login",
    role: null
  })
);

router.get("/register/teacher", (req, res) =>
  res.render("auth", {
    title: "HOOT | Teacher Sign Up",
    role: "teacher"
  })
);

router.get("/register/parent", (req, res) =>
  res.render("auth", {
    title: "HOOT | Parent Sign Up",
    role: "parent"
  })
);


// Dashboard pages, protected by authentication and role-based access control, with rate limiting applied.

// Teacher dashboard
router.get("/teacher/dashboard", requireAuthPage, requireRole("teacher"), genericLimiter, renderTeacherDashboard);


// Parent dashboard
router.get("/parent/dashboard", requireAuthPage, requireRole("parent"), genericLimiter, renderParentDashboard);

export default router;