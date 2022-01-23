const url = "mongodb+srv://myMongoAdmin:CBWvii08!@cluster0.fvgkv.mongodb.net/Squares-dev?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;
const dbName = 'Squares';
const controller = require("./controllers");

var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var server = http.createServer(function (req, res) {
    if (req.url === "/auth") {
        controller.auth(req, res);
    }
    else if (req.url === "/settings") {
        controller.settings(req, res);
    }
    else if (req.url === "/players") {
        controller.players(req, res);
    }
    else if (req.url === "/positions") {
        controller.positions(req, res);
    }
    else if (req.url === "/rules") {
        controller.rules(req, res);
    }
    else {
        html = (req.url.startsWith("/img/") || req.url.startsWith("/css/") || req.url.startsWith("/js/")) ? fs.readFileSync(req.url.substring(1)) : fs.readFileSync('index.html');
        res.writeHead(200);
        res.write(html);
        res.end();
    }
});

MongoClient.connect(url, function (err, client) {
    console.log('Connected to Mongo!!');
    // Listen on port 3000, IP defaults to 127.0.0.1
    server.listen(port);
    // Put a friendly message on the terminal
    console.log('Server running at http://127.0.0.1:' + port + '/');
    const db = client.db(dbName);
    client.close();
});