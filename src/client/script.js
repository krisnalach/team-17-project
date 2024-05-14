"use strict";
import * as db from "./db.js";
import { renderStats } from "./stats.js";
import { renderLeaderboard } from "./leaderboard.js";

// login elements
const usernameLabel = document.getElementById("username-label");
const usernameInput = document.getElementById("username");
const passwordLabel = document.getElementById("password-label");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");

// logout elements
const logoutButton = document.getElementById("logout");
const welcomeElem = document.getElementById("welcome");

// register elements
const registerButton = document.getElementById("register");

// delete account elements
const deleteAccButton = document.getElementById("delete");

// stats view elements
const loggedInStats = document.getElementById("logged-in");
const loggedOutStats = document.getElementById("logged-out");
checkRenderStats();

// lb view element
const leaderboard = document.getElementById("lb-table");

// render lb
renderLeaderboard(leaderboard);

// footer elem
const footer = document.querySelector("footer");

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

// Add event listeners for navigation
document.querySelectorAll(".table").forEach((button) => {
  button.addEventListener("click", async (event) => {
    navigate("table-view");
    loadNav();
    await db.updateCurrView("table-view");
    footer.style.display = "none";
  });
});

document.querySelectorAll(".stats").forEach((button) => {
  button.addEventListener("click", async (event) => {
    navigate("stats-view");
    checkRenderStats();
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

// Only render the navigation bar on pages that ARENT the homepage
// Necessary for proper reloading experience
const currView = await db.getCurrView();
if (currView !== "home-view") {
  loadNav();
  footer.style.display = "none";
}
navigate(currView);

// Attempt to grab current user in session
let user = await db.getUser();
renderLogin(user);

// load stats, but need to check if user is logged in first
if (user !== -1) {
  loggedInStats.innerHTML = "";
  await renderStats(loggedInStats);
}

// Add event listener for login button
loginButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const response = await fetch(`/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  // check to see if login was successful
  if (!response.ok) {
    // reject login
    const msg = await response.json();
    alert(`Login attempt failed: ${msg.message}`);
  } else {
    // login successful, continue as normal
    // update user variable
    user = usernameInput.value;

    // "log in" user by placing username and stats in local storage
    const statRes = await fetch("/getUserStats", {
      method: "GET",
      credentials: "include",
    });
    if (statRes.ok) {
      const stats = await statRes.json();
      await db.login(user, stats);
    } else {
      const errMsg = await statRes.json();
      console.error(errMsg);
    }

    // update page
    welcomeElem.innerHTML = `Welcome, ${user}!`;
    renderLogin(user);
    window.location.reload();
  }
});

registerButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  if (username === "" || password === "") {
    alert("Registration failed: Missing credentials");
  } else {
    const response = await fetch(`/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    if (response.ok) {
      alert(`Registration succeeded: Account ${username} has been created`);
    } else {
      alert(`Registration failed: Username is taken`);
    }
  }
});

// Add event listener for logout button
logoutButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const response = await fetch("/logout", {
    method: "POST",
    credentials: "include",
  });
  // "log out" a user by removing them from local storage
  user = await db.logout();

  renderLogin(user);
  window.location.reload();
});

deleteAccButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const username = user;
  const response = await fetch("/deleteAccount", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
    credentials: "include",
  });

  //also need to logout user in database
  const logOutResponse = await fetch("/logout", {
    method: "POST",
    credentials: "include",
  });

  const msg = await response.text();
  if (response.ok) {
    alert(msg);
    user = await db.logout();
    renderLogin(user);
    window.location.reload();
  } else {
    alert(msg);
  }
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
    registerButton.style.display = "block";
    deleteAccButton.style.display = "none";

    welcomeElem.innerHTML = "Log In";
    logoutButton.style.display = "none";
  } else {
    usernameLabel.style.display = "none";
    usernameInput.style.display = "none";
    passwordLabel.style.display = "none";
    passwordInput.style.display = "none";
    loginButton.style.display = "none";
    registerButton.style.display = "none";
    deleteAccButton.style.display = "block";

    welcomeElem.innerHTML = `Welcome, ${user}!`;
    logoutButton.style.display = "block";
  }
}

// JS for Statistics page

/**
 * Check and render function to see if a user is logged in before
 * rendering their statistics
 */
async function checkRenderStats() {
  const user = await db.getUser();
  if (user === -1) {
    // user not logged in
    loggedInStats.style.display = "none";
    loggedOutStats.style.display = "block";
  } else {
    // user is logged in
    loggedInStats.style.display = "block";
    loggedOutStats.style.display = "none";
  }
}

// End of JS for Statistics page
