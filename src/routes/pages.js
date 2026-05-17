/**
 * Author: Ryan Stokes
 * File: pages.js
 * Last Modified: 2026-01-25
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
  res.render("login", {
    title: "HOOT | Login"
  })
);

router.get("/registerTeacher", (req, res) =>
  res.render("registerTeacher", {
    title: "HOOT | Teacher Sign Up"
  })
);

router.get("/registerParent", (req, res) =>
  res.render("registerParent", {
    title: "HOOT | Parent Sign Up"
  })
);

// Teacher dashboard
router.get("/teacher/dashboard", requireAuthPage, requireRole("teacher"), async (req, res) => {
  const teacherClass = await Class.findOne({
    teacher: req.session.userId
  });

  if (!teacherClass) {
    return res.render("noClassTeacher", {
      title: "HOOT | Teacher Dashboard",
      layout: "layouts/mainLayout"
    });
  }

  return res.render("dashTeacher", {
    title: "HOOT | Teacher Dashboard",
    layout: "layouts/dashLayout",
    teacherClass
  });
});

// Parent dashboard
router.get("/parent/dashboard", requireAuthPage, requireRole("parent"), async (req, res) => {
  const parentClass = await Class.findOne({
    parent: req.session.userId
  });

  if (!parentClass) {
    return res.render("noClassParent", {
      title: "HOOT | Parent Dashboard",
      layout: "layouts/mainLayout"
    });
  }

  return res.render("dashParent", {
    title: "HOOT | Parent Dashboard",
    layout: "layouts/dashLayout",
    parentClass
  });
});

export default router;