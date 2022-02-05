const controller = require("./controllers");
var Router = require('router');
var finalhandler = require('finalhandler')


var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var router = new Router();
router.route('/auth').all(function (req, res) {
    controller.auth(req, res);
});
router.route('/settings').all(function (req, res) {
    controller.settings(req, res);
});
router.route('/players').all(function (req, res) {
    controller.players(req, res);
});
router.route('/positions').all(function (req, res) {
    controller.positions(req, res);
});
router.route('/rules').all(function (req, res) {
    controller.rules(req, res);
});
router.route('/resources/*').all(function (req, res) {
    html = fs.readFileSync(req.url.substring(1));
    res.writeHead(200);
    res.write(html);
    res.end();
});
router.route('/').all(function (req, res) {
    html = fs.readFileSync('index.html');
    res.writeHead(200);
    res.write(html);
    res.end();
});

var server = http.createServer(function (req, res) {
    router(req, res, finalhandler(req, res))
});

server.listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');