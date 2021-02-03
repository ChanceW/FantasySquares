let players = [];
let q1Positons = [];
let q2Positons = [];
let q3Positons = [];
let q4Positons = [];
let savedSettings = {};

const loading = "<div class='spinner-border text-primary' role='status'><span class='sr-only'>Loading...</span></div>";

function login(){
    let body = {uName:$("#loginModal #userName").val().toLowerCase()};
    fetch('auth', {
        method: "POST", 
        headers: {
           'Content-Type': 'application/json',
         },
        body: JSON.stringify(body)
       })
       .then(response => response.json())
       .then(data => {
           if(data.isAdmin)
           {
                $("#loginModal").modal("hide");
                $(".adminRow").removeClass("d-none");
           }
           else{
               alert("Not Admin");
           }
       });
}

function checklock(){
    if(savedSettings.isLocked === "true"){
        $("#btnLock").addClass("active");
        $("#btnUnlock").removeClass("active");
        $(".btn.remove, .btn.add").addClass("d-none");
        $(".btn.lock").removeClass("d-none");
    }
    else{
        $("#btnLock").removeClass("active");
        $("#btnUnlock").addClass("active");
        $(".btn.remove, .btn.add").removeClass("d-none");
        $(".btn.lock").addClass("d-none");
    } 
}

function drawTable(id){
    let table = $(`#${id} tbody`);
    drawHeader(table);
    drawBody(table);
}

function drawHeader(table){
    let headerRow = $(`<tr><th>${"&nbsp;".repeat(10)}</th></tr>`);
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
                getSettings();
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
                playersCard.append(`<div class='text-center'>Current Quarterly Payout = <span= class="text-success">$${ (players.length * 20) / players.length }</span></div>`);
                playersCard.append(`<div class='text-center'>Current Total Pot = <span= class="text-success">$${ players.length * 20 }</span></div>`);
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
        let rule = $(this).val();
        if(rule)
        {
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

function getSettings(){
    fetch('settings')
       .then(response => response.json())
       .then(resp => {
           savedSettings = resp;
           checklock();
           manageScores();
       });
}

function saveSettings(){
    let settings = {
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

function manageScores(){
    $("h4 div").html("");
    let q1Scores = savedSettings.q1.split(":");
    let q2Scores = savedSettings.q2.split(":");
    let q3Scores = savedSettings.q3.split(":");
    let q4Scores = savedSettings.q4.split(":");
    if(q1Scores[0] && q1Scores[1])
    {
        const position = `r${q1Scores[0] % 10}c${q1Scores[1] % 10}`;
        const winner = $("#q1 ." + position).text();
        $("#q1 ." + position).css({background:"#28a745"});
        $("#q1Header div").html(`Tampa ${q1Scores[1]} / Kasans ${q1Scores[0]} = Winner ${winner}`);
    }
    if(q2Scores[0] && q2Scores[1])
    {
        const position = `r${q2Scores[0] % 10}c${q2Scores[1] % 10}`;
        const winner = $("#q2 ." + position).text();
        $("#q2 ." + position).css({background:"#28a745"});
        $("#q2Header div").html(`Tampa ${q2Scores[1]} / Kasans ${q2Scores[0]} = Winner ${winner}`);
    }
    if(q3Scores[0] && q3Scores[1])
    {
        const position = `r${q3Scores[0] % 10}c${q3Scores[1] % 10}`;
        const winner = $("#q3 ." + position).text();
        $("#q3 ." + position).css({background:"#28a745"});
        $("#q3Header div").html(`Tampa ${q3Scores[1]} / Kasans ${q3Scores[0]} = Winner ${winner}`);
    }
    if(q4Scores[0] && q4Scores[1])
    {
        const position = `r${q4Scores[0] % 10}c${q4Scores[1] % 10}`;
        const winner = $("#q4 ." + position).text();
        $("#q4 ." + position).css({background:"#28a745"});
        $("#q4Header div").html(`Tampa ${q4Scores[1]} / Kasans ${q4Scores[0]} = Winner ${winner}`);
    }
}

DrawTables();
populatePlayers();
populateTables()
populateRules();
