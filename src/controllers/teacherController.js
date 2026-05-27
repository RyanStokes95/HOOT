/**
 * Author: Ryan Stokes
 * File: teacherController.js
 * Last Modified: 2026-05-24
 */

import { Class } from "../models/Class.js";
import { Week } from "../models/Week.js";
import { getMonday } from "./currentWeek.js";

// Function which creates a new class
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

// Function which approves a student by changing their status to "Active" in the students array of the class document.
export async function approveStudent(req, res) {
    try {
        const { studentId } = req.body;
        const teacherId = req.session.userId;

        const teacherClass = await Class.findOne({ teacher: teacherId });

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const student = teacherClass.students.id(studentId);

        console.log(student)

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        student.status = "Active";
        await teacherClass.save();

        res.status(200).json({ status: student.status, student: student.name });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which deletes a student from the students array of the class document.
export async function deleteStudent(req, res) {
    try {
        const { studentId } = req.body;
        const teacherId = req.session.userId;

        const teacherClass = await Class.findOne({ teacher: teacherId });

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const student = teacherClass.students.id(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        await teacherClass.students.pull({ _id: studentId });
        await teacherClass.save();

        res.status(200).json({ message: "Student deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which adds a subject to the subjects array of the class document.
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

        // Used for testing to be able to retrieve the subject ID to be used in Edit and Delete tests.
        const addedSubject = teacherClass.subjects[teacherClass.subjects.length - 1];

        res.status(200).json({ subject: addedSubject.name, _id: addedSubject._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which deletes a subject from the subjects array of the class document.
export async function deleteSubject(req, res) {
    try {
        const { subjectId } = req.body;
        const teacherId = req.session.userId;

        const teacherClass = await Class.findOne({ teacher: teacherId });

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const subject = teacherClass.subjects.id(subjectId);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found." });
        }

        await teacherClass.subjects.pull({ _id: subjectId });
        await teacherClass.save();

        res.status(200).json({ message: "Subject deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which edits a subject in the subjects array of the class document by changing its name.
export async function editSubject(req, res) {
    try {
        const { subjectId, name } = req.body;
        const teacherId = req.session.userId;

        const teacherClass = await Class.findOne({ teacher: teacherId });

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const subject = teacherClass.subjects.id(subjectId);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found." });
        }

        subject.name = name;

        await teacherClass.save();

        return res.status(200).json({
            message: "Subject updated successfully.",
            subject: subject.name
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export async function addHomework(req, res) {
    try {
        console.log(req.session.userId);
        const { title, description, subject, dueDate } = req.body;
        const teacherId = req.session.userId;
        const day = new Date().toLocaleDateString("en-US", { weekday: "long" });

        const teacherClass = await Class.findOne({ teacher: teacherId });

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const weekStartDate = getMonday(new Date());

        const week = await Week.findOne({ teacherClass: teacherClass._id, weekStartDate });

        if (!week) {
            return res.status(404).json({ message: "Week not found." });
        }

        console.log(day);

        const newHomework = {
            day: day,
            title,
            description,
            subject,
            dueDate
        };

        console.log(newHomework);

        week.dailyHomework.push(newHomework);
        await week.save();

        res.status(200).json({ message: "Homework added." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteHomework(req, res) {
    try {
        const { homeworkId } = req.body;
        const teacherId = req.session.userId;

        const week = await Week.findOne({ teacherClass: teacherId });

        if (!week) {
            return res.status(404).json({ message: "Week not found." });
        }

        const homework = week.homework.id(homeworkId);

        if (!homework) {
            return res.status(404).json({ message: "Homework not found." });
        }

        await week.homework.pull({ _id: homeworkId });
        await week.save();

        res.status(200).json({ message: "Homework deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function editHomework(req, res) {
    try {
        const { homeworkId, day, title, description, subjectId, dueDate } = req.body;
        const teacherId = req.session.userId;

        const week = await Week.findOne({ teacherClass: teacherId });

        if (!week) {
            return res.status(404).json({ message: "Week not found." });
        }

        const homework = week.homework.id(homeworkId);

        if (!homework) {
            return res.status(404).json({ message: "Homework not found." });
        }

        homework.day = day;
        homework.title = title;
        homework.description = description;
        homework.subject = subjectId;
        homework.dueDate = dueDate;
        await week.save();

        res.status(200).json({ message: "Homework updated." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function addTask(req, res) {
    try {
        const { title, description, assignedTo, dueDate } = req.body;
        const teacherId = req.session.userId;

        const teacherClass = await Class.findOne({ teacher: teacherId });

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const newTask = {
            title,
            description,
            assignedTo,
            dueDate
        };

        teacherClass.tasks.push(newTask);
        await teacherClass.save();

        res.status(200).json({ message: "Task added." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteTask(req, res) {
    try {
        const { taskId } = req.body;
        const teacherId = req.session.userId;

        const teacherClass = await Class.findOne({ teacher: teacherId });

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const task = teacherClass.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        await teacherClass.tasks.pull({ _id: taskId });
        await teacherClass.save();

        res.status(200).json({ message: "Task deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function editTask(req, res) {
    try {
        const { taskId, title, description, assignedTo, dueDate } = req.body;
        const teacherId = req.session.userId;

        const teacherClass = await Class.findOne({ teacher: teacherId });

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const task = teacherClass.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        task.title = title;
        task.description = description;
        task.assignedTo = assignedTo;
        task.dueDate = dueDate;
        await teacherClass.save();

        res.status(200).json({ message: "Task updated." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


        
