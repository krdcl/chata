var debug = function(string)
{
    console.log(string);
    // alert(string);
}

/* Requires */
var favicon = require('serve-favicon');
var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

var config = require('./config.json');
var pack = require('./package.json');
var path = require('path');
var websocket  = require('ws');

var port = config.port;
var portWeb =  config.portws;
var app = express();
var server;

var serverWS = new websocket.Server({
    port: portWeb
});

var clients = [];
var clients_count = 0;

function getClientById(id)
{
    clients.forEach(function(client)
    {
        if (client.id == id)
        return client;
    });
}

function removeClientById(id)
{
    var counter = 0;
    clients.forEach(function(client)
    {
        if (client.id == id)
        {
           // delete clients[counter];
            clients.splice(id,1);
            clients_count--;
            return ;
        }
        counter++;
    });

    for (var i = counter; i < clients.length; i++ )
        clients[i].id = i;
}

function sendMessageToClientById(id, message)
{
    var client = getClientById(id);
    client.connection.send(message);
}

function sendMessageToAllClients(message)
{
    clients.forEach(function(client)
    {
       var connection =  client.connection;
       connection.send(message);
    });
}

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

function getRandomStr()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('start', 'Listening at ' + bind);
}


serverWS.on("text", function (str)
{
    debug("Received "+str)
    conn.sendText(" text !!!")
})

serverWS.on("open", function (str)
{
    debug("open  "+str)
    conn.send("server see you (open)");
});

serverWS.on('connection', function(conn)
{
    var id = clients_count;
    clients_count++;

    //conn.send("connected");
    debug("new connection " + conn);

    var client = {
        "id": id,
        "name": "user_" + getRandomStr() + "_" + id,
        "connection": conn,
        "role": 0 //user
    };

    conn.send("1>" + client.name);
    sendMessageToAllClients("0>" + client.name + " online ")

    clients.push(client);

    conn.on("close", function (code, reason)
    {
        debug("Connection closed");
        removeClientById(id);
        sendMessageToAllClients("0>" + client.name + " go offline ")

    });

    conn.on('message', function( message)
    {
        debug (message );

        var commant_end = message.indexOf(">")
        var command = message.substring(0, commant_end );
        var msg = message.substring(commant_end + 1, message.length - 1);

        switch (command)
        {
            case "0": //just message broadcast
                var sended_msg = "0>from " +  client.name + ": " + msg;
                sendMessageToAllClients(sended_msg);
            break;
        }
       // user.send("server see your message " + message);
        /* for (var key in clients) {
         clients[key].send(message);
         }*/
    });
});


/*
var sendBroadcast = function broadcast(server, msg)
{
    server.connections.forEach(function (conn)
    {
        conn.sendText(msg);
    })
}*/
