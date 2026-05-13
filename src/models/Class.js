/**
 * Author: Ryan Stokes
 * File: Class.js
 * Last Modified: 2026-05-13
 */

import mongoose from "mongoose";

const { Schema } = mongoose;

// Validation enforced by Mongoose schema below

const classSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        classCode: {
            type: String,
            required: true,
            unique: true
        },
        //Each class must have exactly one teacher, and each teacher can only have one class, so we use a unique reference to the User model for the teacher field
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        students: [
            {
                name: {
                    type: String,
                    required: true,
                    minlength: 2,
                    maxlength: 50
                },
                // Each student must have exactly one parent, but parents can have multiple students.
                parent: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                }
            }
        ]
    },
    { timestamps: true }
)

export const Class = mongoose.model("Class", classSchema);