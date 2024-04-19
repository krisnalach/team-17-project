let db = null;

const users = {
    'john': {
        'winrate': 1,
        'highest_bid': 10000,
        'all_in_cnt': 50,
        'blackjacks': 17,
    },
    'phil': {
        'winrate': .7,
        'highest_bid': 3000,
        'all_in_cnt': 3,
        'blackjacks': 13,
    },
    'stu': {
        'winrate': .2,
        'highest_bid': 70,
        'all_in_cnt': 1000,
        'blackjacks': 1,
    },
};

/**
 * Initialize the database
 */
async function init() {
    db = new PouchDB('mydb');
    try {
        await db.put({
            _id: 'lb',
            'leaderboard': [],
        });
        await db.put();
    }
    catch (err) {
        console.error(err);
    }
}

/**
 * (INFO) This should probably be done automatically
 * on new account creation / first game played
 * @param {*} obj 
 */
export async function addToLeaderboard(obj) {
    try {
        let lb = await db.get('lb');
        lb['leaderboard'].push(obj);
        await db.put({
            _id: 'lb',
            'leaderboard': lb,
        });
    }
    catch (err) {
        console.error(err);
    }
}

/**
 * 
 */
export async function getLeaderboard() {
    try {
        const response = await db.get('lb');
        // do we need to do any parsing? 
        return response;
    }
    catch (err) {
        console.error(err);
    }
}

/**
 * 
 * @param {string} id 
 */
export async function getUserStats(id) {
    try {
        const userStats = await db.get(id);
        console.log(userStats);
        // Figure out how we want to represent this
        return userStats['stats'];
    }
    catch (err) {
        console.error(err);
    }
}

/**
 * Gets the current user that is logged in.
 * Assumes only one username is stored in local storage
 * at a time
 */
export async function getUser() {

}

/**
 * Log in a user by adding their username (and corresonding stats)
 * into local storage
 * @param {string} name
 */
export async function login(name) {
    try {
        const response = await db.put({
            _id: name,
            'stats': users[name],
        });
        // Is this bad practice?
        const response2 = await db.put({
            _id: 'currUser',
            'name': name,
        })
    }
    catch (err) {
        console.error(err);
    }
}

/**
 * Log out a user by removing their username from
 * local storage
 * @param {string} name 
 */
export async function logout(name) {
    try {
        const response = await db.get(name);
        await db.remove(response); // Should we be returning something?
    }
    catch (err) {
        console.error(err);
    }
}

// Prevent re-initializing the mock database
try {
    // See if it is already pre-populated
    let temp = await db.get('lb');
}
catch (err) {
    // If not, initialize it
    await init();
}
