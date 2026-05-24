/* global bootstrap */

/**
 * Author: Ryan Stokes
 * File: teacherScripts.js
 * Last Modified: 2026-05-24
 */

document.addEventListener("DOMContentLoaded", () => {
    initAddClass();
    initAddSubject();
    initEditSubject();
    initEditSubjectButtons();
    initDeleteSubject();
    initApproveStudent();
    initDeleteStudent();
});

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

        const modalElement = document.getElementById("addSubjectModal");

        const modal = bootstrap.Modal.getInstance(modalElement);

        modal.hide();

        form.reset();

        window.location.reload();
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
        window.location.reload();
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