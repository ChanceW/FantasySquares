const url = "mongodb+srv://myMongoAdmin:CBWvii08!@cluster0.fvgkv.mongodb.net/Squares?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;
const dbName = 'Squares';

var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            MongoClient.connect(url, function(err, client) {
                const db = client.db(dbName);
                const collection = db.collection('Positions');
                collection.deleteMany({}, function(err, result){
                    collection.insertMany(JSON.parse(body), function(err, result){
                        html = JSON.stringify(result);
                        client.close();
                        res.writeHead(200);
                        res.write(html);
                        res.end();
                    });
                });
            });
        });
    } else if(req.method === 'PUT'){
        var name = '';
        req.on('data', function(chunk) {
            name += chunk;
        });
        req.on('end', function() {
            MongoClient.connect(url, function(err, client) {
                const db = client.db(dbName);
                const collection = db.collection('Players');
                console.log("Entering: " + name);
                collection.insertOne({"name":name}, function(err, result){
                    html = JSON.stringify(result);
                    client.close();
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
        });
    }else if(req.method === 'DELETE'){
        var name = '';
        req.on('data', function(chunk) {
            name += chunk;
        });
        req.on('end', function() {
            console.log("Entering: " + name);
            MongoClient.connect(url, function(err, client) {
                const db = client.db(dbName);
                const collection = db.collection('Players');
                console.log("Entering: " + name);
                collection.deleteOne({"name":name}, function(err, result){
                    html = JSON.stringify(result);
                    client.close();
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
        });
    }
    else {
        if(req.url === "/players"){
            MongoClient.connect(url, function(err, client) {
                const db = client.db(dbName);
                const collection = db.collection('Players');
                collection.find().toArray(function(err, docs) {
                    html = JSON.stringify(docs);
                    client.close();
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });           
            });
        }
        else if(req.url === "/positions"){
            MongoClient.connect(url, function(err, client) {
                const db = client.db(dbName);
                const collection = db.collection('Positions');
                collection.find().toArray(function(err, docs) {;
                    html = JSON.stringify(docs);
                    client.close();
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });           
            });
        }
        else{
            html = (req.url.startsWith("/img/") || req.url.startsWith("/css/") || req.url.startsWith("/js/")) ? fs.readFileSync(req.url.substring(1)) : fs.readFileSync('index.html');
            res.writeHead(200);
            res.write(html);
            res.end();
        }
    }
});

MongoClient.connect(url, function(err, client) {
    console.log('Connected to Mongo!!');
    // Listen on port 3000, IP defaults to 127.0.0.1
    server.listen(port);
    // Put a friendly message on the terminal
    console.log('Server running at http://127.0.0.1:' + port + '/');
    const db = client.db(dbName);
    client.close();
});