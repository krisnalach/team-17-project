"use strict";

import * as db from "./db.js";

const loginButton = document.getElementById('login-button');
const usernameInput = document.getElementById('username');

loginButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const name = usernameInput.value;
    console.log(name);
    const userStats = db.getUserStats(name);
    console.log(userStats);
});