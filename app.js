var debug = function(string)
{
    console.log(string);
    // alert(string);
}

/* Requires */
var favicon = require('serve-favicon');
var readline = require('readline');
var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

var config = require('./config.json');
var pack = require('./package.json');
var path = require('path');
var websocket  = require('ws');

var port = 3000;
var portWeb =  3001;
var app = express();
var server;

var serverWS = new websocket.Server({
    port: portWeb
});


/* Express */
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname,'public/img/favicon.png')));
app.locals.version = pack.version;


app.use(config.url, express.static(path.join(__dirname, 'public')));
app.get(config.url, function (req, res) {
    res.render('index', {version:pack.version});
});


server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {

}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('start', 'Listening at ' + bind);
}


server.on("text", function (str)
{
    debug("Received "+str)
    conn.sendText(str.toUpperCase()+"!!!")
})

server.on("close", function (code, reason)
{
    debug("Connection closed")
    //delete clients[id];
})

server.on('message', function(message)
{
    debug ('получено сообщение ' + message);
    /* for (var key in clients) {
     clients[key].send(message);
     }*/
});

var sendBroadcast = function broadcast(server, msg)
{
    server.connections.forEach(function (conn)
    {
        conn.sendText(msg);
    })
}
