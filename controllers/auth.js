const auth = (req, res) => {
    switch (req.method) {
        case 'POST':
            var body = '';

            req.on('data', function (chunk) {
                body += chunk;
            });

            req.on('end', function () {
                const user = JSON.parse(body);
                const isAdmin = user.uName === "elise";
                html = JSON.stringify({ isAdmin: isAdmin });
                res.writeHead(200);
                res.write(html);
                res.end();
            });
            break;
    }
};

module.exports = { auth };