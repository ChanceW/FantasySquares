const MongoClient = require('mongodb').MongoClient;
const players = (req, res, league) => {
    const info = require('../utilis/mongoHelper').getMongoInfo(league);
    const url = info.connectionString;
    const dbName = info.dbName;

    switch (req.method) {
        case 'GET':
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection('Players');
                collection.find().toArray(function (err, docs) {
                    html = JSON.stringify(docs);
                    client.close();
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            break;
        case 'PUT':
            var name = '';
            req.on('data', function (chunk) {
                name += chunk;
            });

            req.on('end', function () {
                MongoClient.connect(url, function (err, client) {
                    const db = client.db(dbName);
                    const collection = db.collection('Players');
                    console.log("Entering: " + name);
                    collection.insertOne({ "name": name }, function (err, result) {
                        html = JSON.stringify(result);
                        client.close();
                        res.writeHead(200);
                        res.write(html);
                        res.end();
                    });
                });
            });
            break;
        case 'DELETE':
            var name = '';
            req.on('data', function (chunk) {
                name += chunk;
            });

            req.on('end', function () {
                console.log("Entering: " + name);
                MongoClient.connect(url, function (err, client) {
                    const db = client.db(dbName);
                    const collection = db.collection('Players');
                    console.log("Entering: " + name);
                    if (name == "reset") {
                        collection.deleteMany({}, function (err, result) {
                            html = JSON.stringify(result);
                            client.close();
                            res.writeHead(200);
                            res.write(html);
                            res.end();
                        });
                    }

                    collection.deleteOne({ "name": name }, function (err, result) {
                        html = JSON.stringify(result);
                        client.close();
                        res.writeHead(200);
                        res.write(html);
                        res.end();
                    });
                });
            });
            break;
    }
};

module.exports = { players }