module.exports = {
    getMongoInfo: function (league) {
        return {
            connectionString: `mongodb+srv://myMongoAdmin:CBWvii08!@cluster0.fvgkv.mongodb.net/`,
            dbName: mongoDbMapping[league.toLowerCase()]
        };
    }
};

const mongoDbMapping = {
    dahomies: "DaHomies",
    paya: "Paya"
};