import PouchDB from "pouchdb";
/**
 * 
 * @param {string} dbname - name of the database
 */
const initdb = async (dbname) => {
    const db = new PouchDB(dbname);

    // check to see if leaderboard exists. If not, create it as empty array
    try {
        const lb = await db.get("lb");
    } catch (err) {
        await db.put({_id: "lb", data: []});
    }

    // check to see if game list exists. If not, create it as empty array
    try {
        const games = await db.get("games");
    } catch (err) {
        await db.put({_id: "games", data: []});
    }

    // check to see if users list exists. If not, create it as empty array
    try {
        const users = await db.get("users");
    } catch (err) {
        await db.put({_id: "users", data: {}});
    }

    // check to see if logins list exists. If not, create it as empty array
    try {
        const logins = await db.get("logins");
    } catch (err) {
        await db.put({_id: "logins", data: {}})
    }

    await db.close();
};

// formatting user data:
// fields that we should have: id, games_played, winrate, ...

/**
 * Factory function to create a database instance with PouchDB
 * @param {string} dbname - name of the database
 */
const Database = async (dbname) => {
    
    await initdb(dbname);
    const getDB = () => new PouchDB(dbname);

    const obj = {
        /**
         * Check to see if the user exists in the database
         * @param {string} username 
         * @returns - object with status message and an associated data value (T/F)
         */
        userExists: async (username) => {
            try {
                const db = getDB();
                const logins = await db.get("logins");
                let ret = logins.data.hasOwnProperty(username);
                await db.close();
                return {status: "success", data: ret};
            } catch (err) {
                return {status: "error", message: err.message};
            }
        },
        
        /**
         * 
         * @param {*} username 
         * @param {*} hash 
         * @returns 
         */
        validateLogin: async (username, hash) => {
            try {
                const db = getDB();
                const logins = await db.get("logins");
                let ret = logins.data[username] === hash;
                await db.close();
                return {status: "success", data: ret};
            } catch (err) {
                return {status: "error", message: err.message};
            }
        },

        /**
         * 
         * @param {*} username 
         * @param {*} hash 
         * @returns 
         */
        addUser: async(username, hash) => {
            try {
                const db = getDB();
                const logins = await db.get("logins");
                const users = await db.get("users");
                const exists = logins.data.hasOwnProperty(username);
                if (exists) {
                    await db.close();
                    return {status: "error", message: "Username is taken"};
                }
                // add login information
                logins.data[username] = hash;
                await db.put(logins);
                // add user information
                users.data[username] = {id: username, games_played: 0, wins: 0, losses: 0, winrate: 0, score: 0};
                await db.put(users);
                await db.close();
                return {status: "success"};
            } catch(err) {
                return {status: "error", message: err.message};
            }
        },

        /**
         * @param {*} username - unique identifier for a single user
         * @returns object with status message and user object corresponding to username
         */
        getUser: async(username) => {
            try {
                const db = getDB();
                const users = await db.get("users");
                const user = users.data[username];
                await db.close();
                return {status: "success", data: user};
            } catch (err) {
                return {status: "error", message: err.message};
            }
        },

        // will need to pass in stats as obj - probably create these on client side
        updateUser: async (username, stats) => {
            try {
                const db = getDB();
                const users = await db.get("users");
                users.data[username] = stats;
                await db.put(users);
                await db.close();
                return {status: "success"};
            } catch (err) {
                return {status: "error", message: err.message};
            }
        },

        /**
         * 
         * @returns 
         */
        getLeaderboard: async() => {
            try {
                const db = getDB();
                const lb = await db.get("lb");
                await db.close();
                return {status: "success", data: lb};
            } catch(err) {
                return {status: "error", message: err.message};
            }
        },
                
        /**
         * Upadate leaderboard and sort the array if out of order
         * @param {*} username 
         * @param {*} newScore 
         * @returns 
         */
        updateLeaderboard: async(username, newScore) => {
            try {
                const db = getDB();
                const lb = await db.get("lb");
                let entries = lb.data;
                for (let i = 0; i < entries.length; i++) { //go through list of stuff
                    if(entries[i].name === username) { //if username is already in the leaderboard change the score
                        entries[i].score = newScore;
                        break;
                    } else if ( i === entries.length - 1){ 
                        /* assuming updateLeaderboard is only called when the score is 
                        actually higher than one of the positions then the last one should be replaced
                        */
                        entries[i].name = username;
                        entries[i].score = newScore;
                    }
                }
                entries.sort((a, b) => b.score - a.score); //sort the array of objects to keep the original format
                lb.data = entries;
                await db.put(lb);
                await db.close();
            } catch(err) {
                return {status: "error", message: err.message};
            }
        },


    };
    return obj;
};

export default Database;
