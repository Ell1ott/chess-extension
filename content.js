const url = window.location.href;

const u = url.split("/")[4];
console.log(url);
console.log("chess.stjo.dev/api/bot/" + u + "/");
fetch("https://chess.stjo.dev/api/bot/" + u + "/")
  .then((res) => res.json())
  .then((r) => {
    console.log(r);
    console.log("hii!");

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

    headerElem = document.getElementById("bot");

    if (headerElem) console.log("found header elem");
    newParentElement = document.createElement("div");

    newParentElement.style = "display: flex; ";

    headerElem.style = "flex: 1";

    var parentOfExistingElement = headerElem.parentNode;
    document.body.insertBefore(newParentElement, headerElem);

    newParentElement.appendChild(headerElem);

    statElem = document.createElement("div");

    statElem.style = `align-items: center; margin: 20px 20px 20px 0px; background-color: rgb(246, 234, 224); padding: 8px; border-radius: 8px; color: rgb(122, 78, 60); box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; height 100px; display: flex;`;

    newParentElement.appendChild(statElem);
    statElem.innerHTML = `
    <div style="margin: 5px">
      <h2 style="margin: 5px">Wins</h2>
      <p style="text-align: center; font-size: 25px; margin: 0">${wins}</p>
    </div>
    <div style="margin: 5px">
      <h2 style="margin: 5px">Losses</h2>
      <p style="text-align: center; font-size: 25px; margin: 0">${losses}</p>
    </div>
    <div style="margin: 5px">
      <h2 style="margin: 5px">Draws</h2>
      <p style="text-align: center; font-size: 25px; margin: 0">${draws}</p>
    </div>`;

    // setTimeout(() => {
    // }, 200);
  });
