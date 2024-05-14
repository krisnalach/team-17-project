import * as db from "./db.js";

/**
 * Render user statistics
 * @param {obj} element - the DOM element to render onto
 */
export async function renderStats(element) {
  let userStats = await db.getUserStats();
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let stat in userStats) {
    if (userStats.hasOwnProperty(stat)) {
      // Create stat element for entire stat
      const statElement = document.createElement("div");
      statElement.classList.add("stat");

      // Create label element for stat
      const label = document.createElement("span");
      label.textContent = stat.replace(/_/g, " ").concat(": ");
      label.classList.add("label");

      // Create element for numeric stat value
      const value = document.createElement("span");
      if (typeof userStats[stat] === "number") {
        value.textContent = userStats[stat].toFixed(2);
      } else {
        value.textContent = userStats[stat];
      }
      value.classList.add("value");

      // Append label and value to the stat element
      statElement.appendChild(label);
      statElement.appendChild(value);

      // Append the stat element to the stats container
      statsContainer.appendChild(statElement);
    }
  }

  // Append stats container to element passed in
  element.appendChild(statsContainer);
}
