import passport from "passport";
import passportLocal from "passport-local";
import * as db from "./db.js";

const { Strategy } = passportLocal;

const strategy = new Strategy(async(username, password, done)) => {
    
}
