$(document).ready(function(){
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
});

var username = "";

//create a new WebSocket object.
var msgBox = $('#message-box');
var wsUri = "ws://localhost:9000/your-path/server.php";
websocket = new WebSocket(wsUri);

websocket.onopen = function(ev) { // connection is open
    msgBox.append('<div id="welcome" class="system_msg" style="color:#f1f0f0">Welcome to Hessam WebSocket Chat</div>'); //notify user
}
// Message received from server
websocket.onmessage = function(ev) {
    var response 		= JSON.parse(ev.data); //PHP sends Json data

    var res_type 		= response.type; //message type
    var user_message 	= response.message; //message text
    var user_name 		= response.name; //user name
    var user_color 		= response.color; //color

    switch(res_type){
        case 'usermsg':
            // msgBox.append('<div><span class="user_name" style="color:' + user_color + '">' + user_name + '</span> : <span class="user_message">' + user_message + '</span></div>');

            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

            if (user_message && user_name != null){
                if (user_name === username){
                    msgBox.append('<div class="d-flex justify-content-start mb-4"><div class="msg_cotainer">'+user_message+'<span class="msg_time">'+time+'</span></div></div>');
                }else {
                    msgBox.append('<div class="d-flex justify-content-end mb-4"> <span class="white-font avatar-name">'+user_name+'</span><div class="msg_cotainer_send">'+user_message+'<span class="msg_time_send">'+time+'</span></div></div>');
                }
            }
            break;
        case 'system':
            msgBox.append('<div style="color:#bbbbbb">' + user_message + '</div>');
            break;
    }
    msgBox[0].scrollTop = msgBox[0].scrollHeight; //scroll message
};

websocket.onerror	= function(ev){ msgBox.append('<div class="system_error">Error Occurred - ' + ev.data + '</div>'); };
websocket.onclose 	= function(ev){ msgBox.append('<div class="system_msg">Connection Closed</div>'); };

//Message send button
$('#send-message').click(function(){
    send_message();
});

//User hits enter key
$( "#message" ).on( "keydown", function( event ) {
    if(event.which==13){
        send_message();
    }
});

//Send message
function send_message(){
    if ($('#message').val() === "" || $('#message').val() === null || $('#message').val() === '\n'){
        return;
    }

    if ($('#name').val() === ""){
        alert("Please enter your name to start chat");
        return;
    }

    var message_input = $('#message'); //user message text
    var name_input = $('#name'); //user name
    $('#name').hide();
    var welcome = $('#welcome');
    username = $('#name').val();
    welcome.append(' - <span id="the-name">'+$('#name').val()+'</span>')

    if(message_input.val() == ""){ //empty name?
        alert("Enter your Name please!");
        return;
    }
    if(message_input.val() == ""){ //emtpy message?
        alert("Enter Some message Please!");
        return;
    }

    //prepare json data
    var msg = {
        message: message_input.val(),
        name: name_input.val(),
        color : '<?php echo $colors[$color_pick]; ?>'
    };
    //convert and send data to server
    websocket.send(JSON.stringify(msg));
    message_input.val(''); //reset message input
}