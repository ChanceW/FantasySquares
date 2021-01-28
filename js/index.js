let players = ["Chance","Alex"];

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
    const q1Positons = generatePositions();
    const q2Positons = generatePositions();
    const q3Positons = generatePositions();
    const q4Positons = generatePositions();
    populateTable("q1" , q1Positons);
    populateTable("q2" , q2Positons);
    populateTable("q3" , q3Positons);
    populateTable("q4" , q4Positons);
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
                result[randomP] = players[idx];
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

drawTable("q1");
drawTable("q2");
drawTable("q3");
drawTable("q4");


function addPlayers(){
    let list = $("<ul></ul>");
    players.forEach(player => {
        list.append(`<li>${player}</li>`);
    });
    $(".card-body ul").html(list);
}
addPlayers();

function join(){
    players.push($("#joinModal #playerName").val().toLowerCase());
    $(".playerName").val('');
    addPlayers();
}

function remove(){
    let name = $("#removeModal #playerName").val().toLowerCase();
    players = players.filter(p => {
        return p !== name;
    });
    $(".playerName").val('');
    addPlayers();
}