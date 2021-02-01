let players = [];
let q1Positons = [];
let q2Positons = [];
let q3Positons = [];
let q4Positons = [];

const loading = "<div class='spinner-border text-primary' role='status'><span class='sr-only'>Loading...</span></div>";

function drawTable(id){
    let table = $(`#${id} tbody`);
    drawHeader(table);
    drawBody(table);
}

function drawHeader(table){
    let headerRow = $(`<tr><th>${"&nbsp;".repeat(20)}</th></tr>`);
    for(let i = 0; i < 10; i++){
        headerRow.append(`<th class="bg-tampa">${i}</th>`);
    }
    table.append(headerRow);
}

function drawBody(table){
    for(let r = 0; r < 10; r++){
        let row = $(`<tr><th class='stick bg-kansas'>${r}</th></tr>`);
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
            if(data.length)
            {
                q1Positons = data.filter(q => q.name === "q1")[0].positions;
                q2Positons = data.filter(q => q.name === "q2")[0].positions;
                q3Positons = data.filter(q => q.name === "q3")[0].positions;
                q4Positons = data.filter(q => q.name === "q4")[0].positions;

                populateTable("q1" , q1Positons);
                populateTable("q2" , q2Positons);
                populateTable("q3" , q3Positons);
                populateTable("q4" , q4Positons);
            }
            
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

function populatePlayers(shuffleBoard){
    let playersCard = $(".players .card-body");
    playersCard.html(loading);
    fetch('players')
        .then(response => response.json())
        .then(data => {
            players = data;
            if(shuffleBoard){ play(); }
            let list = $("<ul></ul>");
            players.forEach(player => {
            list.append(`<li>${player.name}</li>`);
            playersCard.html(list);
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
            populatePlayers(true);
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
            populatePlayers(true);
        });
}

function populateRules(){
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

function editRules(){
    $("#howTo").addClass("edit"); 
}

function cancelEdit(){
    $("#howTo").removeClass("edit"); 
}

function addRule(){
    $("#howToList").append("<li class='my-2'><input type='text' value='' /></li>")
}

function saveRules(){
    let list = $("#howToList");
    let newRules = [];
    list.find("input").each(function() {
        newRules.push($(this).val());
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

DrawTables();
populatePlayers();
populateTables()
populateRules();