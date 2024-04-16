let db = null;

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
        await db.put({
            _id: 'john',
            'stats': {
                'winrate': 1,
                'highest_bid': 10000,
                'all_in_cnt': 50,
                'blackjacks': 17,
            },
        });
    }
    catch (err) {
        console.error(err);
    }
}

/**
 * 
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
 * @param {*} id 
 */
export async function getUserStats(id) {
    try {
        let userStats = await db.get(id);
        console.log(userStats);
        // Figure out how we want to represent this
        return userStats['stats'];
    }
    catch (err) {
        console.error(err);
    }
}

init();