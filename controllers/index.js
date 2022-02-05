const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://myMongoAdmin:CBWvii08!@cluster0.fvgkv.mongodb.net/Squares?retryWrites=true&w=majority";
const dbName = 'Paya';

const apiController = {
    "players": require('./players').players,
    "positions": require('./positions').positions,
    "rules": require('./rules').rules,
    "auth": require('./auth').auth,
    "settings": require('./settings').settings,
};
module.exports = apiController;