import express from "express";
import cors from "express";
import expressSession from "express-session";
import logger from "morgan";
import cookieParser from "cookie-parser";
import auth from "./auth.js";
import Database from "./db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

const jsonHeaderFields = { "Content-Type": "application/json" };

// Create Express app
const app = express();
const port = process.env.PORT || 3260;

// Create session configuration
const sessionConfig = {
  secret: process.env.SECRET || "SECRET",
  resave: false,
  saveUninitialized: false,
};

app.use(expressSession(sessionConfig));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

const corsOptions = {
    origin: 'http://127.0.0.1:3260',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content=Type', 'Authorization'],
  }
app.use(cors(corsOptions));

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
app.post("/login", (req, res, next) => {
  auth.authenticate("local", (err, user, info) => {
    if (user === false) {
      res.writeHead(401, jsonHeaderFields);
      res.write(JSON.stringify(info));
      res.end();
    } else {
      req.logIn(user, (err) => {
        if (err) {
          console.log("Login Failed");
          return next(err);
        }
      });
      // really jank workaround, manually tie user to session
      // and tie signedIn check to session
      req.session.user = req.user;
      req.session.signedIn = true;
      res.writeHead(200, jsonHeaderFields);
      res.end();
    }
  })(req, res, next);
});

/**
 * Routing for registering accounts
 * @param {string} - express path
 * @param {function} - callback function to handle registering
 * @writes - 200 status if successful, 409 if failed with error message
 */
app.post("/register", async (req, res) => {
  const db = await Database("blackjack");
  const { username, password } = req.body;
  // encrypt password
  const hash = await auth.digest(password);
  const addUserRet = await db.addUser(username, hash);
  if (addUserRet.status === "success") {
    res.writeHead(200, jsonHeaderFields);
  } else {
    res.writeHead(409, { "Content-type": "text/plain" });
    res.write(addUserRet.message);
  }
  res.end();
});

/**
 * Routing for logout
 * @param {string} - express path
 * @param {function} - callback function to handle logging out
 * @writes - redirects user upon successful logout to '/'
 */
app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    // more jank - delete user tied to session
    delete req.session.user;
    delete req.session.signedIn;
    res.redirect("/");
  });
});

/**
 * Routing for obtaining user statistics
 * @param {string} - express path
 * @param {function} - callback function to handle stat gathering
 * @writes - 200 status if successful, along with user stats object
 *           401 if failed with associated error message
 */
app.get("/getUserStats", async (req, res) => {
  if (!isLoggedIn(req)) {
    res.writeHead(401, jsonHeaderFields);
    res.write(JSON.stringify({ message: "User not logged in" }));
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
app.get("/getLeaderboard", async (req, res) => {
  const db = await Database("blackjack");
  const lb = await db.getLeaderboard();
  if (lb.status === "success") {
    res.writeHead(200, jsonHeaderFields);
    res.write(JSON.stringify(lb.data));
  } else {
    res.writeHead(404, jsonHeaderFields);
  }
  res.end();
});

/**
 * Routing for obtaining the currently logged in user
 * @param {string} - express path
 * @param {function} - callback function to handle user GET
 * @writes - 200 status if successful, along with user's username
 *           401 if failed
 */
app.get("/getCurrentUser", async (req, res) => {
  if (isLoggedIn(req)) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(req.session.user.id);
  } else {
    res.writeHead(401, { "Content-Type": "text/plain" });
  }
  res.end();
});

/**
 * Routing for updating the leaderboard
 * @param {string} - express path
 * @param {function} - callback function to handle leaderboard update
 * @writes - 200 status if successful
 *           409 if failed
 */
app.put("/updateLeaderboard", async (req, res) => {
  const db = await Database("blackjack");
  const { username, score } = req.body;
  const lbRet = await db.updateLeaderboard(username, score);
  if (lbRet.status === "success") {
    res.writeHead(200);
  } else {
    res.writeHead(409);
  }
  res.end();
});

/**
 * Routing for updating a user's stats in the databases
 * @param {string} - express path
 * @param {function} - callback function to handle the update
 * @writes - 200 status if successful
 *           409 if failed
 */
app.put("/updateUser", async (req, res) => {
  const db = await Database("blackjack");
  const { username, stats } = req.body;
  const userRet = await db.updateUser(username, stats);
  if (userRet.status === "success") {
    res.writeHead(200);
  } else {
    res.writeHead(409);
  }
  res.end();
});

/**
 * Routing for deleting a user
 * Deletes user from leaderboard, logins document, users document
 * @param {string} - express path
 * @param {function} - callback function to handle the delete
 * @writes - 200 status if successful, along with success message
 *           401 if failed, along with error message
 */
app.delete("/deleteAccount", async (req, res) => {
  const db = await Database("blackjack");
  const { username } = req.body;
  const ret = await db.deleteAccount(username);
  if (ret.status === "success") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Account successfully deleted");
  } else {
    res.writeHead(401, { "Content-Type": "text/plain" });
    res.write(`Failed to delete account: ${ret.message}`);
  }
  res.end();
});


app.get("/test", async(req, res) => {
    const db = await Database("blackjack");
    const obj = await db.test();
    console.log(obj.lb);
    console.log(obj.users);
    console.log(obj.logins);
})

app.listen(port, () => {
  console.log(`App now listening at http://localhost:${port}`);
});
