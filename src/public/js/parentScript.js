/**
 * Author: Ryan Stokes
 * File: parentScript.js
 */

document.addEventListener("DOMContentLoaded", () => {
    initAddStudent();
    initCompleteTask();
});

// Initializes the event listener for the "Add Student" form
function initAddStudent() {
    const form = document.getElementById("addStudentForm");
    console.log("loaded");
    if (!form) return;
    form.addEventListener("submit", handleAddStudent);
}

function initCompleteTask() {
    document.querySelectorAll(".complete-task-btn").forEach(button => {

        button.addEventListener("click", async () => {

            const response = await fetch("/api/parent/complete-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    taskId: button.dataset.taskId
                })
            });

            if (response.ok) {
                location.reload();
            }

        });
    });
}

// Handles the form submission for adding a student
async function handleAddStudent(e) {

    console.log("start");

    e.preventDefault();

    const form = e.target;

      const res = await fetch("/api/parent/join-class", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
            classCode: form.classCode.value,
            name: form.name.value,
      })
  });

  // If student creation is successful (response status 200), redirect to the parent dashboard, otherwise show an error message
  if (res.ok) {
      window.location.href = "/parent/dashboard";
  } else {
      const data = await res.json();
      alert(data.error || "Failed to create student");
  }
};