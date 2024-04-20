let db = null;
db = new PouchDB('mydb');

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
export async function getUserStats() {
    try {
        const userStats = await db.get('currUser');
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
 * at a time. 
 * @returns - the username of the currently logged in user, -1 otherwise
 */
export async function getUser() {
    try {
        const response = await db.get('currUser');
        return response['name'];
    }
    catch (err) {
        console.error(err);
        return -1;
    }
}

/**
 * Log in a user by adding their username (and corresonding stats)
 * into local storage
 * @param {string} name
 */
export async function login(name) {
    try {
        const response = await db.put({
            _id: 'currUser',
            'name': name,
            'stats': users[name],
        });
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
export async function logout() {
    try {
        const response = await db.get('currUser');
        await db.remove(response);
        return -1;
    }
    catch (err) {
        console.error(err);
    }
}

// Prevent re-initializing the mock database
try {
    // See if it is already pre-populated
    const temp = await db.get('lb');
}
catch (err) {
    // If not, initialize it
    await init();
    console.error(err)
}
