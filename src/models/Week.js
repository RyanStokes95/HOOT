/**
 * Author: Ryan Stokes
 * File: Week.js
 */

import mongoose from "mongoose";

const { Schema } = mongoose;

const FEEDBACK_OPTIONS = ["Exceeding Expectations", "On Track", "Needs More Work"];

const weekSchema = new Schema(
  {
    teacherClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },

    weekStartDate: {
      type: Date,
      required: true
    },

    weekEndDate: {
      type: Date,
      required: true
    },

    weeklyFeedback: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        feedback: {
          type: String,
          enum: FEEDBACK_OPTIONS,
          required: true
        }
      }
    ],

    weeklyFeedbackCompleted: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        completed: {
          type: Boolean,
          deafult: false
        }
      }
    ],

    dailyHomework: [
      {
        day: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true,
          maxlength: 100
        },
        description: {
          type: String,
          maxlength: 1000
        },
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject"
        },
        dueDate: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

//
weekSchema.index(
  { teacherClass: 1, weekStartDate: 1 },
  { unique: true }
);

export const Week = mongoose.model("Week", weekSchema);