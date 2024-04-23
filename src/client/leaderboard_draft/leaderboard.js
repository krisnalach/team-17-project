import * as db from "./db.js";

let leaderboard = await db.getLeaderboard();

export function renderLeaderboard(element) { //renders current Leaderboard stored in the DB
    element.innerHTML = "";
    let userStats = leaderboard;
    const header = document.createElement("thead");
    header.innerHTML = 
    `<tr>
    <th>Rank</th>
    <th>Name</th>
    <th>Score</th>
    </tr>
    `;
    for (let i = 0; i < userStats.length; i++) {
        const tableItem = document.createElement("tr"); //make a new row in the table
        const position = document.createElement("td"); //make a new cell in table that shows the position
        position.innerText = `${i++}`;
        const name = document.createElement("td"); // make a new cell in table that shows name
        const score = document.createElement("td"); //represents the score slot in the new row

    }
}