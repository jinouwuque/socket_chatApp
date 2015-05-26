
var online_status = require('../middlewares/online_status');
function socket_app(io){
    io.on('connection', function(socket){
        for(var i = 0 ; i < 3; i ++){
            socket.send({
                iconid: 1,
                username: 'node zj',
                msg: 'gaga gagaga!'
            });
        }

        socket.on('new message', function(data){
            var senderinfo = online_status.onlineusers[socket.id];
            for(var i = 0; i < data.dest.length; i ++){
                socket.to(data.dest[i]).emit('group msg', {
                    iconid: senderinfo.iconid,
                    username: senderinfo.username,
                    msg : data.msg
                });
            }
        });
        socket.on('add new user', function (data) {
            // we tell the client to execute 'new message'
            online_status.onlineusers[socket.id] = {
                username: data.username,
                iconid : data.iconid,
                userid: socket.id,
                colorid : online_status.colorindex++
            };
            online_status.numUsers ++;
            socket.broadcast.emit('inf_updateUsers', online_status.onlineusers);
            socket.emit('ack_conn', socket.id);
        });

        // when the client emits 'typing', we broadcast it to others
        socket.on('typing', function () {
            socket.broadcast.emit('typing', {
                username: socket.username
            });
        });

        // when the client emits 'stop typing', we broadcast it to others
        socket.on('stop typing', function () {
            socket.broadcast.emit('stop typing', {
                username: socket.username
            });
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
            delete online_status.onlineusers[socket.id];
            --online_status.numUsers;
            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: online_status.numUsers
            });
        });
    });
}

module.exports = socket_app;