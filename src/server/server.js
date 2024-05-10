import express from "express";
import expressSession from 'express-session';
import logger from "morgan";
import auth from './auth.js';
import * as db from "./db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

// Cretae Express app
const app = express();
const port = process.env.PORT || 3260;

// Create session configuration
const sessionConfig = {
    secret: process.env.SECRET || 'SECRET',
    resave: false,
    saveUninitialized: false,
}


// Database operations

app.use(expressSession(sessionConfig));
app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

auth.configure(app);

// Routing requests


app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});