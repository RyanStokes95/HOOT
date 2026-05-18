/**
 * Author: Ryan Stokes
 * File: teacherScripts.js
 * Last Modified: 2026-05-18
 */

document.addEventListener("DOMContentLoaded", () => {
    initAddClass();
});

function initAddClass() {
    const form = document.getElementById("addClassForm");
    if (!form) return;
    form.addEventListener("submit", handleAddClass);
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
      alert(data.error || "Failed to create class");
  }
};