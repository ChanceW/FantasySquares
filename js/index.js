let players = [];
let q1Positons = [];
let q2Positons = [];
let q3Positons = [];
let q4Positons = [];

function drawTable(id){
    let table = $(`#${id} tbody`);
    drawHeader(table);
    drawBody(table);
}

function drawHeader(table){
    let headerRow = $("<tr><th></th></tr>");
    for(let i = 0; i < 10; i++){
        headerRow.append(`<th>${i}</th>`);
    }
    table.append(headerRow);
}

function drawBody(table){
    for(let r = 0; r < 10; r++){
        let row = $(`<tr><th class='stick bg-dark'>${r}</th></tr>`);
        for(let c = 0; c < 10; c++){
            row.append(`<td class="position r${r}c${c} bg-dark"></td>`);
        }
        table.append(row);
    }
}

function play(){
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
        body: JSON.stringify([{name:"q1",positions:q1Positons},{name:"q2",positions:q2Positons},{name:"q3",positions:q3Positons},{name:"q4",positions:q4Positons}])
       })
        .then(response => {
            populateTables()
            $(".play.btn").removeClass("disabled");
        });
}

function populateTables(){
    fetch('positions')
        .then(response => response.json())
        .then(data => {
            q1Positons = data.filter(q => q.name === "q1")[0].positions;
            q2Positons = data.filter(q => q.name === "q2")[0].positions;
            q3Positons = data.filter(q => q.name === "q3")[0].positions;
            q4Positons = data.filter(q => q.name === "q4")[0].positions;

            populateTable("q1" , q1Positons);
            populateTable("q2" , q2Positons);
            populateTable("q3" , q3Positons);
            populateTable("q4" , q4Positons);
        });
}

function generatePositions(){
    const allowedPositions = Math.floor(100 / players.length);
    let result = {};
    for (let idx in players){
        let playerPositions = 0;
        while(playerPositions < allowedPositions)
        {
            let r = Math.floor(Math.random() * 10);
            let c = Math.floor(Math.random() * 10);
            let randomP = `r${r}c${c}`;

            if(!Object.keys(result).includes(randomP)){
                result[randomP] = players[idx].name;
                playerPositions++;
            }
        }
    }
    return result;
}

function populateTable(id, positions){
    for(let key in positions)
    {
        let cell = $(`#${id} .${key}`);
        cell.text(positions[key]);
        cell.removeClass("bg-dark");
    }
}

function DrawTables(){
    drawTable("q1");
    drawTable("q2");
    drawTable("q3");
    drawTable("q4");
}

function populatePlayers(){
    $(".card-body").html("<div class='spinner-border text-primary' role='status'><span class='sr-only'>Loading...</span></div>");
    fetch('players')
        .then(response => response.json())
        .then(data => {
            players = data;
            let list = $("<ul></ul>");
            players.forEach(player => {
            list.append(`<li>${player.name}</li>`);
            $(".card-body").html(list);
            });
        });
}

function join(){
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
            populatePlayers();
            DrawTables()
        });
}

function remove(){
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
            populatePlayers();
            DrawTables()
        });
}

function lock(){
}

DrawTables();
populatePlayers();
populateTables()