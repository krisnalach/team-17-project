const leaderboardRes = await fetch("/getLeaderboard", {
  method: "GET",
  credentials: "include",
});

let leaderboard = [];

// if fetch fails, just display an empty array
if (leaderboardRes.ok) {
  leaderboard = await leaderboardRes.json();
}

/**
 * Render the leaderboard
 * @param {obj} element - the DOM element to render onto
 */
export function renderLeaderboard(element) {
  //renders current Leaderboard stored in the DB
  element.innerHTML = "";
  let userStats = leaderboard; //get the leaderboard
  const header = document.createElement("thead");
  header.innerHTML = `<tr>
    <th>Rank</th>
    <th>Name</th>
    <th>Score</th>
    </tr>
    `;
  element.appendChild(header);

  const tableBody = document.createElement("tbody"); //make the body of the table
  for (let i = 0; i < userStats.length; ++i) {
    const tableItem = document.createElement("tr"); //make a new row in the table
    tableItem.innerHTML = `<td>${i + 1}</td>
        <td>${userStats[i].name}</td>
        <td>${userStats[i].score}</td>`;
    tableBody.appendChild(tableItem); //add the row we created to the body of the table
    //assuming that the leaderboard comes sorted

    /*const position = document.createElement("td"); //make a new cell in table that shows the position
        position.innerText = `${i++}`;
        const name = document.createElement("td"); // make a new cell in table that shows name
        const score = document.createElement("td"); //represents the score slot in the new row
        */
  }
  element.appendChild(tableBody); //add the tableBody to the passed in element

  const container = document.getElementById("lb-table");
  container.id = "lb-table-container";
}
