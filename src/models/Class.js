/**
 * Author: Ryan Stokes
 * File: Class.js
 */

import mongoose from "mongoose";

const { Schema } = mongoose;

const STUDNT_STATUS = ["Active", "Pending"];

// Validation enforced by Mongoose schema below

/** 
    Teacher creates class
    ↓
    Class document created with teacher reference and empty students array
    ↓
    Teacher shares class code with parents
    ↓
    Parent enters class code to join class
    ↓
    If class code is valid, parent is added to students array with reference to parent user document
    ↓
    Teacher can add subjects, homework, feedback, bulletins, tasks, and events to arrays in class document
    ↓
    Parent can view class information
*/


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
                },
                status: {
                    type: String,
                    required: true,
                    // Enforce enum validation for student status to ensure only valid values are stored in the database
                    enum: STUDNT_STATUS,
                    default: "Pending"
                }
            }
        ],
        subjects: [
            {
                name: {
                    type: String,
                    required: true,
                    minlength: 2,
                    maxlength: 50
                }
            }
        ],
        bulletins: [
            {
                title: {
                    type: String,
                    required: true,
                    minlength: 2,
                    maxlength: 100
                },
                content: {
                    type: String,
                    required: true,
                    minlength: 10,
                    maxlength: 500
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ], 
        tasks: [
            {
                title: {
                    type: String,
                    required: true,
                    minlength: 2,
                    maxlength: 100
                },
                description: {
                    type: String,
                    required: true,
                    minlength: 10,
                    maxlength: 500
                },
                assignedTo: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        required: true
                    }
                ],
                completedBy: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    }
                ],
                dueDate: {
                    type: Date,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
    },
    { timestamps: true }
)

export const Class = mongoose.model("Class", classSchema);