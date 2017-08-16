'use strict';

const server = require('../appCommon');
const path = require('path');


const baseDomain = 'quickbase.com.dev';
const allowedFrom = 'hybrid.quickbase.com.dev';
const localDomain = 'legacy.quickbase.com.dev'
const currentServer = 'legacyCurrentQuickbase';

server.app.set('port', process.env.PORT || 3002);

// set a cookie
server.app.use(function (req, res, next) {
    // check if client sent cookie
    console.log('\ncurrent req cookie are:' + JSON.stringify(req.cookies))
    var cookie = req.cookies['cookieName-'+allowedFrom];
    if (cookie === undefined)
    {
        // no: set a new cookie
        var randomNumber = Math.random().toString();
        randomNumber + randomNumber.substring(2,randomNumber.length);
        res.cookie('cookieName-' + allowedFrom, allowedFrom + "-" + randomNumber, { maxAge: 900000 , domain: baseDomain });
        res.cookie('cookieName-' + localDomain, localDomain + "-" + randomNumber, { maxAge: 900000 , domain: baseDomain });
        //return a cookie to any req
        console.log('cookie created successfully:' +  JSON.stringify(res.cookies));
    }
    else
    {
        // yes, cookie was already present
        console.log('cookie exists', cookie);
    }
    next(); // <-- important!
});

server.app.use(function(req, res, next) {
    const orig = req.get('origin');
    console.log("req=" + req.hostname);
    console.log("origin=" + orig);
    console.log("reqHost=" + allowedFrom);
    if (orig && orig.endsWith(allowedFrom)) {
        server.setCorsHeaders(orig, res);
    }
    next();
});

server.app.get('/pets', function(req, res) {
    const data = {
        "Pets": [
            "cats",
            "dogs"]
    };
    res.json(data);
    console.log("returning pets" + JSON.stringify(data));
});

server.app.route('/')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname, '/index.html'));
});


server.app.listen(server.app.get('port'), function() {
    console.log('Express up and listening on port ' + server.app.get('port'));
});
