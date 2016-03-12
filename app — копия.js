/* Requires */
var debug = function(string)
{
    console.log(string);
   // alert(string);
}

var http = require('http');
var Static = require('node-static');

var express = require('express');

var config = require('./config.json');

var path = require('path');

var websocket  = require('ws');

var port = 3000;
var app = express();

var portWeb =  8181;

var server = new websocket.Server({
    port: portWeb
});

// подключенные клиенты
var clients = {};

app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(config.url, express.static(path.join(__dirname, 'public')));
app.get(config.url, function (req, res) {
    res.render('chat', {version:1});
});




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

// обычный сервер (статика) на порту 8080
var fileServer = new Static.Server('.');
http.createServer(function (req, res) {

    fileServer.serve(req, res);

}).listen(port);

debug('Server running at http://127.0.0.1:/' + port)

