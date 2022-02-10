const MongoClient = require('mongodb').MongoClient;

const positions = (req, res, league) => {
    const info = require('../utilis/mongoHelper').getMongoInfo(league);
    const url = info.connectionString;
    const dbName = info.dbName;

    switch (req.method) {
        case 'GET':
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection('Positions');
                collection.find().toArray(function (err, docs) {
                    html = JSON.stringify(docs);
                    client.close();
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            break;
        case 'POST':
            var body = '';

            req.on('data', function (chunk) {
                body += chunk;
            });

            req.on('end', function () {
                MongoClient.connect(url, function (err, client) {
                    const db = client.db(dbName);
                    const collection = db.collection('Positions');
                    collection.deleteMany({}, function (err, result) {
                        collection.insertMany(JSON.parse(body), function (err, result) {
                            html = JSON.stringify(result);
                            client.close();
                            res.writeHead(200);
                            res.write(html);
                            res.end();
                        });
                    });
                });
            });
            break;
    }
};

module.exports = { positions }