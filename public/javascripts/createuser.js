$(document).ready(function(){
    var socket = io("http://localhost:3000");
    $('#createUserBtn').on('click', function(){
        var username = $('#usernameBtn').val();
        socket.emit('add new user', username);
    });
    socket.on('response new message', function(){
        console.log('response new message aha!');
    });
})