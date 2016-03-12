/**
 * Created by Yura on 12.03.2016.
 */
if (!window.WebSocket)
{
    document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
}

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
    debug("Получены данные " + event.data);
};

socket.onerror = function(error)
{
    debug("Ошибка " + error.message);
};

var sendMessage = function(string)
{
    socket.send(string);
}


$('#submitmsg').bind('click', function()
{
    var text = $('#usermsg').val();
    debug("mesg value: " + text);

    sendMessage(text);
});

debug("1111111111")