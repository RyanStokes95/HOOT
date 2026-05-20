/* global bootstrap */

/**
 * Author: Ryan Stokes
 * File: teacherScripts.js
 * Last Modified: 2026-05-20
 */

document.addEventListener("DOMContentLoaded", () => {
    initAddClass();
    initAddSubject();
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