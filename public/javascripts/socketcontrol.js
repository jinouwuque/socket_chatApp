/**
 * Created by anp_zguo on 5/15/2015.
 */
var colors = [
    "#3871b6", "#e88c2a", "#b63834", "#91b544", "#990099", "#0099c6", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee",
    '#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#ffff00',
    '#7f7f7f', '#0c0c0c', '#1d1b10', '#0f243e', '#244061', '#632423', '#4f6128', '#3f3151', '#31859b', '#974806', '#7f6000',
    '#a5a5a5', '#262626', '#494429', '#17365d', '#366092', '#953734', '#76923c', '#5f497a', '#92cddc', '#e36c09', '#c09100',
    '#bfbfbf', '#3f3f3f', '#938953', '#548dd4', '#95b3d7', '#d99694', '#c3d69b', '#b2a2c7', '#a5d0e0', '#fac08f', '#f2c314',
    '#d8d8d8', '#595959', '#c4bd97', '#8db3e2', '#b8cce4', '#e5b9b7', '#d7e3bc', '#ccc1d9', '#b7dde8', '#fbd5b5', '#ffe694',
    '#f2f2f2', '#7f7f7f', '#ddd9c3', '#c6d9f0', '#dbe5f1', '#f2dcdb', '#ebf1dd', '#e5e0ec', '#dbeef3', '#fdeada', '#fff2ca'
];
$(document).ready(function(){
    var socket = io("http://localhost:3000");
    global = {
        username: 'initila',
        iconid : 2,
        userlist: null,
        userid: null
    };
    function showReceivedMessage(iconid, name, message, fade){
        var instance = $('#onemsgtemplate').children().clone();
        instance.find('.iconmsg').addClass('icon'+iconid);
        instance.find('h3').text(name);
        instance.find('p').text(message);
        if(fade){
            instance.css({'display': 'none'});
            $('.messagelist').append(instance);
            $('.messagelist li').last().fadeIn(600);
        }else{
            $('.messagelist').append(instance);
        }
        $('#chartArea1').animate({ scrollTop: $('#chartArea1').height() }, "slow");

    }
    $('#createUserBtn').on('click', function(){
        event.preventDefault();
        var username = $('#usernameBtn').val();
        if(username.trim().length < 2){
            alert('Username has to be larger than 3 characters!');
            return;
        }
        var newiconid = $('input[name= "iconradio"]:checked').attr('value');
        if(!newiconid){
            alert('select icon.');
            return false;
        }
        var newuserinfo = {
            iconid: newiconid,
            username: username || 'test user'
        };
        $.ajax({
            method: "POST",
            url: "/adduser",
            data: newuserinfo
        }).done(function( msg ) {
            debugger;
            global.username = username;
            global.iconid = newiconid;
        });
    });

    $('#sendbtn').on('click', function(){
        event.preventDefault();
        var sendstr = $('#chartinput').val();
        $('#chartinput').val('');
        showReceivedMessage(global.iconid, global.username, sendstr, false);
        var content = {
            dest: [],
            msg : sendstr
        };
        fillInReceiver(content.dest);
        socket.emit('new message', content);
    });
    socket.on('group msg', function(data){
        showReceivedMessage(data.iconid, data.username, data.msg, true);
    });
    socket.on('inf_updateUsers', function(userlist){
        $('.onlineuser1 ul').empty();
        updateUserlist(userlist);
    });

    socket.on('ack_conn', function(data){
        global.userid = data;
    });

    function updateUserlist(list) {
        $.each(list, function(key, value){
            if(value.userid != global.userid)
            addtoUserlist(value);
        });

    }
    function addtoUserlist(oneuser){
        var list = $('.onlineuser1 ul');
        list.append('<li><input type="checkbox" name="online-user" checked="checked" value = "' + oneuser.userid + '"><label style = "color: ' + colors[oneuser.colorid % 77] + '"><i class="uk-icon-user"></i>' + oneuser.username + '</label></li>');
    }

    function fillInReceiver(list){
        $('.onlineuser1>ul li').each(function(key, elem){
             var $elem = $(elem);
            var currentitem = $elem.find('input');
            if(currentitem.is(':checked')){
                list.push(currentitem.attr('value'));
            }
        });
    }
});