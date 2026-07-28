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

export async function completeTask(req, res) {
    try {
        const { taskId } = req.body;
        const parentId = req.session.userId;

        // Find the class containing the task
        const teacherClass = await Class.findOne({
            "tasks._id": taskId
        });

        if (!teacherClass) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        // Find the task
        const task = teacherClass.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        // Ensure the parent is currently assigned this task
        const assigned = task.assignedTo.some(
            id => id.toString() === parentId.toString()
        );

        if (!assigned) {
            return res.status(403).json({
                message: "You are not assigned this task."
            });
        }

        // Ensure they haven't already completed it
        const alreadyCompleted = task.completedBy.some(
            id => id.toString() === parentId.toString()
        );

        if (alreadyCompleted) {
            return res.status(400).json({
                message: "Task has already been completed."
            });
        }

        // Move parent from Assigned To -> Completed
        task.completedBy.push(parentId);

        task.assignedTo = task.assignedTo.filter(
            id => id.toString() !== parentId.toString()
        );

        await teacherClass.save();

        return res.status(200).json({
            message: "Task marked as complete."
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}