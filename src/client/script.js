"use strict";

import * as db from "./db.js";

const loginButton = document.getElementById('login-button');
const usernameInput = document.getElementById('username');

loginButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const name = usernameInput.value;
    await db.login(name);
    
    // Remove login elements
    const loginForm = document.querySelector('#login-form div');
    loginForm.removeChild(loginButton);
    loginForm.removeChild(usernameInput);

    // Add logout elements
    const logoutButton = document.createElement('button');
    logoutButton.innerHTML = 'Log Out';
    loginForm.appendChild(logoutButton);

});