/**
 * Created by Yura on 12.03.2016.
 */
if (!window.WebSocket)
{
    document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
}

appendTextToArea("111111111111111111111111111");

var debug = function(string)
{
    console.log(string);
  // alert(string);
}

var portWeb =  3001;

var socket = new WebSocket("ws://127.0.0.1:" + portWeb);

socket.onopen = function() {
    debug("Соединение установлено.");
};

socket.onclose = function(event)
{
    if (event.wasClean)
        debug('Соединение закрыто чисто');
    else
        debug('Обрыв соединения'); // например, "убит" процесс сервера

    debug('Код: ' + event.code + ' причина: ' + event.reason);
};

socket.onmessage = function(event)
{
    var data = event.data;
    var commant_end = data.indexOf(">")
    var command = data.substring(0, commant_end - 1 );
    var msg = data.substring(commant_end + 1, data.length - 1);
    debug("Message from server: " + event.data);

    switch (command)
    {
    case "0": //just message
        appendTextToArea(msg);
        break;
    }


};

socket.onerror = function(error)
{
    debug("Ошибка " + error.message);
};

var sendMessage = function(string)
{
    string = "0>" + string;
    socket.send(string);
}


$('#submitmsg').bind('click', function()
{
    var text = $('#usermsg').val();
    debug("mesg value: " + text);

    sendMessage(text);
});

function appendTextToArea(text)
{
    $('<p>Text</p>').appendTo('#chatbox');
  //  $('#chatbox').val($('#chatbox').val() + text);
    //$('#usermsg').append(text);
}

debug("1111111111")