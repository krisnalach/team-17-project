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
    console.log(userStats);
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

/**
 * Check to see if there is a user currently logged in
 * @param {obj} req - request sent by the client
 * @returns - true is a user is logged in, false otherwise
 */
function isLoggedIn(req) {
    return req.session.hasOwnProperty("signedIn") && req.session.signedIn;
}


// Routing requests

/**
 * Routing for login requests
 * @param {string} - express path
 * @param {function} - callback function to handle logging in
 * @writes - 200 status if successful, 401 if failed with error message
 */ 
app.post(
    '/login',
    (req, res, next) => {
        auth.authenticate('local', (err, user, info) => {
            if (user === false) {
                res.writeHead(401, jsonHeaderFields);
                res.write(JSON.stringify(info));
                res.end();
            } else {
                req.logIn(user, (err) => {
                    if (err) {
                        console.log("Login Failed")
                        return next(err);
                    }});
                // really jank workaround, manually tie user to session
                // and tie signedIn check to session
                req.session.user = req.user;
                req.session.signedIn = true;
                console.log(Object.keys(req.session));
                res.writeHead(200, jsonHeaderFields);
                res.end();
            }
        }) (req, res, next);
    }
);

/**
 * Routing for registering accounts
 * @param {string} - express path
 * @param {function} - callback function to handle registering
 * @writes - 200 status if successful, 409 if failed with error message
 */ 
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
            res.writeHead(409, {"Content-type": "text/html"});
            res.write(addUserRet.message);
        }
        res.end();
    }
)

/**
 * Routing for logout
 * @param {string} - express path
 * @param {function} - callback function to handle logging out
 * @writes - redirects user upon successful logout to '/'
 */ 
app.post('/logout', function(req, res, next){
    console.log(Object.keys(req.session));
    req.logout(function(err) {
      if (err) { console.log(err); return next(err); }
      // more jank - delete user tied to session
      console.log(Object.keys(req.session));
      delete req.session.user;
      delete req.session.signedIn;
      res.redirect('/');
    });
  });

/**
 * Routing for obtaining user statistics
 * @param {string} - express path
 * @param {function} - callback function to handle stat gathering
 * @writes - 200 status if successful, along with user stats object
 *           401 if failed with associated error message
 */ 
app.get('/getUserStats', async (req, res) => {
    console.log(Object.keys(req.session));
    if (!isLoggedIn(req)) {
        res.writeHead(401, jsonHeaderFields);
        res.write(JSON.stringify({message: "User not logged in"}));
    } else {
        res.writeHead(200, jsonHeaderFields);
        res.write(JSON.stringify(req.session.user));
    }
    res.end();
});

/**
 * Routing for obtaining leaderboard
 * @param {string} - express path
 * @param {function} - callback function to handle leaderboard GET
 * @writes - 200 status if successful, along with leaderboard list
 *           404 if failed
 */ 
app.get('/getLeaderboard', async (req, res) => {
    const db = await Database("blackjack");
    const lb = await db.getLeaderboard();
    if (lb.status === "success") {
        res.writeHead(200, jsonHeaderFields)
        res.write(JSON.stringify(lb.data));
    } else {
        res.writeHead(404, jsonHeaderFields);
    }
    res.end();
})

/**
 * Routing for obtaining the currently logged in user
 * @param {string} - express path
 * @param {function} - callback function to handle user GET
 * @writes - 200 status if successful, along with user's username
 *           401 if failed
 */ 
app.get('/getCurrentUser', async (req, res) => {
    if (isLoggedIn(req)) {
        res.writeHead(200, {"Content-Type": "text/plain"})
        res.write(req.session.user.id);
    } else {
        res.writeHead(401, {"Content-Type": "text/plain"})
    }
    res.end();
});

app.put('/updateLeaderboard', async(req, res) => {
    const db = await Database("blackjack");

});

app.put('/updateGames', async(req, res) => {

});

app.delete('/deleteGame', async(req, res) => {

});


app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});