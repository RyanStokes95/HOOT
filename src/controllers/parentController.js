/**
 * Author: Ryan Stokes
 * File: parentController.js
 * Last Modified: 2026-05-19
 */

import { Class } from "../models/Class.js";

export async function joinClass(req, res) {
    try {
        const { classCode, name } = req.body;
        const parentId = req.session.userId;
        const classToJoin = await Class.findOne({ classCode });

        if (!classToJoin) {
            return res.status(404).json({ message: "Class not found." });
        }

        classToJoin.students.push({ name: name, parent: parentId });

        await classToJoin.save();

        res.status(200).json({ message: "Successfully joined class." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}