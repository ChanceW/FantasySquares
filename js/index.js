let players = [];
let q1Positons = [];
let q2Positons = [];
let q3Positons = [];
let q4Positons = [];
let savedSettings = {};

const loading = "<div class='spinner-border text-primary' role='status'><span class='sr-only'>Loading...</span></div>";

function setTeams() {
    $("#awayHeader").html(`Away - ${savedSettings.awayTeam}`);
    $("#homeHeader").html(`Home - ${savedSettings.homeTeam}`);
    $("#awayTeam").val(savedSettings.awayTeam);
    $("#homeTeam").val(savedSettings.homeTeam);
    $("#awayColor").val(savedSettings.awayColor);
    $("#homeColor").val(savedSettings.homeColor);
    document.documentElement.style.setProperty("--away", savedSettings.awayColor)
    document.documentElement.style.setProperty("--home", savedSettings.homeColor)
    $(".cScore").attr("placeholder", savedSettings.awayTeam.split(" ")[0])
    $(".rScore").attr("placeholder", savedSettings.homeTeam.split(" ")[0])
}

function login() {
    let body = { uName: $("#loginModal #userName").val().toLowerCase() };
    fetch('auth', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(data => {
            if (data.isAdmin) {
                $("#loginModal").modal("hide");
                $(".adminRow").removeClass("d-none");
            }
            else {
                alert("Not Admin");
            }
        });
}

function checklock() {
    if (savedSettings.isLocked === "true") {
        $("#btnLock").addClass("active");
        $("#btnUnlock").removeClass("active");

        $(".btn.remove, .btn.add").addClass("d-none");
        $(".btn.lock").removeClass("d-none");
    }
    else {
        $("#btnLock").removeClass("active");
        $("#btnUnlock").addClass("active");

        $(".btn.remove, .btn.add").removeClass("d-none");
        $(".btn.lock").addClass("d-none");
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
    fetch('positions', {
        method: "Post",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ name: "q1", positions: q1Positons }, { name: "q2", positions: q2Positons }, { name: "q3", positions: q3Positons }, { name: "q4", positions: q4Positons }])
    })
        .then(response => {
            populateTables()
            $(".play.btn").removeClass("disabled");
        });
}

function populateTables() {
    fetch('positions')
        .then(response => response.json())
        .then(data => {
            if (data.length) {
                q1Positons = data.filter(q => q.name === "q1")[0].positions;
                q2Positons = data.filter(q => q.name === "q2")[0].positions;
                q3Positons = data.filter(q => q.name === "q3")[0].positions;
                q4Positons = data.filter(q => q.name === "q4")[0].positions;

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
    fetch('players')
        .then(response => response.json())
        .then(data => {
            players = data;
            if (shuffleBoard) { play(); }
            let list = $("<ul></ul>");
            players.forEach(player => {
                list.append(`<li>${player.name}</li>`);
                playersCard.html(list);
            });
            const payout = players.length * 20;
            playersCard.append(`<div class='text-center'>Current Quarterly Payout = <span= class="text-success">$${payout / 4}</span></div>`);
            playersCard.append(`<div class='text-center'>Current Total Pot = <span= class="text-success">$${payout}</span></div>`);
        });
}

function join() {
    let name = $("#joinModal #playerName").val().toLowerCase();
    fetch('players', {
        method: "PUT",
        headers: {
            'Content-Type': 'text/plain',
        },
        body: name
    })
        .then(response => {
            $(".playerName").val('');
            populatePlayers(true);
        });
}

function remove() {
    let name = $("#removeModal #playerName").val().toLowerCase();
    fetch('players', {
        method: "DELETE",
        headers: {
            'Content-Type': 'text/plain',
        },
        body: name
    })
        .then(response => {
            $(".playerName").val('');
            populatePlayers(true);
        });
}

function populateRules() {
    let list = $("#howToList");
    list.html(loading);
    $(".btn.how").addClass("disabled");
    fetch('rules')
        .then(response => response.json())
        .then(resp => {
            const rules = JSON.parse(resp[0].rules)[0];
            list.html('');
            rules.forEach((rule) => {
                list.append(`<li class='my-2'><span>${rule}</span><input type='text' value='${rule}' /></li>`);
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
    $("#howToList").append("<li class='my-2'><input type='text' value='' /></li>")
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
    fetch('rules', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([newRules])
    })
        .then(response => {
            populateRules();
        });
}

function getSettings() {
    fetch('settings')
        .then(response => response.json())
        .then(resp => {
            savedSettings = resp;
            setSettings();
        });
}

function setSettings() {
    setTeams();
    checklock();
    manageScores();
}

function saveSettings() {
    let settings = {
        awayTeam: $("#awayTeam").val(),
        homeTeam: $("#homeTeam").val(),
        awayColor: $("#awayColor").val(),
        homeColor: $("#homeColor").val(),
        isLocked: $("[name='squareLock']:checked").val(),
        q1: `${$("#q1 .rScore").val()}:${$("#q1 .cScore").val()}`,
        q2: `${$("#q2 .rScore").val()}:${$("#q2 .cScore").val()}`,
        q3: `${$("#q3 .rScore").val()}:${$("#q3 .cScore").val()}`,
        q4: `${$("#q4 .rScore").val()}:${$("#q4 .cScore").val()}`,
    };
    fetch('settings', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })
        .then(response => {
            getSettings();
        });
}

function manageScores() {
    $("h4 div").html("");
    let q1Scores = savedSettings.q1.split(":");
    let q2Scores = savedSettings.q2.split(":");
    let q3Scores = savedSettings.q3.split(":");
    let q4Scores = savedSettings.q4.split(":");
    const allQuarters = [q1Scores, q2Scores, q3Scores, q4Scores]

    for (const idx in allQuarters) {
        const awayScore = allQuarters[idx][0];
        const homeScore = allQuarters[idx][1];
        if (!awayScore && !homeScore) {
            continue;
        }

        const quarter = `q${Number(idx) + 1}`;
        const position = `r${homeScore % 10}c${awayScore % 10}`;
        const winner = $(`#${quarter} .${position}`).text();
        $(`#${quarter} .winnerCell`).removeClass("winnerCell");

        $(`#${quarter} .${position}`).addClass("winnerCell"); //Winner Block
        $(`#${quarter}Header div`).html(`${savedSettings.awayTeam.split(" ")[0]} ${awayScore} / ${savedSettings.homeTeam.split(" ")[0]} ${homeScore} = Winner ${winner}`);//Quarter header
        $(`#${quarter} .rScore`).val(homeScore);//Settings Box Home Score
        $(`#${quarter} .cScore`).val(awayScore);//Settings Box Away Score
    }
}

DrawTables();
populatePlayers();
populateTables()
populateRules();
getSettings();
