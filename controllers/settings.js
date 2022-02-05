const MongoClient = require('mongodb').MongoClient;

const settings = (req, res, league) => {
    const url = require('../utilis/mongoHelper').getMongoConnectionString();
    const dbName = league[0].toUpperCase() + league.substring(1);

    switch (req.method) {
        case 'GET':
            var body = '';

            req.on('data', function (chunk) {
                body += chunk;
            });

            req.on('end', function () {
                MongoClient.connect(url, function (err, client) {
                    const db = client.db(dbName);
                    const collection = db.collection('Settings');
                    collection.find().toArray(function (err, docs) {
                        ;
                        html = JSON.stringify(docs[0]);
                        client.close();
                        res.writeHead(200);
                        res.write(html);
                        res.end();
                    });
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
                    const collection = db.collection('Settings');
                    collection.deleteMany({}, function (err, result) {
                        collection.insertOne(JSON.parse(body), function (err, result) {
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

module.exports = { settings };