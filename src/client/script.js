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
const usernameLabel = document.getElementById("username-label");
const usernameInput = document.getElementById("username");
const passwordLabel = document.getElementById("password-label");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");

// logout elements
const logoutButton = document.getElementById("logout");
const welcomeElem = document.getElementById("welcome");

// Attempt to grab current user in session
let user = await db.getUser();
renderLogin(user);

// Add event listener for login button
loginButton.addEventListener("click", async (event) => {
  event.preventDefault();

  // update user variable
  user = usernameInput.value;
  await db.login(user);
  welcomeElem.innerHTML = `Welcome, ${user}!`;

  renderLogin(user);
});

// Add event listener for logout button
logoutButton.addEventListener("click", async (event) => {
  event.preventDefault();
  user = await db.logout();

  renderLogin(user);
});

/**
 * Checks to see if the user's session exists in
 * local storage. If so, render the logout UI, if not,
 * render the login UI.
 * @param {string} user - the name of the current user
 */
function renderLogin(user) {
  if (user === -1) {
    usernameLabel.style.display = "block";
    usernameInput.style.display = "block";
    passwordLabel.style.display = "block";
    passwordInput.style.display = "block";
    loginButton.style.display = "block";

    welcomeElem.innerHTML = "Log In"
    logoutButton.style.display = "none";
  } else {
    usernameLabel.style.display = "none";
    usernameInput.style.display = "none";
    passwordLabel.style.display = "none";
    passwordInput.style.display = "none";
    loginButton.style.display = "none";

    welcomeElem.innerHTML = `Welcome, ${user}!`;
    logoutButton.style.display = "block";
  }
}
