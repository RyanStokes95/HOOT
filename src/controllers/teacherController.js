/**
 * Author: Ryan Stokes
 * File: teacherController.js
 */

import { Class } from "../models/Class.js";
import { Week } from "../models/Week.js";
import { getMonday, getCurrentWeek } from "./currentWeek.js";

// Function which creates a new class
export async function createClass(req, res) {
    try {
        const { name } = req.body;
        const teacherId = req.session.userId;

        // Generate a unique class code for the new class using the generateClassCode function in this file.
        const classCode = generateClassCode();

        // Check if the teacher already has a class. If they do, return a 400 status with an error message.
        const existingClass = await getClassByTeacherId(teacherId);

         if (existingClass) {
            return res.status(400).json({ message: "You already have a class." });
        }

        // Create a new class document in the database with the provided name, generated class code, and teacher ID.
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
export function generateClassCode() {
    /*  
        In this function, we define a string of possible characters (uppercase letters and numbers) and 
        then use a loop to randomly select 6 characters from that string to create the class code. The generated 
        code is returned as a string.
    */
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Helper functions to retrieve the class document associated with a teacher ID and the week document associated with a class ID.
function getClassByTeacherId(teacherId) {
    const teacherClass =  Class.findOne({ teacher: teacherId });
    return teacherClass;
}

// Helper function to retrieve the week document associated with a class ID and the current week's start date
function getWeekByClassId(classId) {
    const weekStartDate = getMonday(new Date());
    const week = Week.findOne({ teacherClass: classId, weekStartDate });
    return week;
}

// Function which approves a student by changing their status to "Active" in the students array of the class document.
export async function approveStudent(req, res) {
    try {
        const { studentId } = req.body;
        const teacherId = req.session.userId;

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the student in the students array of the class document using the student ID and check if they exist.
        const student = teacherClass.students.id(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Change the student's status to "Active" and save the updated class document.
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

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the student in the students array of the class document using the student ID and check if they exist.
        const student = teacherClass.students.id(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Remove the student from the students array and save the updated class document.
        await teacherClass.students.pull({ _id: studentId });
        await teacherClass.save();

        res.status(200).json({ message: "Student deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/* 
    The feedback and Homework save to the week model instead of the class model as they are specific to a week,
    whereas the subjects, tasks and bulletins are saved to the class model as they are not specific to a week. 
*/

// Feedback Functions

// Function which adds feedback for a student for the current week by pushing a new feedback object to the weeklyFeedback array of the week document.
export async function addFeedback(req, res) {
    try {
        const { studentId, feedback, weekOffset } = req.body;
        const teacherId = req.session.userId;

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the student in the students array of the class document using the student ID and check if they exist.
        const student = teacherClass.students.id(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Find the week document associated with the class ID and current week's start date and check if it exists. If it doesn't, return a 404 status with an error message.
        const week = await getCurrentWeek(
            teacherClass._id,
            Number(weekOffset || 0)
        );

        if (!week) {
            return res.status(404).json({ message: "Week not found." });
        }

        // Remove any existing feedback for the student for the current week before adding the new feedback.
        // Allows for ammedning of feedback.
        week.weeklyFeedback = week.weeklyFeedback.filter(item => {
            return item.student.toString() !== studentId;
        });

        /* 
            Loop through each of the feedback entires (i.e. each subject) and push a new feedback object to the weeklyFeedback array 
            of the week document with the student ID, subject ID and feedback rating, then save the updated week document.
        */
        for (const [subjectId, rating] of Object.entries(feedback)) {
            week.weeklyFeedback.push({
                student: studentId,
                subject: subjectId,
                feedback: rating,
            });
        }

        const completedRecord = week.weeklyFeedbackCompleted.find(
            entry => entry.student.toString() === studentId
        );

        if (completedRecord) {
            completedRecord.completed = true;
        } else {
            week.weeklyFeedbackCompleted.push({
                student: studentId,
                completed: true
            });
        }

        await week.save();

        res.status(200).json({ message: "Feedback added." });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

// Function which adds a subject to the subjects array of the class document.
export async function addSubject(req, res) {
    try {
        const { subject } = req.body;
        const teacherId = req.session.userId;

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Create a new subject object with the provided subject name and push it to the subjects array of the class document, then save the updated class document.
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

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the subject in the subjects array of the class document using the subject ID and check if it exists.
        const subject = teacherClass.subjects.id(subjectId);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found." });
        }

        // Remove the subject from the subjects array and save the updated class document.
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

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the subject in the subjects array of the class document using the subject ID and check if it exists.
        const subject = teacherClass.subjects.id(subjectId);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found." });
        }

        // Update the subject's name with the new value provided in the request body, then save the updated class document.
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

// Homework Functions

// Function which adds homework for a subject for a specific day by pushing a new homework object to the dailyHomework array of the week document.
export async function addHomework(req, res) {
    try {
        const { title, description, subject, dueDate } = req.body;
        const teacherId = req.session.userId;
        const day = new Date().toLocaleDateString("en-US", { weekday: "long" });

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the week document associated with the class ID and current week's start date and check if it exists. If it doesn't, return a 404 status with an error message.
        const week = await getWeekByClassId(teacherClass._id);

        if (!week) {
            return res.status(404).json({ message: "Week not found." });
        }

        // Create a new homework object with the provided details and push it to the dailyHomework array of the week document, then save the updated week document.
        const newHomework = {
            day: day,
            title,
            description,
            subject,
            dueDate
        };

        week.dailyHomework.push(newHomework);
        await week.save();

        res.status(200).json({ message: "Homework added." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which deletes a homework entry from the dailyHomework array of the week document.
export async function deleteHomework(req, res) {
    try {
        const { homeworkId, weekOffset } = req.body;
        const teacherId = req.session.userId;

         const teacherClass = await getClassByTeacherId(teacherId);

        // Find the week document associated with the class ID and current week's start date and check if it exists. If it doesn't, return a 404 status with an error message.
        const week = await getCurrentWeek(
            teacherClass._id,
            Number(weekOffset || 0)
        );

        if (!week) {
            return res.status(404).json({ message: "Week not found." });
        }

        // Find the homework in the dailyHomework array of the week document using the homework ID and check if it exists.
        const homework = week.dailyHomework.id(homeworkId);

        if (!homework) {
            return res.status(404).json({ message: "Homework not found." });
        }

        // Remove the homework from the dailyHomework array and save the updated week document.
        await week.dailyHomework.pull({ _id: homeworkId });
        await week.save();

        res.status(200).json({ message: "Homework deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which edits a homework entry in the dailyHomework array of the week document by changing its details.
export async function editHomework(req, res) {
    try {
        const { homeworkId, weekOffset, day, title, description, subject, dueDate } = req.body;
        const teacherId = req.session.userId;

        const teacherClass = await getClassByTeacherId(teacherId);

        // Find the week document associated with the class ID and current week's start date and check if it exists. If it doesn't, return a 404 status with an error message.
        const week = await getCurrentWeek(
            teacherClass._id,
            Number(weekOffset || 0)
        );

        if (!week) {
            return res.status(404).json({ message: "Week not found." });
        }

        // Find the homework in the dailyHomework array of the week document using the homework ID and check if it exists.
        const homework = week.dailyHomework.id(homeworkId);

        if (!homework) {
            return res.status(404).json({ message: "Homework not found." });
        }

        // Update the homework's details with the new values provided in the request body, then save the updated week document.
        if (day) {
            homework.day = day;
        }
        homework.title = title;
        homework.description = description;
        homework.subject = subject;
        homework.dueDate = dueDate;
        await week.save();

        res.status(200).json({ message: "Homework updated." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Task Functions

// Function which adds a task to the tasks array of the class document.
export async function addTask(req, res) {
    try {
        const { title, description, assignedTo, dueDate } = req.body;
        const teacherId = req.session.userId;

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Create a new task object with the provided details and push it to the tasks array of the class document, then save the updated class document.
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

// Function which deletes a task from the tasks array of the class document.
export async function deleteTask(req, res) {
    try {
        const { taskId } = req.body;
        const teacherId = req.session.userId;

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the task in the tasks array of the class document using the task ID and check if it exists.
        const task = teacherClass.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // Remove the task from the tasks array and save the updated class document.
        await teacherClass.tasks.pull({ _id: taskId });
        await teacherClass.save();

        res.status(200).json({ message: "Task deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which edits a task in the tasks array of the class document by changing its details.
export async function editTask(req, res) {
    try {
        const { taskId, title, description, assignedTo, dueDate } = req.body;
        const teacherId = req.session.userId;

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the task in the tasks array of the class document using the task ID and check if it exists.
        const task = teacherClass.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // Update the task's details with the new values provided in the request body, then save the updated class document.
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

// Bulletin Functions

// Function which adds a bulletin to the bulletins array of the class document.
export async function addBulletin(req, res) {
    try {
        const { title, content } = req.body;
        const teacherId = req.session.userId;

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Create a new bulletin object with the provided details and push it to the bulletins array of the class document, then save the updated class document.
        const newBulletin = {
            title,
            content
        };

        teacherClass.bulletins.push(newBulletin);
        await teacherClass.save();

        res.status(200).json({ message: "Bulletin added." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which deletes a bulletin from the bulletins array of the class document.
export async function deleteBulletin(req, res) {
    try {
        const { bulletinId } = req.body;
        const teacherId = req.session.userId;

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the bulletin in the bulletins array of the class document using the bulletin ID and check if it exists.
        const bulletin = teacherClass.bulletins.id(bulletinId);

        if (!bulletin) {
            return res.status(404).json({ message: "Bulletin not found." });
        }

        // Remove the bulletin from the bulletins array and save the updated class document.
        await teacherClass.bulletins.pull({ _id: bulletinId });
        await teacherClass.save();

        res.status(200).json({ message: "Bulletin deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Function which edits a bulletin in the bulletins array of the class document by changing its title and content.
export async function editBulletin(req, res) {
    try {
        const { bulletinId, title, content } = req.body;
        const teacherId = req.session.userId;

        // Find the class document associated with the teacher ID and check if it exists. If it doesn't, return a 404 status with an error message.
        const teacherClass = await getClassByTeacherId(teacherId);

        if (!teacherClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Find the bulletin in the bulletins array of the class document using the bulletin ID and check if it exists.
        const bulletin = teacherClass.bulletins.id(bulletinId);

        if (!bulletin) {
            return res.status(404).json({ message: "Bulletin not found." });
        }

        // Update the bulletin's title and content with the new values provided in the request body, then save the updated class document.
        bulletin.title = title;
        bulletin.content = content;
        await teacherClass.save();

        res.status(200).json({ message: "Bulletin updated." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
