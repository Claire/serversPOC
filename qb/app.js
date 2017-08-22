'use strict';

const server = require('../appCommon');
const path = require('path');
const strify = require('json-stringify-safe');

/** Current stack server simulation */

const baseDomain = 'quickbase.com.dev';
const defaultRealm = 'www';
const thisRealm = 'testrealm';
const realmDomain = 'testrealm.quickbase.com.dev';
const evilDomain = 'evil.quickbase.com.dev';
const realmHybridDomain = 'testrealm.hybrid.quickbase.com.dev';
const allowedFrom = 'hybrid.quickbase.com.dev';
const localDomain = 'quickbase.com.dev';
const signinurl = 'http://testrealm.quickbase.com.dev/signin';

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
        const from = req.query.from;
        console.log('\n@@@handling signin target url =' + target + ' from=' + from)
        res.render('signin', { targetUrl: target, from:from});
    });


// set a cookie
// server.app.use(function (req, res, next) {
server.app.route('/sendcreds')
    .get(function(req, res) {
        //todo could validate username here
        console.log('\n@@@handling sendcreds : ');
        const target = req.query.goto || '/';
        const orig = req.get('origin')
        const from = req.query.from || defaultRealm;
        const cookieDomain = orig || from;
        console.log('got creds going to : '+ target + ' orig: '+orig + ' from: '+ from + ' cookieDomain:'+ cookieDomain);

        // check if client sent cookie
        console.log('current req cookie are:' + JSON.stringify(req.cookies))
        var cookie = req.cookies['TICKET-' + cookieDomain];
        if (cookie === undefined) {
            // no: set a new cookie
            console.log('no ticket yet');

            var randomNumber = Math.random().toString();
            res.cookie('TICKET-cur', baseDomain + "-domain_" + baseDomain + '-' + randomNumber, {maxAge: 900000, domain: baseDomain});
            if (cookieDomain) {
                res.cookie('TICKET-'+cookieDomain, cookieDomain + "-domain_" + cookieDomain + '-' + randomNumber, {
                    maxAge: 900000,
                    domain: baseDomain
                });

                //return a cookie to any req
                if (cookieDomain.endsWith(target)) {
                    console.log('cookieDomain does endsWith target cookieDomain =' + cookieDomain + ' target =' + target);
                }
            }
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
    var cookie = req.cookies['TICKET-'+'cur'];
    if (cookie === undefined) {
        //redirect to quickbase login
        let vals = `hostname:${req.hostname} url:${server.fullUrl(req)} `;
        console.log('not signed in redirect to signin '+signinurl + "--- dets: " + vals);

        res.redirect(signinurl+"?goto="+server.fullUrl(req) +'&from='+thisRealm);
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
