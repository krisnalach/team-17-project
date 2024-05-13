const db = new PouchDB("local");
await initdb("local");

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
    const userStats = await db.get("userStats");
    await db.close();
    return userStats.data;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Store the stats object passed in to local storage for quick access
 * @param {obj} stats - stats object for the current user
 */
export async function storeUserStats(stats) {
  try {
    const userStats = await db.get("userStats");
    userStats.data = stats;
    userStats.exists = true;
    await db.put(userStats);
    await db.close();
  } catch (err) {
    console.log("Error");
  }
}

/**
 * Create and initialize a local storage database using PouchDB
 * @param {string} dbname - name of the local storage database
 */
const initdb = async (dbname) => {
  const db = new PouchDB(dbname);

  try {
    const userStats = await db.get("userStats");
  } catch (err) {
    await db.put({_id: "userStats", data: {}, exists: false});
  }

  try {
    const currView = await db.get("currView");
  } catch (err) {
    await db.put({_id: "currView", view: "home-view"});
  }
  
  await db.close();

 }
