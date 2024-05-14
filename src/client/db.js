let db = null;
db = new PouchDB("mydb");

/**
 * Initialize the database
 */
async function init() {
  try {
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
 * Updates the stats of the currently signed in user.
 * Assumes that it is only called when a user is signed in
 * @param {obj} stats - stats object to be assigned to a user
 */
export async function updateUserStats(stats) {
  try {
    const currUser = await db.get("currUser");
    currUser.stats = stats;
    await db.put(currUser);
  } catch (err) {
    console.error(err);
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
  const response = await db.get("currView");
} catch (err) {
  // If not, initialize it
  await init();
}
