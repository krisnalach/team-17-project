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
    // currently not used
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
         * @returns - object with status "success" message and an associated data value (T/F)
         *            or "error" status and associated error message
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
         * Check if the passed in username and hash exists in the database,
         * indicating a valid login attempt
         * @param {*} username - the user's username
         * @param {*} hash - the user's password, hashed
         * @returns - "success" status object 
         *            or "error" status and associated error message
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
         * Add a username, hash pair to the database and create an 
         * empty stats object associated with their username
         * @param {*} username - the user's username
         * @param {*} hash - the user's password, hashed
         * @returns - "success" status object or "error" status and associated error message
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
         * Get a user's stats object if they exist in the database
         * @param {*} username - unique identifier for a single user
         * @returns - object with status message and user object corresponding to username,
         *            or "error" status and associated error message
         */
        getUser: async(username) => {
            try {
                const db = getDB();
                const users = await db.get("users");
                if (!users.data.hasOwnProperty(username)) {
                    await db.close();
                    return {status: "error", message: `User ${username} does not exist`};
                }
                const user = users.data[username];
                await db.close();
                return {status: "success", data: user};
            } catch (err) {
                return {status: "error", message: err.message};
            }
        },

        /**
         * Update a user by replacing their stats object with passed in
         * stats arg.
         * @param {string} username - a user's username
         * @param {obj} stats - stats object of a user
         * @returns - "success" status object or "error" status and associated error message
         */
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
         * Get the leaderboard from the database
         * @returns - "success" status and leaderboard list as data
         *            or "error" status and associated error message
         */
        getLeaderboard: async() => {
            try {
                const db = getDB();
                const lb = await db.get("lb");
                await db.close();
                return {status: "success", data: lb.data};
            } catch(err) {
                return {status: "error", message: err.message};
            }
        },
                
        /**
         * Upadate leaderboard and sort the array if out of order
         * @param {*} username 
         * @param {*} newScore 
         * @returns "success" status object or "error" status and associated error message
         */
        updateLeaderboard: async(username, newScore) => {
            try {
                const db = getDB();
                const lb = await db.get("lb");
                let inLeaderboard = false;
                let entries = lb.data;
                for (let i = 0; i < entries.length; i++) { //go through list of entries
                    if (entries[i].name === username) { //if username is already in the leaderboard change the score
                        entries[i].score = Math.max(newScore, entries[i].score);
                        inLeaderboard = true;
                        break;
                    }
                }
                //add to the leaderboard if not in
                if (!inLeaderboard) {
                    entries.push({name: username, score: newScore});
                }
                entries.sort((a, b) => b.score - a.score); //sort the array of objects to keep the original format
                lb.data = entries;
                await db.put(lb);
                await db.close();
                return {status: "success"}
            } catch(err) {
                return {status: "error", message: err.message};
            }
        },

        /**
         * Delete all records of an account in the database's documents
         * @param {string} username - user's username
         * @returns "success" status object or "error" status and associated error message
         */
        deleteAccount: async(username) => {
            try {
                const db = getDB();
                const lb = await db.get("lb");
                const logins = await db.get("logins");
                const users = await db.get("users");

                // purging
                lb.data = lb.data.filter(o => o.name !== username);
                delete logins.data.username;
                delete users.data.username;

                await db.put(lb);
                await db.put(logins);
                await db.put(users);

                await db.close();
                return {status: "success"};

            } catch (err) {
                return {status: "error", message: err.message};
            }
        }


    };
    return obj;
};

export default Database;
