import express from "express";
import rateLimit from "express-rate-limit";
import {
    createClass
} from "../controllers/teacherController.js";

const router = express.Router();

const createClassLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
});

// Route to create a new class, only accessible to authenticated teachers
router.post("/create-class", createClassLimiter, createClass);

export default router;