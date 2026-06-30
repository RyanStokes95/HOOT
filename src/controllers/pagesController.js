import { Class } from "../models/Class.js";
import { getCurrentWeek } from "./currentWeek.js";

/*  
  - Parent logs in
  - Session is created with user information, including role and user ID.
  - parentClass is queried using the parent's user ID from the session to find the classes their children are in.
  - If a class is found, getCurrentWeek is called with the parentClass ID to calculate the current week based on the class's start date.
  - The dashboard view is rendered with the parent's user information, their class details, and the current week information.
*/

export async function renderParentDashboard(req, res) {

    // Find all classes where the parent is associated with an active student
    const parentClasses = await Class.find({
        "students.parent": req.session.userId,
        "students.status": "Active"
    });

    /*
      If the parent is not associated with any classes, render the dashboard with an empty array for parentClasses
      to show the appropriate message and options for parents without classes.
    */
    if (parentClasses.length === 0) {
        return res.render("dash", {
            title: "HOOT | Parent Dashboard",
            layout: "layouts/dashLayout",
            user: req.session.user,
            classDashboards: []
        });
    }

    // Initialize an array to hold the dashboard data for each class the parent is associated with
    const classDashboards = [];

    /*
      For each class the parent is associated with, filter the students and tasks to only include those relevant to the parent,
      and get the current week for that class. Then pass all this information to the dashboard view to render the parent's dashboard
      with their classes, students, tasks, and current week information.
    */
    for (const parentClass of parentClasses) {

        const parentStudents = parentClass.students.filter(student => {
            return (
                student.parent.toString() === req.session.userId.toString() &&
                student.status === "Active"
            );
        });

        const parentTasks = parentClass.tasks.filter(task => {
            return task.assignedTo.some(parentId => {
                return parentId.toString() === req.session.userId.toString();
            });
        });

        const currentWeek = await getCurrentWeek(parentClass._id);

        classDashboards.push({
            parentClass,
            parentStudents,
            parentTasks,
            currentWeek
        });
    }

    return res.render("dash", {
        title: "HOOT | Parent Dashboard",
        layout: "layouts/dashLayout",
        user: req.session.user,
        classDashboards
    });
}

/*  
  - Teacher logs in
  - Session is created with user information, including role and user ID.
  - teacherClass is queried using the teacher's user ID from the session to find the class they teach.
  - If a class is found, getCurrentWeek is called with the teacherClass ID to calculate the current week based on the class's start date.
  - The dashboard view is rendered with the teacher's user information, their class details, and the current week information.
*/

export async function renderTeacherDashboard(req, res) {

    // Find the class associated with the logged-in teacher using their user ID from the session, and populate student parent information
    const teacherClass = await Class.findOne({
        teacher: req.session.userId
    })
    .populate([
        {
            path: "students.parent",
            select: "name"
        },
        {
            path: "tasks.assignedTo",
            select: "firstName lastName name"
        },
        {
            path: "subjects",
            select: "name"
        }
    ]);

    if (!teacherClass) {

        // If the teacher doesn't have a class, do not render weekly information and pass null values
        return res.render("dash", {
            title: "HOOT | Teacher Dashboard",
            layout: "layouts/dashLayout",
            user: req.session.user,
            teacherClass: null,
            currentWeek: null,
            weekOffset: null
        });

    }

    // Map subject IDs to subject names for quick lookup when rendering homework
    const subjectMap = new Map(
        teacherClass.subjects.map(s => [s._id.toString(), s.name])
    );

    // Get or create the current week document for this class
    const weekOffset = Number(req.query.weekOffset || 0);
    const currentWeek = await getCurrentWeek(
        teacherClass._id,
        weekOffset
    );

    // Convert Mongoose document to plain object so it can be safely modified
    const weekObj = currentWeek.toObject();

    // Attach subject names to each homework item for display in the dashboard
    weekObj.dailyHomework = currentWeek.dailyHomework.map(hw => ({
        ...hw.toObject(),
        subjectName: subjectMap.get(hw.subject?.toString()) || "Unknown"
    }));

    // Render teacher dashboard with class and enriched week data
    return res.render("dash", {
        title: "HOOT | Teacher Dashboard",
        layout: "layouts/dashLayout",
        user: req.session.user,
        teacherClass,
        currentWeek: weekObj,
        weekOffset
    });

}