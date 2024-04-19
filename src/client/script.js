"use strict";

import * as db from "./db.js";

const loginButton = document.getElementById('login-button');
const usernameInput = document.getElementById('username');

loginButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const name = usernameInput.value;
    await db.login(name);
});