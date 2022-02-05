const controller = require("./controllers");
var Router = require('router');
var finalhandler = require('finalhandler')


var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var router = new Router();
router.route('/resources/*').all(function (req, res) {
    html = fs.readFileSync(req.url.substring(1));
    res.writeHead(200);
    res.write(html);
    res.end();
});
router.route('/:league/game').all(function (req, res) {
    console.log(`Welcome to the ${req.params.league} league`);
    html = fs.readFileSync('index.html');
    res.writeHead(200);
    res.write(html);
    res.end();
});
router.route('/:league/auth').all(function (req, res) {
    controller.auth(req, res, req.params.league);
});
router.route('/:league/settings').all(function (req, res) {
    controller.settings(req, res, req.params.league);
});
router.route('/:league/players').all(function (req, res) {
    controller.players(req, res, req.params.league);
});
router.route('/:league/positions').all(function (req, res) {
    controller.positions(req, res, req.params.league);
});
router.route('/:league/rules').all(function (req, res) {
    controller.rules(req, res, req.params.league);
});



var server = http.createServer(function (req, res) {
    router(req, res, finalhandler(req, res))
});

server.listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');