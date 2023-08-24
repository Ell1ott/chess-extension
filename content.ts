const url = window.location.href;
const u = url.split("/")[4];
console.log(url);
console.log("chess.stjo.dev/api/bot/" + u + "/");
fetch("https://chess.stjo.dev/api/bot/" + u + "/")
  .then((res) => res.json())
  .then((r) => {
    const name = r.name;

    const games = r.games;

    var wins = 0;
    var losses = 0;
    var draws = 0;
    games.forEach((game) => {
      if (game.winner == "d") draws++;
      else if (game[game.winner + "name"] == name) wins++;
      else losses++;
    });

    console.log(`${wins} wins ${losses} losses ${draws} draws`);

    // headerElem.style = "display: flex";

    const headerElem = document.getElementById("bot");

    if (!headerElem) return;
    var newParentElement = document.createElement("div");

    newParentElement.style.display = "flex";

    headerElem.style.flex = "1";

    var parentOfExistingElement = headerElem.parentNode;
    document.body.insertBefore(newParentElement, headerElem);

    newParentElement.appendChild(headerElem);

    const statElem = document.createElement("div");

    statElem.id = "stats-panel";

    newParentElement.appendChild(statElem);

    statElem.innerHTML = `
      <div style="margin: 5px">
        <h2 style="margin: 5px">Wins</h2>
        <p class="counter">${wins}</p>
      </div>
      <div style="margin: 5px">
        <h2 style="margin: 5px">Losses</h2>
        <p class="counter">${losses}</p>
      </div>
      <div style="margin: 5px">
        <h2 style="margin: 5px">Draws</h2>
        <p class="counter">${draws}</p>
      </div>
      ;
    `;

    // setTimeout(() => {
    // }, 200);
  });
