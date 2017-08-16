'use strict'

/**
 * Module dependencies.
 * @private
 */
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cookieParser   = require('cookie-parser');
var path           = require('path');
var app            = express();
var router         = express.Router();

app.use(morgan('combined'));

// CORS Headers
function setCorsHeaders(orig, res) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    //res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Origin', orig);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Access-Control-Allow-Origin, X-Requested-With, Content-Type, Authorization, Accept, X-Access-Token, X-Key');
}

app.use(cookieParser());

app.get('/js.cookie.js', function(req, res) {
    res.sendFile('js.cookie.js',{root:__dirname});
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

module.exports = {app, setCorsHeaders};
