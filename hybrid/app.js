const server = require('../appCommon');
const path = require('path');

const allowedFrom = 'legacy.quickbase.com.dev';
server.app.set('port', process.env.PORT || 3001);


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

server.app.get('/cattle', function(req, res) {
    const data = {
        "Cattle": [
            "Bessie",
            "Clarabelle"]
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
