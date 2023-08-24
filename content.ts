const url = window.location.href;
const u = url.split("/")[4];
console.log(url);

console.log("chess.stjo.dev/api/bot/" + u + "/");

function roundAndFormat(number) {
  const roundedNumber = Math.round(number);
  const formattedNumber =
    roundedNumber >= 0 ? `+${roundedNumber}` : `${roundedNumber}`;
  return formattedNumber;
}

fetch("https://chess.stjo.dev/api/bot/" + u + "/")
  .then((res) => res.json())
  .then((r) => {
    const name = r.name;

    const games = r.games;

    const exportArray = new Array(games.length);

    var wins = 0;
    var losses = 0;
    var draws = 0;
    var winEloEffect = 0;
    var loseEloEffect = 0;
    var drawEloEffect = 0;
    games.forEach((game, index) => {
      var ending = 0;
      if (game.winner == "d") {
        draws++;
        drawEloEffect += game.elo_change;
      } else if (game[game.winner + "name"] == name) {
        wins++;
        winEloEffect += game.elo_change;
        ending = 1;
      } else {
        losses++;
        loseEloEffect += game.elo_change;
        ending = -1;
      }

      exportArray[index] = [
        game.wname,
        game.bname,
        game.reason,
        game.started,
        game.elo_change,
        ending,
      ];

      console.log(game.elo_change);
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

    statElem.id = "stat-panel";
    statElem.innerHTML = `

    <div id="counters">
    <div class="m5">
    <h2 class="m5">Wins</h2>
    <p class="counter m5">${wins}</p>
    <p class="counter elo-effect "> ${roundAndFormat(winEloEffect)} elo</p>
    
  </div>
  <div class="m5">
    <h2 class="m5">Losses</h2>
    <p class="counter m5">${losses}</p>
    <p class="counter elo-effect "> ${roundAndFormat(loseEloEffect)} elo</p>
    
  </div>
  <div class="m5">
    <h2 class="m5">Draws</h2>
    <p class="counter m5">${draws}</p>
    <p class="counter elo-effect"> ${roundAndFormat(drawEloEffect)} elo</p>
  </div>
</div>
  </div>
  <button id="more-button">...</button>
  <div id="bgdarkener">
    <div id="stat-popup">
      <div class="flex">
        <div class="m5">
          <h2 class="m5">Wins</h2>
          <p class="counter m5">${wins}</p>
          <p class="counter m5"> +53 elo</p>
          
        </div>
        <div class="m5">
          <h2 class="m5">Losses</h2>
          <p class="counter m5">${losses}</p>
          <p class="counter m5"> +53 elo</p>
          
        </div>
        <div class="m5">
          <h2 class="m5">Draws</h2>
          <p class="counter m5">${draws}</p>
          <p class="counter m5"> +53 elo</p>
        </div>
      </div>
      <div class="grid">
        <div class="flex elo-effect space-gap">
          <p class="bold">Elo effect by wins:<p>
          <p>+24</p>
        </div>
        <div class="flex elo-effect space-gap">
          <p class="bold">Elo effect by loses:<p>
          <p>+24</p>
        </div>
        
        
        
      </div>

      <button id="close-button">x</button>
    </div>
  </div>

  `;
    newParentElement.appendChild(statElem);
    let csvContent = "data:text/csv;charset=utf-8;\nsep=,\n";
    exportArray.forEach(function (rowArray) {
      // console.log(rowArray);
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    // console.log(csvContent);

    var encodedUri = encodeURI(csvContent);

    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.id = "download-link";
    link.innerHTML = "download csv file";
    link.setAttribute("download", name + ".csv");
    const popup = document.getElementById("stat-popup"); // Required for FF
    if (!popup) {
      console.log("no popup");
      return;
    }
    popup.appendChild(link);
    // link.click(); // This will download the data file named "my_data.csv".

    const statPopup = document.getElementById("bgdarkener");

    if (!statPopup) return;
    document.getElementById("more-button")?.addEventListener("click", () => {
      statPopup.style.display = "flex";
    });
    document.getElementById("close-button")?.addEventListener("click", () => {
      statPopup.style.display = "none";
    });

    // setTimeout(() => {
    // }, 200);
  });
