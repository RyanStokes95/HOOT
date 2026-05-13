import express from "express";
import {
    createClass
} from "../controllers/teacherController.js";

const router = express.Router();

// Route to create a new class, only accessible to authenticated teachers
router.post("/create-class", createClass);

export default router;