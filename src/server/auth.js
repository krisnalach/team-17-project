import passport from "passport";
import passportLocal from "passport-local";
import crypto from "crypto";
import Database from "./db.js";

const { Strategy } = passportLocal;


// taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
}

const strategy = new Strategy(async(username, password, done) => {
    const db = await Database("blackjack");
    // check to see if the username is registered
    const userExists = await db.userExists(username);
    if (!userExists.data) {
        // no such user
        return done(null, false, {message: "Username does not exist"});
    }
    // hash the password
    const hash = await digestMessage(password);
    // check if password is valid
    const valid = await db.validateLogin(username, hash);
    if (!valid.data) {
        // invalid password, no attack mitigation currently
        return done(null, false, {message: "Wrong password"});
    }
    // success, now get user object
    const user = await db.getUser(username);
    return done(null, user.data);
});

passport.use(strategy);

// convert user object to unique identifier
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// convert a unique identifier to a user object
// this is completely broken, gonna use a janky workaround
passport.deserializeUser(async (userid, done) => {
    console.log("when is this being called?");
    const db = await Database("blackjack");
    const user = await db.getUser(userid);
    done(null, user.data);
});

export default {
    configure: (app) => {
        app.use(passport.initialize());
        app.use(passport.session());
    },
    authenticate: (domain, where) => {
        return passport.authenticate(domain, where);
    },
    digest: digestMessage,
}