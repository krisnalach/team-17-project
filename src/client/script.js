"use strict";
import * as db from "./db.js";

/**
 * Render the navigation bar
 */
function loadNav() {
  document.querySelector(".nav").style.display = "block";
}

/**
 * Change the currently displayed view
 * @param {string} viewId - the ID of the view to be displayed
 */
function navigate(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.style.display = "none";
  });
  document.getElementById(viewId).style.display = "block";
  window.history.pushState(null, null, `#${viewId}`);
}

document.querySelectorAll(".table").forEach((button) => {
  button.addEventListener("click", async (event) => {
    navigate("table-view");
    loadNav();
    await db.updateCurrView("table-view");
  });
});

document.querySelectorAll(".stats").forEach((button) => {
  button.addEventListener("click", async (event) => {
    navigate("stats-view");
    loadNav();
    await db.updateCurrView("stats-view");
  });
});

document.querySelectorAll(".leaderboard").forEach((button) => {
  button.addEventListener("click", async (event) => {
    navigate("lb-view");
    loadNav();
    await db.updateCurrView("lb-view");
  });
});

document.querySelectorAll(".tutorial").forEach((button) => {
  button.addEventListener("click", async (event) => {
    navigate("tutorial-view");
    loadNav();
    await db.updateCurrView("tutorial-view");
  });
});

const currView = await db.getCurrView();
if (currView !== 'home-view') {
  loadNav();
}
navigate(currView);

// login elements
const loginLabel = document.createElement("label");
const loginInput = document.createElement("input");
const loginButton = document.createElement("button");
const loginForm = document.querySelector("#login-form div");

// Set html attributes and display text
loginLabel.id = "username-label";
loginLabel.htmlFor = "username";
loginLabel.innerText = "Username: ";
loginInput.id = "username";
loginInput.type = "text";
loginInput.required = true;
loginButton.id = "login-button";
loginButton.innerText = "Login";

// logout elements
const logoutButton = document.createElement("button");
const welcomeElem = document.createElement("span");

// Attempt to grab current user in session
let user = await db.getUser();

// Set html attributes
logoutButton.innerHTML = "Log Out";
welcomeElem.innerHTML = `Welcome, ${user}!`;

await renderLogin(user);

// Add event listener for login button
loginButton.addEventListener("click", async (event) => {
  event.preventDefault();

  // update user variable
  user = loginInput.value;
  await db.login(user);
  welcomeElem.innerHTML = `Welcome, ${user}!`;

  // Remove login elements
  loginForm.removeChild(loginButton);
  loginForm.removeChild(loginInput);
  loginForm.removeChild(loginLabel);

  // Add logout elements
  loginForm.appendChild(welcomeElem);
  loginForm.appendChild(logoutButton);
});

// Add event listener for logout button
logoutButton.addEventListener("click", async (event) => {
  event.preventDefault();

  user = await db.logout();

  // Remove logout elements
  loginForm.removeChild(welcomeElem);
  loginForm.removeChild(logoutButton);

  // Add back login elements
  loginForm.appendChild(loginLabel);
  loginForm.appendChild(loginInput);
  loginForm.appendChild(loginButton);
});

/**
 * Checks to see if the user's session exists in
 * local storage. If so, render the logout UI, if not,
 * render the login UI.
 * @param {string} user - the name of the current user
 */
async function renderLogin(user) {
  if (user === -1) {
    loginForm.appendChild(loginLabel);
    loginForm.appendChild(loginInput);
    loginForm.appendChild(loginButton);
  } else {
    loginForm.appendChild(welcomeElem);
    loginForm.appendChild(logoutButton);
  }
}
