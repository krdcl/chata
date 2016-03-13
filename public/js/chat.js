/**
 * Created by Yura on 12.03.2016.
 */
if (!window.WebSocket)
{
    document.body.innerHTML = 'WebSocket in this browser not supported.';
}

var debug = function(string)
{
    console.log(string);
  // alert(string);
}

var portWeb =  3001;

var socket = new WebSocket("ws://127.0.0.1:" + portWeb);

var client_name = "";

socket.onopen = function()
{
    debug("Connection success.");
};

socket.onclose = function(event)
{
    if (event.wasClean)
        debug('Connection closed clear');
    else
        debug('Connection breaked'); // например, "убит" процесс сервера

    debug('Code: ' + event.code + ' reason: ' + event.reason);
};

socket.onmessage = function(event)
{
    var data = event.data;
    var commant_end = data.indexOf(">")
    var command = data.substring(0, commant_end  );
    var msg = data.substring(commant_end + 1, data.length - 1);
    debug("Message from server: " + event.data);

    switch (command)
    {
    case "0": //just message
        appendTextToArea(msg);
        break;
    case "1":
        client_name = msg;
        $('#welcome').text("Welcome " + client_name );
        break;
    }
};

socket.onerror = function(error)
{
    debug("Error " + error.message);
};

var sendMessage = function(string)
{
    string = "0>" + string;
    socket.send(string);

}


var guiSendMessage = function()
{
    var text = $('#usermsgid').val();
    debug("mesg value: " + text);
    sendMessage(text);
    $('#usermsgid').val('');
}


$('#submitmsg').bind('click', guiSendMessage );

/*
$('#usermsgid').bind('onkeypress', function()
{
    if(characterCode == 13)
    {
        guiSendMessage();
    }
});*/

$("#usermsgid").keypress(function (e)
{
    if (e.which == 13)
    {
        e.preventDefault();
        guiSendMessage();
        return;
    }
})

function appendTextToArea(text)
{
    //$('<p>' + text + '</p>').appendTo('#chatbox');
    var last_msg =  $('#chatbox').val();
    $('#chatbox').prepend('<p>' + text + '</p>');
}
