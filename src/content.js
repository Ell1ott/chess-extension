const url = window.location.href;
const u = url.split("/")[4];
console.log(url);

console.log("chess.stjo.dev/api/bot/" + u + "/");

const red = [255, 0, 0];
const green = [0, 255, 0];

function roundAndFormat(number, decimal = 1) {
  const roundedNumber = round(number, decimal);
  const formattedNumber =
    roundedNumber >= 0 ? `+${roundedNumber}` : `${roundedNumber}`;
  return formattedNumber;
}

function round(number, decimal) {
  return Math.round(number * decimal) / decimal;
}

fetch("https://chess.stjo.dev/api/bot/" + u + "/")
  .then((res) => res.json())
  .then((r) => {
    const name = r.name;
    if (!r || !r.games) return;
    const games = r.games;

    const exportArray = new Array(games.length);

    var wins = 0;
    var losses = 0;
    var draws = 0;
    var winEloEffect = 0;
    var loseEloEffect = 0;
    var drawEloEffect = 0;

    var endReasons = {
      "Threefold Repetition": [0, 0, 0],
      Checkmate: [0, 0, 0],
      "timed out": [0, 0, 0],
      "illegal move": [0, 0, 0],
      "Insufficient Material": [0, 0, 0],
    };

    const nameElements = document.querySelectorAll(".name");
    const EloChangeElements = document.getElementsByClassName("elo");

    chrome.storage.local.get(["colorBg"], function (result) {
      console.log(result.colorBg);
      if (result.colorBg) {
        console.log(nameElements.length);

        // Loop through the elements and apply the style
        nameElements.forEach((element) => {
          element.classList.add("color-bg"); // Add the 'highlight' class to apply the defined style
        });
      }
    });

    console.log(EloChangeElements.length);
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

      for (let reason in endReasons) {
        if (game.reason.toLowerCase().includes(reason.toLowerCase())) {
          endReasons[reason][0] += 1;

          if (ending == 1) endReasons[reason][1] += 1;
          if (ending == -1) endReasons[reason][2] += 1;
        }
      }

      exportArray[index] = [
        game.wname,
        game.bname,
        game.reason,
        game.started,
        game.elo_change,
        ending,
      ];

      // console.log(game.elo_change);
      if (game.winner != "d") {
        nameElements[index * 2 + (game.winner == "w" ? 0 : 1)].classList.add(
          "winner-text"
        );
      }
      const eloColorFactor = Math.min(
        Math.max(game.elo_change / 40 + 0.5, 0),
        1
      );
      const eloColor = [
        Math.round(red[0] * (1 - eloColorFactor) + green[0] * eloColorFactor), // R
        Math.round(red[1] * (1 - eloColorFactor) + green[1] * eloColorFactor), // G
        Math.round(red[2] * (1 - eloColorFactor) + green[2] * eloColorFactor), // B
      ];

      const eloColorString = `rgb(${eloColor[0]}, ${eloColor[1]}, ${eloColor[2]})`;

      EloChangeElements[index].style.color = eloColorString;
    });

    console.log(`${wins} wins ${losses} losses ${draws} draws`);

    console.log(endReasons);
    const gameCount = games.length;
    const winProcent = wins / gameCount;
    const loseProcect = losses / gameCount;
    const drawProcent = draws / gameCount;

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
    <p class="counter elo-effect "> ${round(winProcent * 100, 10)}%</p>
    
  </div>
  <div class="m5">
    <h2 class="m5">Losses</h2>
    <p class="counter m5">${losses}</p>
    <p class="counter elo-effect "> ${roundAndFormat(loseEloEffect)} elo</p>
    <p class="counter elo-effect "> ${round(loseProcect * 100, 10)}%</p>
    
  </div>
  <div class="m5">
    <h2 class="m5">Draws</h2>
    <p class="counter m5">${draws}</p>
    <p class="counter elo-effect"> ${roundAndFormat(drawEloEffect)} elo</p>
    <p class="counter elo-effect"> ${round(drawProcent * 100, 10)}%</p>
  </div>
</div>
  </div>
  <button id="more-button">...</button>
  <div id="bgdarkener">
    <div id="stat-popup">
      <div id="end-reasons">
        <h3>
        game ending reasons
        </h3>
        <div class="flex space-gap">
          <p class="p bold">Checkmate</p>
          <p class="p">${endReasons["Checkmate"][0]}</p>
          <div class="spacer"></div>
          <p class="p">+${endReasons["Checkmate"][1]}</p>
          <div class="spacer"></div>
          <p class="p">-${endReasons["Checkmate"][2]}</p>
        </div>
        <div class="flex space-gap">
        <p class="p bold">Timed out</p>
        <p class="p">${endReasons["timed out"][0]}</p>
        <div class="spacer"></div>
        <p class="p">+${endReasons["timed out"][1]}</p>
        <div class="spacer"></div>
        <p class="p">-${endReasons["timed out"][2]}</p>

        </div>
        <div class="flex space-gap">
          <p class="p bold">Illegal move</p>
          <p class="p">${endReasons["illegal move"][0]}</p>
          <div class="spacer"></div>
          <p class="p">+${endReasons["illegal move"][1]}</p>
          <div class="spacer"></div>
          <p class="p">-${endReasons["illegal move"][2]}</p>
        </div>
        <div class="flex space-gap">
          <p class="p bold">Insufficient Material</p>
          <p class="p">${endReasons["Insufficient Material"][0]}</p>
        </div>
        <div class="flex space-gap">
          <p class="p bold">Threefold Repetition</p>
          <p class="p">${endReasons["Threefold Repetition"][0]}</p>
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
