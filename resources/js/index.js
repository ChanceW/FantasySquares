let players = [];
let q1Positons = [];
let q2Positons = [];
let q3Positons = [];
let q4Positons = [];
let savedSettings = {};
let isAdmin = false;

const nflTeams = {
  "": { name: "Pick a Team", color1: "#ffffff", color2: "#000000" },
  sf4: { name: "San Francisco 49ers", color1: "#af1e2c", color2: "#ffffff" },
  gbp: { name: "Green bay packers", color1: "#213d30", color2: "#ffb50e" },
  tbb: { name: "Tampa Bay Buccaneers", color1: "#CE0A0A", color2: "#3b303c" },
  lar: { name: "Los Angeles Rams", color1: "#1F368B", color2: "#E8C82E" },
  cnb: { name: "Cincinnati Bengals", color1: "#F34D13", color2: "#000000" },
  kcc: { name: "Kansas City Chiefs", color2: "#DC1735", color1: "#FCCE0D" },
  bfb: { name: "Buffalo Bills", color1: "#194787", color2: "#BF2026" },
  lvr: { name: "Las Vegas Raiders", color1: "#010101", color2: "#9BA5A8" },
  pde: { name: "Philadelphia Eagles", color1: "#004C54", color2: "#ffffff" },
  tnt: { name: "Tennessee Titans", color1: "#498DD4", color2: "#C00C2E" },
  btr: { name: "Baltimore Ravens", color1: "#23166F", color2: "#99780C" },
  mnv: { name: "Minnesota Vikings", color1: "#4C109B", color2: "#F7B103" },
  sts: { name: "Seattle Seahawks", color1: "#00285B", color2: "#4BB736" },
  nos: { name: "New Orleans Saints", color1: "#CCB689", color2: "#000000" },
  nyg: { name: "New York Giants", color1: "#AD1A2D", color2: "#0B2163" },
  chb: { name: "Chicago Bears", color1: "#0B162A", color2: "#E34302" },
  mid: { name: "Miami Dolphins", color1: "#00808A", color2: "#FC4C01" },
};

const loading =
  "<div class='spinner-border text-primary' role='status'><span class='sr-only'>Loading...</span></div>";

function populatePlayersNflTeams() {
  for (var team in nflTeams) {
    $(".teamPicker").append(
      `<option value=${team}>${nflTeams[team].name}</option>`
    );
  }
}

function setTeams() {
  if (savedSettings.awayTeam && savedSettings.homeTeam) {
    const awayTeam = nflTeams[savedSettings.awayTeam];
    const homeTeam = nflTeams[savedSettings.homeTeam];
    setColors(awayTeam, homeTeam);
    $("#awayTeam").val(savedSettings.awayTeam);
    $("#homeTeam").val(savedSettings.homeTeam);
    $("#awayHeader").html(`Away - ${awayTeam.name}`);
    $("#homeHeader").html(`Home - ${homeTeam.name}`);
    $(".cScore").attr(
      "placeholder",
      awayTeam.name.split(" ")[awayTeam.name.split(" ").length - 1]
    );
    $(".rScore").attr(
      "placeholder",
      homeTeam.name.split(" ")[homeTeam.name.split(" ").length - 1]
    );
  }
}

function setColors(awayTeam, homeTeam) {
  if (awayTeam && homeTeam) {
    document.documentElement.style.setProperty("--away", awayTeam.color1);
    document.documentElement.style.setProperty("--home", homeTeam.color1);
    document.documentElement.style.setProperty("--away2", awayTeam.color2);
    document.documentElement.style.setProperty("--home2", homeTeam.color2);
  }
}

function login() {
  let body = { uName: $("#loginModal #userName").val().toLowerCase() };
  fetch("auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isAdmin) {
        isAdmin = true;
        $("#loginModal").modal("hide");
        $(".adminRow").removeClass("d-none");
        checkLock();
      } else {
        alert("Not Admin");
      }
    });
}

function checkLock() {
  if (isAdmin) {
    $("#btnLock").removeClass("active");
    $("#btnUnlock").addClass("active");

    $(".btn.remove, .btn.add").removeClass("d-none");
    $(".btn.lock").addClass("d-none");
  } else {
    $("#btnLock").addClass("active");
    $("#btnUnlock").removeClass("active");

    $(".btn.remove, .btn.add").addClass("d-none");
    $(".btn.lock").removeClass("d-none");
  }
}

function drawTable(id) {
  let table = $(`#${id} tbody`);
  drawHeader(table);
  drawBody(table);
}

function drawHeader(table) {
  let headerRow = $(`<tr><th>${"&nbsp;".repeat(10)}</th></tr>`);
  for (let i = 0; i < 10; i++) {
    headerRow.append(`<th class="bg-away">${i}</th>`);
  }
  table.append(headerRow);
}

function drawBody(table) {
  for (let r = 0; r < 10; r++) {
    let row = $(`<tr><th class='stick bg-home'>${r}</th></tr>`);
    for (let c = 0; c < 10; c++) {
      row.append(`<td class="position r${r}c${c} bg-dark"></td>`);
    }
    table.append(row);
  }
}

function play() {
  $(".position").addClass("bg-dark").text("");
  $(".play.btn").addClass("disabled");

  q1Positons = generatePositions();
  q2Positons = generatePositions();
  q3Positons = generatePositions();
  q4Positons = generatePositions();
  fetch("positions", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      { name: "q1", positions: q1Positons },
      { name: "q2", positions: q2Positons },
      { name: "q3", positions: q3Positons },
      { name: "q4", positions: q4Positons },
    ]),
  }).then((response) => {
    populateTables();
    $(".play.btn").removeClass("disabled");
  });
}

function populateTables() {
  fetch("positions")
    .then((response) => response.json())
    .then((data) => {
      if (data.length) {
        q1Positons = data.filter((q) => q.name === "q1")[0].positions;
        q2Positons = data.filter((q) => q.name === "q2")[0].positions;
        q3Positons = data.filter((q) => q.name === "q3")[0].positions;
        q4Positons = data.filter((q) => q.name === "q4")[0].positions;

        populateTable("q1", q1Positons);
        populateTable("q2", q2Positons);
        populateTable("q3", q3Positons);
        populateTable("q4", q4Positons);
      }
    });
}

function generatePositions() {
  const allowedPositions = Math.floor(100 / players.length);
  let result = {};
  for (let idx in players) {
    let playerPositions = 0;
    while (playerPositions < allowedPositions) {
      let r = Math.floor(Math.random() * 10);
      let c = Math.floor(Math.random() * 10);
      let randomP = `r${r}c${c}`;

      if (!Object.keys(result).includes(randomP)) {
        result[randomP] = players[idx].name;
        playerPositions++;
      }
    }
  }
  return result;
}

function populateTable(id, positions) {
  for (let key in positions) {
    let cell = $(`#${id} .${key}`);
    cell.text(positions[key]);
    cell.removeClass("bg-dark");
  }
}

function DrawTables() {
  drawTable("q1");
  drawTable("q2");
  drawTable("q3");
  drawTable("q4");
}

function populatePlayers(shuffleBoard) {
  let playersCard = $(".players .card-body");
  playersCard.html(loading);
  fetch("players")
    .then((response) => response.json())
    .then((data) => {
      players = data;
      if (shuffleBoard) {
        play();
      }
      let list = $("<ul></ul>");
      if (players.length < 1) {
        list.append(`<li>No players have joined</li>`);
      }
      players.forEach((player) => {
        list.append(`<li>${player.name.replace(" ", "-")}</li>`);
      });
      playersCard.html(list);
      playersCard.append(
        `<div class='text-center'>Current Quarterly Payout = <span id="qPay" class="text-success"></span></div>`
      );
      playersCard.append(
        `<div class='text-center'>Current Total Pot = <span id="tPay" class="text-success"></span></div>`
      );
      setSettings();
    });
}

function join() {
  let name = $("#joinModal #playerName").val().toLowerCase();
  fetch("players", {
    method: "PUT",
    headers: {
      "Content-Type": "text/plain",
    },
    body: name,
  }).then((response) => {
    $(".playerName").val("");
    populatePlayers(true);
  });
}

function remove(reset) {
  let name = reset
    ? "reset"
    : $("#removeModal #playerName").val().toLowerCase();
  fetch("players", {
    method: "DELETE",
    headers: {
      "Content-Type": "text/plain",
    },
    body: name,
  }).then((response) => {
    $(".playerName").val("");
    if (reset) {
      saveSettings(reset);
    }
    populatePlayers(true);
  });
}

function populateRules() {
  let list = $("#howToList");
  list.html(loading);
  $(".btn.how").addClass("disabled");
  fetch("rules")
    .then((response) => response.json())
    .then((resp) => {
      const rules = JSON.parse(resp[0].rules)[0];
      list.html("");
      rules.forEach((rule) => {
        list.append(
          `<li class='my-2'><span>${rule}</span><input type='text' value='${rule}' /></li>`
        );
      });
      $(".btn.how").removeClass("disabled");
      $("#howTo").removeClass("edit");
    });
}

function editRules() {
  $("#howTo").addClass("edit");
}

function cancelEdit() {
  $("#howTo").removeClass("edit");
}

function addRule() {
  $("#howToList").append(
    "<li class='my-2'><input type='text' value='' /></li>"
  );
}

function saveRules() {
  let list = $("#howToList");
  let newRules = [];
  list.find("input").each(function () {
    let rule = $(this).val();
    if (rule) {
      newRules.push(rule);
    }
  });
  list.html(loading);
  fetch("rules", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([newRules]),
  }).then((response) => {
    populateRules();
  });
}

function getSettings() {
  fetch("settings")
    .then((response) => response.json())
    .then((resp) => {
      savedSettings = resp;
      setSettings();
    });
}

function setSettings() {
  $("#payMessage").attr("href", savedSettings.payLink);
  $("#payMessage").text(`Pay Here! - $${savedSettings.buyIn}`);
  $("#payLink").val(savedSettings.payLink);
  $("#buyIn").val(savedSettings.buyIn);
  const payout = players.length * Number(savedSettings.buyIn);
  $("#qPay").text(`$${payout / 4}`);
  $("#tPay").text(`$${payout}`);
  setTeams();
  checklock();
  manageScores();
}

function saveSettings(reset) {
  let settings = {
    payLink: $("#payLink").val(),
    buyIn: $("#buyIn").val(),
    awayTeam: $("#awayTeam").val(),
    homeTeam: $("#homeTeam").val(),
    isLocked: $("[name='squareLock']:checked").val(),
    q1: `${$("#q1 .rScore").val()}:${$("#q1 .cScore").val()}`,
    q2: `${$("#q2 .rScore").val()}:${$("#q2 .cScore").val()}`,
    q3: `${$("#q3 .rScore").val()}:${$("#q3 .cScore").val()}`,
    q4: `${$("#q4 .rScore").val()}:${$("#q4 .cScore").val()}`,
  };
  fetch("settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reset ? defaultSettings : settings),
  }).then((response) => {
    getSettings();
  });
}

function manageScores() {
  const awayTeam = nflTeams[savedSettings.awayTeam];
  const homeTeam = nflTeams[savedSettings.homeTeam];
  const awayShortName =
    awayTeam.name.split(" ")[awayTeam.name.split(" ").length - 1];
  const homeShortName =
    homeTeam.name.split(" ")[homeTeam.name.split(" ").length - 1];
  $("h4 div").html("");
  $(`.winnerCell`).removeClass("winnerCell");
  let q1Scores = savedSettings.q1.split(":");
  let q2Scores = savedSettings.q2.split(":");
  let q3Scores = savedSettings.q3.split(":");
  let q4Scores = savedSettings.q4.split(":");
  const allQuarters = [q1Scores, q2Scores, q3Scores, q4Scores];

  for (const idx in allQuarters) {
    const awayScore = allQuarters[idx][1];
    const homeScore = allQuarters[idx][0];
    if (!awayScore && !homeScore) {
      continue;
    }

    const quarter = `q${Number(idx) + 1}`;
    const position = `r${homeScore % 10}c${awayScore % 10}`;
    const winner = $(`#${quarter} .${position}`).text();

    $(`#${quarter} .${position}`).addClass("winnerCell"); //Winner Block
    $(`#${quarter}Header div`).html(
      `${awayShortName} ${awayScore} / ${homeShortName} ${homeScore} = Winner ${winner}`
    ); //Quarter header
    $(`#${quarter} .rScore`).val(homeScore); //Settings Box Home Score
    $(`#${quarter} .cScore`).val(awayScore); //Settings Box Away Score
  }
}

populatePlayersNflTeams();
DrawTables();
populatePlayers();
populateTables();
populateRules();
getSettings();

const defaultSettings = {
  payLink: $("#payLink").val(),
  buyIn: 20,
  awayTeam: "",
  homeTeam: "",
  isLocked: false,
  q1: ":",
  q2: ":",
  q3: ":",
  q4: ":",
};
