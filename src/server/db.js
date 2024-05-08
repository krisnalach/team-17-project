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
        await db.put({_id: "users", data: []});
    }

    // check to see if logins list exists. If not, create it as empty array
    try {
        const logins = await db.get("logins");
    } catch (err) {
        await db.put({_id: "logins", data: {}})
    }

    await db.close();
};

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
                const users = await db.get("users");
                let ret = users.data.filter(o => o.name === username).length === 1;
                return {status: "success", data: ret};
            } catch (err) {
                return {status: "error", message: err.message};
            }
        }
        
        validateLogin: async (username, password) => {

        }

        addUser: async(username, password) => {
            
        }


        updateUser: async (user, ) => {

        }
    };
};
