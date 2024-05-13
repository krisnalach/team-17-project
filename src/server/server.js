import express from "express";
import cors from "express";
import expressSession from 'express-session';
import logger from "morgan";
import cookieParser from "cookie-parser";
import auth from './auth.js';
import Database from "./db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

const jsonHeaderFields = { "Content-Type": "application/json"};

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

/**
 * Get the user stats object of a user from the database
 * @param {string} username - username identifier to find userStats 
 * @returns - userStats object of user with name "username"
 */
async function getUserStats(username) {
    const db = await Database("blackjack");
    const userStats = await db.getUser(username);
    if (userStats.status === "error") {
        return {failed: true}; //TODO: change this
    } else {
        return userStats.data;
    }
}

app.use(expressSession(sessionConfig));
app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use(cors({
    origin: "http//localhost:3260",
    credentials: true,
}));

auth.configure(app);


// Middleware
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        console.log("login denied");
    }
}


// Routing requests
app.post(
    '/login',
    (req, res, next) => {
        auth.authenticate('local', (err, user, info) => {
            if (user === false) {
                res.writeHead(401, {jsonHeaderFields});
                res.write(JSON.stringify(info));
                res.end();
            } else {
                req.logIn(user, (err) => {
                    if (err) {
                        console.log("Login Failed")
                        return next(err);
                    }});
                // really jank workaround, manually tie user to session
                req.session.user = req.user;
                res.writeHead(200, {jsonHeaderFields});
                res.end();
            }
        }) (req, res, next);
    }
);

app.post(
    '/register',
    async (req, res) => {
        const db = await Database("blackjack");
        const {username, password} = req.body;
        // encrypt password
        const hash = await auth.digest(password);
        const addUserRet = await db.addUser(username, hash);
        if (addUserRet.status === "success") {
            res.writeHead(200, jsonHeaderFields);
        } else {
            res.writeHead(400, {"Content-type": "text/html"});
            res.write(addUserRet.message);
        }
        res.end();
    }
)

app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { console.log(err); return next(err); }
      // more jank - delete user tied to session
      delete req.session.user;
      res.redirect('/');
    });
  });

app.get('/getUserStats', async (req, res) => {
    const {username} = req.body;
    const userStats = await getUserStats(username);
    if (userStats.failed) {
        res.writeHead(404, jsonHeaderFields);
    } else {
        res.writeHead(200, jsonHeaderFields);
        res.write(JSON.stringify(userStats));
    }
    res.end();
});

app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});