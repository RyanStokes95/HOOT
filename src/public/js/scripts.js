/**
 * Author: Ryan Stokes
 * File: scripts.js
 * Last Modified: 2026-04-30
 */

// Runs the login and logout functions when the DOM content is loaded, ensuring the elements are available before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initLogout();
  initRegisterParent();
  initRegisterTeacher();
});

const csrfToken = document.querySelector('input[name="csrf-token"]').value;

//init functions to add event listeners to the login form, logout button, and registration forms for parents and teachers



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

// Function to add submit event listener to the parent registration form, which will call handleRegisterParent when the form is submitted
function initRegisterParent() {
  const form = document.getElementById("registerFormParent");
  if (!form) return;
  form.addEventListener("submit", handleRegisterParent);
}

// Function to add submit event listener to the teacher registration form, which will call handleRegisterTeacher when the form is submitted
function initRegisterTeacher() {
  const form = document.getElementById("registerFormTeacher");
  if (!form) return;
  form.addEventListener("submit", handleRegisterTeacher);
}



// Redirect functions to navigate the user to the appropriate page after login or logout



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



/* Handler functions to process the login, logout, and registration form submissions 
 * by sending appropriate requests to the server and handling the responses */



/* Handles the parent registration form submission by sending a POST request to the server with the name, email, and password,
* then redirects to the home page on success or shows an error message on failure */
async function handleRegisterParent(e) {
  // Prevent default form submission behavior to handle it with JavaScript
  e.preventDefault();
  // Get the form element from the event target
  const form = e.target;

  // Send a POST request to the register endpoint with the form data
  // POSTs name, email, and password as JSON in req body
  const res = await fetch("/api/auth/register-parent", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          password: form.password.value
      })
  });

  // If registration is successful (response status 200), redirect to the home page, otherwise show an error message
  if (res.ok) {
      redirectUserToHome();
  } else {
      const data = await res.json();
      alert(data.error || "Registration failed");
  }
}

/* Handles the teacher registration form submission by sending a POST request to the server with the name, email, password, and teacher code,
* then redirects to the home page on success or shows an error message on failure */
async function handleRegisterTeacher(e) {
  // Prevent default form submission behavior to handle it with JavaScript
  e.preventDefault();
  // Get the form element from the event target
  const form = e.target;
  // Send a POST request to the register endpoint with the form data
  // POSTs name, email, password, and teacher code as JSON in req body
  const res = await fetch("/api/auth/register-teacher", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          password: form.password.value,
          teacherCode: form.teacherCode.value
      })
  });
  // If registration is successful (response status 200), redirect to the home page, otherwise show an error message
  if (res.ok) {
      redirectUserToHome();
  } else {
      const data = await res.json();
      alert(data.error || "Registration failed");
  }
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
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
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
  // No body is needed for logout, just the POST request to trigger the server-side logout logic
  const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
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