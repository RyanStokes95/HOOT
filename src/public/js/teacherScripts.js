/* global bootstrap */

/**
 * Author: Ryan Stokes
 * File: teacherScripts.js
 */

document.addEventListener("DOMContentLoaded", () => {
    initAddClass();
    // Subject
    initAddSubject();
    initEditSubject();
    initEditSubjectButtons();
    initDeleteSubject();
    // Student
    initApproveStudent();
    initDeleteStudent();
    // Task
    initAddTask();
    initEditTask();
    initEditTaskButtons();
    initDeleteTask();
    // Homework
    initAddHomework();
    initDeleteHomework();
    iniEditHomeworkButtons();
    initEditHomework();
    // Bulletin
    initAddBulletin();
    initEditBulletin();
    initEditBulletinButtons();
    initDeleteBulletin();
    // Feedback
    initAddFeedback();
});

// Initialize event listeners for all buttons and forms on the teacher dashboard.

function initAddClass() {
    const form = document.getElementById("addClassForm");
    if (!form) return;
    form.addEventListener("submit", handleAddClass);
}

function initAddSubject() {
    const form = document.getElementById("addSubjectForm");
    if (!form) return;
    form.addEventListener("submit", handleAddSubject);
}

function initEditSubject() {
    const form = document.getElementById("editSubjectForm");
    if (!form) return;
    form.addEventListener("submit", handleEditSubject);
}

function initEditSubjectButtons() {
    const editButtons = document.querySelectorAll(".edit-subject-btn");

    // loop needed to add event listeners to each edit button, which populate the edit form with the current subject information when clicked.
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.getElementById("editSubjectId").value = button.dataset.subjectId;
            document.getElementById("editSubjectName").value = button.dataset.subjectName;
        });
    });
}

function initDeleteSubject() {
    const deleteButtons = document.querySelectorAll(".delete-subject-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", handleDeleteSubject);
    });
}

function initApproveStudent() {
    const approveButtons = document.querySelectorAll(".approve-student-btn");
    approveButtons.forEach(button => {
        button.addEventListener("click", handleApproveStudent);
    });
}

function initDeleteStudent() {
    const deleteButtons = document.querySelectorAll(".delete-student-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", handleDeleteStudent);
    });
}

function initAddFeedback() {
    const forms = document.querySelectorAll(".addFeedbackForm");

    forms.forEach(form => {
        form.addEventListener("submit", handleAddFeedback);
    });
}

function initAddHomework() {
    const form = document.getElementById("addHomeworkForm");
    if (!form) return;
    form.addEventListener("submit", handleAddHomework);
}

function initEditHomework() {
    const form = document.getElementById("editHomeworkForm");
    if (!form) return;
    form.addEventListener("submit", handleEditHomework);
}

function iniEditHomeworkButtons() {
    const editButtons = document.querySelectorAll(".edit-homework-btn");
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.getElementById("editHomeworkId").value = button.dataset.homeworkId;
            document.getElementById("editHomeworkTitle").value = button.dataset.homeworkTitle;
            document.getElementById("editHomeworkDescription").value = button.dataset.homeworkDescription;
            document.getElementById("editHomeworkDueDate").value = button.dataset.homeworkDueDate;
            document.getElementById("editHomeworkSubject").value = button.dataset.homeworkSubject;
        });
    });
}

function initDeleteHomework() {
    const deleteButtons = document.querySelectorAll(".delete-homework-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", handleDeleteHomework);
    });
}

function initAddTask() {
    const form = document.getElementById("addTaskForm");
    if (!form) return;
    form.addEventListener("submit", handleAddTask);
}

function initEditTask() {
    const form = document.getElementById("editTaskForm");
    if (!form) return;
    form.addEventListener("submit", handleEditTask);
}

function initEditTaskButtons() {
    document.querySelectorAll(".edit-task-btn").forEach(button => {
        button.addEventListener("click", () => {
            console.log(button.dataset);

            document.getElementById("editTaskId").value = button.dataset.taskId;
            document.getElementById("editTaskTitle").value = button.dataset.taskTitle;
            document.getElementById("editTaskDescription").value = button.dataset.taskDescription;

            document.getElementById("editTaskDueDate").value =
                button.dataset.taskDuedate
                    ? new Date(button.dataset.taskDuedate).toISOString().split("T")[0]
                    : "";
        });
    });
}

function initDeleteTask() {
    const deleteButtons = document.querySelectorAll(".delete-task-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", handleDeleteTask);
    });
}

function initAddBulletin() {
    const form = document.getElementById("addBulletinForm");
    if (!form) return;
    form.addEventListener("submit", handleAddBulletin);
}

function initEditBulletin() {
    const form = document.getElementById("editBulletinForm");
    if (!form) return;
    form.addEventListener("submit", handleEditBulletin);
}

function initEditBulletinButtons() {
    const editButtons = document.querySelectorAll(".edit-bulletin-btn");
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.getElementById("editBulletinId").value = button.dataset.bulletinId;
            document.getElementById("editBulletinTitle").value = button.dataset.bulletinTitle;
            document.getElementById("editBulletinContent").value = button.dataset.bulletinContent;
        });
    });
}

function initDeleteBulletin() {
    const deleteButtons = document.querySelectorAll(".delete-bulletin-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", handleDeleteBulletin);
    });
}

function modalReset(form, modalId) {
    const modalElement = document.getElementById(modalId);

        const modal = bootstrap.Modal.getInstance(modalElement);

        /* 
        .blur() is used to remove focus from the submit button after clicking, 
        which prevents the button from remaining in a focused state and allows 
        the modal to close properly without any focus-related issues.
        */

        document.activeElement.blur();

        modal.hide();

        form.reset();

        window.location.reload();
}

// Quick JS fix for dropdown, to be expanded upon and put in a function

document.addEventListener("click", (e) => {
    const dropdowns = document.querySelectorAll(".custom-dropdown");

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector(".dropdown-trigger");

        if (dropdown.contains(e.target)) {
            if (trigger.contains(e.target)) {
                dropdown.classList.toggle("open");
            }
        } else {
            dropdown.classList.remove("open");
        }
    });
});

// Handler functions for each form and button, which make API calls to the corresponding API endpoints and update the UI based on the response.

// e refers to the event object passed to the handler function when an event occurs, such as a form submission or button click.
// preventDefault() is called to stop the default behavior of the event (such asform submission causing a page reload).

async function handleAddClass(e) {

    e.preventDefault();

    const form = e.target;

      const res = await fetch("/api/teacher/create-class", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
            name: form.name.value,
      })
  });

  // If class creation is successful (response status 200), redirect to the teacher dashboard, otherwise show an error message
    if (res.ok) {
        window.location.href = "/teacher/dashboard";
    } else {
        const data = await res.json();
        alert(data.message || "Failed to create class");
    }
};

async function handleAddHomework(e) {

    e.preventDefault();

    const form = e.target;

    const res = await fetch("/api/teacher/add-homework", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        
        body: JSON.stringify({
            title: form.title.value,
            description: form.description.value,
            dueDate: form.dueDate.value,
            subject: form.subject.value
        })
    });

    if (res.ok) {
        modalReset(form, "addHomeworkModal");
    } else {
        const data = await res.json();
        alert(data.message || "Failed to add homework");
    }
}

async function handleEditHomework(e) {

    e.preventDefault();

    const form = e.target;

    const res = await fetch("/api/teacher/edit-homework", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            homeworkId: form.homeworkId.value,
            title: form.title.value,
            description: form.description.value,
            dueDate: form.dueDate.value,
            subject: form.subject.value
        })
    });

    if (res.ok) {
        modalReset(form, "editHomeworkModal");
    } else {
        const data = await res.json();
        alert(data.message || "Failed to edit homework");
    }
}

async function handleDeleteHomework(e) {

    e.preventDefault();

    const homeworkId = e.currentTarget.dataset.homeworkId;

    const weekOffset = document.getElementById("weekOffset").value;

    const row = e.currentTarget.closest(".list-group-item");

    const res = await fetch("/api/teacher/delete-homework", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            homeworkId,
            weekOffset 
        })
    });

    if (res.ok) {

        row?.remove();

    } else {

        const data = await res.json();
        alert(data.message || "Failed to delete homework");
    }
}

async function handleAddSubject(e) {

    e.preventDefault();

    const form = e.target;

    const res = await fetch("/api/teacher/add-subject", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                subject: form.subject.value,
        })
    });

    // If subject addition is successful (response status 200), show a success message, otherwise show an error message
    if (res.ok) {
        modalReset(form, "addSubjectModal");
    } else {
        const data = await res.json();
        alert(data.message || "Failed to add subject");
    }
};

async function handleEditSubject(e) {

    e.preventDefault();

    const form = document.getElementById("editSubjectForm");

    const res = await fetch("/api/teacher/edit-subject", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subjectId: form.subjectId.value,
            name: form.subject.value
        })
    });

    if (res.ok) {
        modalReset(form, "editSubjectModal");
    } else {
        const data = await res.json();
        alert(data.message || "Failed to edit subject");
    }
}

async function handleDeleteSubject(e) {

    e.preventDefault();

    const subjectId = e.currentTarget.dataset.subjectId;

    const row = e.currentTarget.closest("tr");

    const res = await fetch("/api/teacher/delete-subject", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subjectId
        })
    });

    if (res.ok) {
        row.remove();
    } else {
        const data = await res.json();
        alert(data.message || "Failed to delete subject");
    }
}

async function handleApproveStudent(e) {

    e.preventDefault();
    // Get student ID from data attribute of the clicked button
    const studentId = e.currentTarget.dataset.studentId;

    const res = await fetch("/api/teacher/approve-student", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                studentId,
        })
    });

    if (res.ok) {
        window.location.reload();
    } else {
        const data = await res.json();
        alert(data.message || "Failed to approve student");
    };
}

async function handleDeleteStudent(e) {

    e.preventDefault();

    const studentId = e.currentTarget.dataset.studentId;

    const row = e.currentTarget.closest("tr");

    const res = await fetch("/api/teacher/delete-student", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                studentId,
        })
    });

    if (res.ok) {
        row.remove();
    } else {
        const data = await res.json();
        alert(data.message || "Failed to remove student");
    };
}

async function handleAddFeedback(e) {

    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const feedback = {};
    // Loops through form data entries to find feedback for each subject.
    for (const [key, value] of formData.entries()) {
        // regex pattern matches keys in the format "feedback[subjectId]", where subjectId is a 24-character hexadecimal string (MongoDB ObjectId).
        if (/^feedback\[[a-f0-9]{24}\]$/i.test(key)) {
            // Extracts the subjectId from the key by removing the "feedback[" prefix and "]" suffix.
            const subjectId = key.slice(9, -1);
            // Stores the feedback value in the feedback object using the subjectId as the key.
            feedback[subjectId] = value;
        }
    }

    const res = await fetch("/api/teacher/add-feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            studentId: formData.get("studentId"),
            weekOffset: formData.get("weekOffset"),
            feedback
        })
    });

    if (res.ok) {
        const modalElement = form.closest(".modal");

        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

        /*
        .blur() is used to remove focus from the submit button after clicking, 
        which prevents the button from remaining in a focused state and allows 
        the modal to close properly without any focus-related issues.
        */

        document.activeElement.blur();

        modal.hide();

        form.reset();

        window.location.reload();
    } else {
        const data = await res.json();
        alert(data.message || "Failed to add feedback");
    }
}

async function handleAddTask(e) {

    e.preventDefault();

    const form = document.getElementById("addTaskForm");

    const res = await fetch("/api/teacher/add-task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: form.title.value,
            description: form.description.value,
            dueDate: form.dueDate.value,
            assignedTo: Array.from(form.querySelectorAll("input[name='assignedTo']:checked")).map(checkbox => checkbox.value)
        })
    });
    
    if (res.ok) {

        modalReset(form, "addTaskModal");
    } else {
        const data = await res.json();
        alert(data.message || "Failed to add task");
    }
}

async function handleEditTask(e) {

    e.preventDefault();

    const form = document.getElementById("editTaskForm");

    const res = await fetch("/api/teacher/edit-task", {

        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            taskId: form.taskId.value,
            title: form.title.value,
            description: form.description.value,
            dueDate: form.dueDate.value,
            assignedTo: Array.from(form.querySelectorAll("input[name='assignedTo']:checked")).map(checkbox => checkbox.value)
        })
    });

    if (res.ok) {

        modalReset(form, "editTaskModal");
    } else {
        const data = await res.json();
        alert(data.message || "Failed to edit task");
    }
}

async function handleDeleteTask(e) {

    e.preventDefault();

    const taskId = e.currentTarget.dataset.taskId;

    // matches your current structure
    const row = e.currentTarget.closest(".list-group-item");

    const res = await fetch("/api/teacher/delete-task", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ taskId })
    });

    if (res.ok) {

        // remove task from UI
        if (row) row.remove();

    } else {

        const data = await res.json();
        alert(data.message || "Failed to delete task");
    }
}

async function handleAddBulletin(e) {

    e.preventDefault();

    const form = document.getElementById("addBulletinForm");

    const res = await fetch("/api/teacher/add-bulletin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: form.title.value,
            content: form.content.value
        })
    });

    if (res.ok) {

        modalReset(form,"addBulletinModal");
    } else {
        const data = await res.json();
        alert(data.message || "Failed to add bulletin");
    }
}

async function handleEditBulletin(e) {

    e.preventDefault();

    const form = document.getElementById("editBulletinForm");

    const res = await fetch("/api/teacher/edit-bulletin", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bulletinId: form.bulletinId.value,
            title: form.title.value,
            content: form.content.value
        })
    });

    if (res.ok) {

        modalReset(form, "editBulletinModal");
    } else {
        const data = await res.json();
        alert(data.message || "Failed to edit bulletin");
    }
}

async function handleDeleteBulletin(e) {

    e.preventDefault();

    const bulletinId = e.currentTarget.dataset.bulletinId;

    // matches your current structure
    const row = e.currentTarget.closest(".list-group-item");

    const res = await fetch("/api/teacher/delete-bulletin", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bulletinId })
    });

    if (res.ok) {

        // remove task from UI
        if (row) row.remove();

    } else {

        const data = await res.json();
        alert(data.message || "Failed to delete bulletin");
    }
}
