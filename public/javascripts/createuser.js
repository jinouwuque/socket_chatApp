$(document).ready(function(){
    var socket = io("http://localhost:3000");
    $('#createUserBtn').on('click', function(){
        debugger;
        var username = $('#usernameBtn').val();
        socket.emit('new message', username);
    });
    socket.on('response new message', function(){
        console.log('response new message aha!');
    });
})