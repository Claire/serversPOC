const server = require('../appCommon');
const path = require('path');

const allowedFrom = 'legacy.quickbase.com.dev';
const signinurl = 'http://testrealm.legacy.quickbase.com.dev/signin';
const thishost = 'http://testrealm.hybrid.quickbase.com.dev/signin';

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

//get the cookie
server.app.use(function (req, res, next) {
    // check if client sent cookie
    console.log('\ncurrent req cookie are:' + JSON.stringify(req.cookies) + ' fullurl='+server.fullUrl(req))
    var cookie = req.cookies['TICKET-'+allowedFrom];
    if (cookie === undefined) {
        //redirect to quickbase login
        console.log('not signed in redirect to signin '+signinurl+req.url)
        res.redirect(signinurl+"?goto="+server.fullUrl(req));
    } else {
        next();
    }
})


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
