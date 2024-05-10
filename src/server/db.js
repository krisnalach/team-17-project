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
                logins.data[username] = hash;
                await db.put(logins);
                //TODO: add user into users collection? what are default values?
                await db.close();
                return {status: "success"};
            } catch(err) {
                return {status: "error", message: err.message};
            }
        },

        /**
         * @param {*} username 
         * @returns 
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
        updateUser: async (username, ) => {

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
         * 
         * @param {*} username 
         * @param {*} newScore 
         * @returns 
         */
        updateLeaderboard: async(username, newScore) => {
            try {
                const db = getDB();
                const lb = await db.get("lb");
                //TODO: update leaderboard 
                await db.close();
            } catch(err) {
                return {status: "error", message: err.message};
            }
        },


    };
    return obj;
};

export default Database;
