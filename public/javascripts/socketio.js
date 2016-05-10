$(function(){
    // curUser = token from backend
    var socket = io();
    var messageCodes = {
        global: 'global',
        private: 'private'
    };
    var msg = $('#messageInput');
    var messages = $('#messageList');

    // on form submit check for empty string
    // then send global message
    $("form").submit(function(e) {
        if (msg.val() !== "") {
            socket.emit(messageCodes.global, {message: msg.val(), user: curUser.user_name});
            msg.val("");
        }
        return false;
    });

    // handle socket response message
    socket.on(messageCodes.global, function(data){
        console.log(data);
        return messageFormat(data.message, data.user);
    });

    // format message to display username nicely
    function messageFormat(message, userName){
        var style = userName === curUser.user_name ? 'myMessage' : 'notMyMessage';;
        var col;
        var uname;
        var text = $('<li>', {class: 'text-left'}).text(message);

        col = $('<div>', {class: 'col-md-12 col-sm-12 ' + style});
        uname = $('<div>', {class: 'col-md-12 col-sm-12 ' + style + ' username'});
        uname.append($('<li>', {class: 'text-left'}).text(userName));
        col.append(uname).append(text);
        messages.append(col);
    }
});