document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initRegisterTeacher();
  initRegisterParent();
  initLogout();
});

function initLogin() {
  const form = document.getElementById("loginForm");
  
  if (!form) return;

  form.addEventListener("submit", handleLogin);
}

function redirectUserToDashboard(role) {
  if (role === "teacher") {
    window.location.href = "/teacher/dashboard";
  } else if (role === "parent") {
    window.location.href = "/parent/dashboard";
  } else {
    window.location.href = "/";
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

function initRegisterTeacher() {}
function initRegisterParent() {}
function initLogout() {}