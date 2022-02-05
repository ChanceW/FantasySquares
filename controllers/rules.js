const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://myMongoAdmin:CBWvii08!@cluster0.fvgkv.mongodb.net/Squares?retryWrites=true&w=majority";
const dbName = 'Paya';

const rules = (req, res) => {
    switch (req.method) {
        case 'GET':
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection('Rules');
                collection.find().toArray(function (err, docs) {
                    ;
                    html = JSON.stringify(docs);
                    client.close();
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            break;
        case "PUT":
            var rules = '';
            req.on('data', function (chunk) {
                rules += chunk;
            });

            req.on('end', function () {
                MongoClient.connect(url, function (err, client) {
                    const db = client.db(dbName);
                    const collection = db.collection('Rules');
                    collection.deleteMany({}, function (err, result) {
                        collection.insertOne({ "rules": rules }, function (err, result) {
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

module.exports = { rules };