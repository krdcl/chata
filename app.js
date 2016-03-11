/* Requires */
var express = require('express');
var https = require('https');
var fs = require('fs');

var config = require('./config.json');
var path = require('path');


/* Config */
var port = 3000;
var app = express();
var server;


var alphanumeric = /^\w+$/;



/* Express */
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Routes */
app.use(config.url, express.static(path.join(__dirname, 'public')));
app.get(config.url, function (req, res) {
    res.render('index', {version:1});
});


    var http = require('http');
    server = http.createServer(app);

server.listen(port);

