'use strict';

const server = require('../appCommon');
const path = require('path');
const strify = require('json-stringify-safe');



const baseDomain = 'quickbase.com.dev';
const allowedFrom = 'hybrid.quickbase.com.dev';
const localDomain = 'legacy.quickbase.com.dev';
const currentServer = 'legacyCurrentQuickbase';
const signinurl = 'http://testrealm.legacy.quickbase.com.dev/signin';

server.app.set('port', process.env.PORT || 3002);

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

server.app.route('/signin')
    .get(function(req, res) {
        const target = req.query.goto || '/';
        console.log('\n@@@handling signin target url =' + target)
        res.render('signin', { targetUrl: target});
    });


// set a cookie
// server.app.use(function (req, res, next) {
server.app.route('/sendcreds')
    .get(function(req, res) {
        //todo could validate username here
        console.log('\n@@@handling sendcreds : ');
        var target = req.query.goto || '/';
        console.log('got creds going to : '+ target);
        // check if client sent cookie
        console.log('\ncurrent req cookie are:' + JSON.stringify(req.cookies))
        var cookie = req.cookies['TICKET-' + allowedFrom];
        if (cookie === undefined) {
            // no: set a new cookie
            var randomNumber = Math.random().toString();
            randomNumber + randomNumber.substring(2, randomNumber.length);
            res.cookie('TICKET-' + allowedFrom, allowedFrom + "-" + randomNumber, {maxAge: 900000, domain: baseDomain});
            res.cookie('TICKET-' + localDomain, localDomain + "-" + randomNumber, {maxAge: 900000, domain: baseDomain});
            //return a cookie to any req
            console.log('cookie created successfully:' + strify(res.cookie, null, 2));
        }
        else {
            // yes, cookie was already present
            console.log('cookie exists', cookie);
        }
        res.redirect(target);
    });


//get the cookie
server.app.use(function (req, res, next) {
    // check if client sent cookie
    console.log('\n checking current req cookies :' + JSON.stringify(req.cookies) )
    var cookie = req.cookies['TICKET-'+allowedFrom];
    if (cookie === undefined) {
        //redirect to quickbase login
        let vals = `hostname:${req.hostname} url:${server.fullUrl(req)} `;
        console.log('not signed in redirect to signin '+signinurl + "--- dets: " + vals);

        res.redirect(signinurl+"?goto="+server.fullUrl(req));
    } else {
        next();
    }
})


server.app.use(function(req, res, next) {
    const orig = req.get('origin');
    console.log("\nreq=" + req.hostname);
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
            "Kitty",
            "Spot"]
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
