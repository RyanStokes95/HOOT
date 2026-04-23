/**
 * Author: Ryan Stokes
 * File: scripts.js
 * Last Modified: 2026-04-23
 */

// Runs the login and logout functions when the DOM content is loaded, ensuring the elements are available before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initLogout();
});

// Function to add submit event listener to the login form, which will call handleLogin when the form is submitted
function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", handleLogin);
}

// Function to add click event listener to the logout button, which will call handleLogout when the button is clicked
function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;
    logoutBtn.addEventListener("click", handleLogout);
}

// Function that redirects the user to the appropriate dashboard based on their role after successful login
function redirectUserToDashboard(role) {
  if (role === "teacher") {
    window.location.href = "/teacher/dashboard";
  } else if (role === "parent") {
    window.location.href = "/parent/dashboard";
  } else {
    // If role is unknown, redirect to home page as a fallback
    window.location.href = "/";
  }
}

// Function that redirects the user to the home page after successful logout
function redirectUserToHome() {
  window.location.href = "/home";
}

/* Handles the login form submission by sending a POST request to the server with the email and password, 
 * then redirects to the home page on success or shows an error message on failure */
async function handleLogin(e) {
    // Prevent default form submission behavior to handle it with JavaScript
    e.preventDefault();
    // Get the form element from the event target
    const form = e.target;

    // Send a POST request to the login endpoint with the email and password from the form
    // POSTs email and password as JSON in req body
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        email: form.email.value,
        password: form.password.value
        })
    });

    // If login is successful (response status 200), redirect to the dashboard, otherwise show an error message
    if (res.ok) {
        const data = await res.json();
        redirectUserToDashboard(data.user.role);
    } else {
        const data = await res.json();
        alert(data.error || "Login failed");
    }
}

async function handleLogout() {
    // Send a POST request to the logout endpoint to log the user out on the server side (destroy session) and clear the cookie on the client side
    const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    // If logout is successful (response status 200), redirect to the home page, otherwise show an error message
    if (res.ok) {
        redirectUserToHome();
    } else {
        const data = await res.json();
        alert(data.error || "Logout failed");
    }
}