import express from "express";
import expressSession from 'express-session';
import logger from "morgan";
import * as db from "./db.js";

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

async funtion updateLeaderboard() {

}

app.use(expressSession(sessionConfig));
app.use(logger("dev"));
app.use(express.json());
app.use(express.static('client'));
