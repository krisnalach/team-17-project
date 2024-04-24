import * as db from "./db.js";

let userStats = await db.getUserStats();

export function displayStats() {
    const statsElement = document.getElementById('stats');
    statsElement.innerHTML = `
        <p>Total Games Played: ${userStats.games_played}</p>
        <p>Games Won: ${userStats.wins}</p>
        <p>Losses: ${userStats.losses}%</p>
        <p>Highest Bid: $${userStats.highest_bid}</p>
        <p>All in count: ${userStats.all_in_cnt}</p>
        <p>Blackjacks: ${userStats.blackjacks}</p>
    `;
}

document.getElementById('stats').addEventListener('click', function() {
    displayStats();
});

