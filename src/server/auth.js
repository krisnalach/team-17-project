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
    if (!db.userExists(username)) {
        return done(null, false, {message: "Username does not exist"});
    }
    // hash the password
    const hash = await digestMessage(password);
    
    if (!db.validateLogin(username, password)) {
        return done (null, false, {message: "Wrong password"});
    }
    // success
    return done(null, username);
});

passport.use(strategy);

passport.serializeUser();

passport.deserializeUser();