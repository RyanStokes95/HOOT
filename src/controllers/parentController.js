/**
 * Author: Ryan Stokes
 * File: parentController.js
 */

import { Class } from "../models/Class.js";

// Function which allows a parent to add a student to a class by using a teachers class code.
export async function joinClass(req, res) {
    try {
        const { classCode, name } = req.body;
        const parentId = req.session.userId;

        // Validate class code format
        if (typeof classCode !== "string" ||
            // regex expression to check if class code is 6 characters long and only contains uppercase letters and numbers
            !/^[A-Z0-9]{6}$/.test(classCode)
        ) {
            // If not valid, return a 400 status with an error message
            return res.status(400).json({ message: "Invalid class code format." });
        }

        // Check if the class code exists in the database
        const classToJoin = await Class.findOne({ classCode });

        if (!classToJoin) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Adds the student to the class's students array with their name and parent ID
        classToJoin.students.push({ name: name, parent: parentId });

        await classToJoin.save();

        res.status(200).json({ message: "Successfully joined class." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}