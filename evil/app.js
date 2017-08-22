const server = require('../appCommon');
const path = require('path');

const allowedFrom = 'evil.dev';
const signinurl = 'http://testrealm.quickbase.com.dev/signin';
const thishost = 'http://www.evil.dev';

server.app.set('port', process.env.PORT || 3001);

//handle preflight
server.app.use(function(req, res, next) {
    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        const orig = req.get('origin');
        server.setCorsHeaders(orig, res);
        res.end();
    } else {
        next();
    }
});

server.app.use(function(req, res, next) {
    let orig = req.get('origin');
    console.log("req=" + req.hostname);
    console.log("origin=" + orig);
    console.log("reqHost=" + allowedFrom);
    if (orig && orig.endsWith(allowedFrom)) {
        server.setCorsHeaders(orig, res);
    }
    next();
});

server.app.get('/bad', function(req, res) {
    const data = {
        "Bad": [
            "Evil",
            "Mal"]
    };
    res.json(data);
});

server.app.route('/')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname, '/index.html'));
    });


server.app.listen(server.app.get('port'), function() {
    console.log('Express up and listening on port ' + server.app.get('port'));
});
