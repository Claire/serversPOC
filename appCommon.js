'use strict'

/**
 * Module dependencies.
 * @private
 */
const express        = require('express');
const morgan         = require('morgan');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const cookieParser   = require('cookie-parser');
const path           = require('path');
const app            = express();
const router         = express.Router();
const url            = require('url');

console.log('see server log output at '+__dirname + '/log.txt');
const log_file = require('fs').createWriteStream(__dirname + '/log.txt', {flags : 'a'})
app.use(morgan(':remote-addr :method :url :status :response-time ms - :res[content-length] referrer:":referrer"'));

function fullUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
}

// CORS Headers
function setCorsHeaders(orig, res) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    //res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Origin', orig);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Access-Control-Allow-Origin, X-Requested-With, Content-Type, Authorization, Accept, X-Access-Token, X-Key');
}

app.set('views', './views');
app.set('view engine', 'ejs');


app.use(cookieParser());

app.get('/js.cookie.js', function(req, res) {
    res.sendFile('js.cookie.js',{root:__dirname});
});
app.get('/pocHandlers.js', function(req, res) {
    res.sendFile('pocHandlers.js',{root:__dirname});
});

app.get('/hello', function(req, res) {
    res.send('Hello');
});

app.get('/json', function(req, res) {
    res.json({data: 'Hello'});
});

app.get('/filezip', function(req, res) {
    var file = path.join(__dirname, '/ZipFile.zip');
    res.download(file); // Set disposition and send it.
});

/**
 * Module exports.
 * @public
 */

module.exports = {app, setCorsHeaders, fullUrl};
