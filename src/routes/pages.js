/**
 * Author: Ryan Stokes
 * File: pages.js
 * Last Modified: 2026-05-18
 */

import express from "express";
import { Class } from "../models/Class.js";
import { requireAuthPage } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleCheck.js";

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

// Teacher dashboard
router.get("/teacher/dashboard", requireAuthPage, requireRole("teacher"), async (req, res) => {
    const teacherClass = await Class.findOne({
        teacher: req.session.userId
    }).populate("students.parent", "name");

    return res.render("dash", {
        title: "HOOT | Teacher Dashboard",
        layout: "layouts/dashLayout",
        user: req.session.user,
        teacherClass
    });
});


// Parent dashboard
router.get("/parent/dashboard", requireAuthPage, requireRole("parent"), async (req, res) => {
    const parentClass = await Class.findOne({
        parent: req.session.userId
    });

    return res.render("dash", {
        title: "HOOT | Parent Dashboard",
        layout: "layouts/dashLayout",
        user: req.session.user,
        parentClass
    });
});

router.get("/teacher/classes/create", (req, res) => {
    res.render("forms", {
        title: "HOOT | Add Class",
        role: "teacher"
    });
});

router.get("/parent/students/create", (req, res) => {
    res.render("forms", {
        title: "HOOT | Add Student",
        role: "parent"
    });
});


export default router;