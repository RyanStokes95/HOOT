/**
 * Author: Ryan Stokes
 * File: teacherController.js
 * Last Modified: 2026-05-20
 */

import { Class } from "../models/Class.js";

export async function createClass(req, res) {
    try {
        const { name } = req.body;
        const teacherId = req.session.userId;

        const classCode = generateClassCode();

        const existingClass = await Class.findOne({ 
            teacher: teacherId,
         });

         if (existingClass) {
            return res.status(400).json({ message: "You already have a class." });
        }

        const newClass = await Class.create({
            name,
            classCode,
            teacher: teacherId,
        });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which generates a random 6-character alphanumeric class code.
function generateClassCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

export async function addSubject(req, res) {
    try {
        const { subject } = req.body;
        const teacherId = req.session.userId;

        const teacherClass = await Class.findOne({ teacher: teacherId });

        const newSubject = {
            name: subject,
        };

        teacherClass.subjects.push(newSubject);

        await teacherClass.save();

        res.status(200).json({ subject: newSubject.name });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}