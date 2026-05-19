/**
 * Author: Ryan Stokes
 * File: parentScript.js
 * Last Modified: 2026-05-19
 */

document.addEventListener("DOMContentLoaded", () => {
    initAddStudent();
});

function initAddStudent() {
    const form = document.getElementById("addStudentForm");
    if (!form) return;
    form.addEventListener("submit", handleAddStudent);
}

async function handleAddStudent(e) {

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