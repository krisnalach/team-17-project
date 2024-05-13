let db = null;
db = new PouchDB("mydb");

const prepop_lb = [
  { name: "John", score: 100 },
  { name: "Phil", score: 90 },
  { name: "Joe", score: 80 },
  { name: "Mario", score: 70 },
  { name: "Stu", score: 60 },
];

/**
 * Initialize the database
 */
async function init() {
  try {
    // pre-populate with leaderboard
    await db.put({
      _id: "lb",
      leaderboard: prepop_lb,
    });
    // set initial page to home
    await db.put({
      _id: "currView",
      view: "home-view",
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Change the current view in local storage
 * @param {string} newView - the ID of the view being changed to
 */
export async function updateCurrView(newView) {
  try {
    const response = await db.get("currView");
    await db.put({
      _id: "currView",
      _rev: response._rev,
      view: newView,
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get the current view from local storage
 * @returns - the ID of the current view
 */
export async function getCurrView() {
  try {
    const response = await db.get("currView");
    return response["view"];
  } catch (err) {
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
    let lb = await db.get("lb");
    lb["leaderboard"].push(obj);
    await db.put({
      _id: "lb",
      leaderboard: lb,
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get the leaderboard information from the database
 * @returns - the leaderboard as an array of objects
 */
export async function getLeaderboard() {
  try {
    const response = await db.get("lb");
    return response["leaderboard"];
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get the statistics of the currently logged in user
 * @returns - the user's stats, an object with fields:
 *            "winrate", "highest_bid", "all_in_cnt", "blackjacks" SUBJECT TO CHANGE
 */
export async function getUserStats() {
  try {
    const userStats = await db.get("currUser");
    return userStats["stats"];
  } catch (err) {
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
    const response = await db.get("currUser");
    return response["name"];
  } catch (err) {
    return -1;
  }
}

/**
 * Log in a user by adding their username (and corresonding stats)
 * into local storage
 * @param {string} name - the username to put into local storage
 */
export async function login(name, stats) {
  try {
    const response = await db.put({
      _id: "currUser",
      name: name,
      stats: stats,
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Log out a user by removing their username from
 * local storage
 * @param {string} name - the username to be removed from local stoarge
 */
export async function logout() {
  try {
    const response = await db.get("currUser");
    await db.remove(response);
    return -1;
  } catch (err) {
    console.error(err);
  }
}

// Prevent re-initializing the mock database
try {
  // See if it is already pre-populated
  const response = await db.get("lb");
} catch (err) {
  // If not, initialize it
  await init();
  console.error(err);
}
