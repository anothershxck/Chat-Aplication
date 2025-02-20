const stompClient = new StompJs.Client({
    brokerURL: "ws://localhost:8080/broker"
});
var cantMessage = 1;
var cantDate = 1;

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/channel', (message) => {
        const parsedMessage = JSON.parse(message.body);
        const userMessage = parsedMessage.message;
        const username = parsedMessage.username;
        showMessage(userMessage, username);

    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['content']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    if (connected) {
        $("#tableMessage").show();
    }
    else {
        $("#tableMessage").hide();
    }
    $("#messages").html("");
}
function connect() {
    stompClient.activate();
    console.log("Connected");
}
function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}
function sendMessage() {
    if($("#inputMessage").val().trim() !== ""){
        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify({
                'message': $("#inputMessage").val(),
                'username': $("#inputUser").val()
            })
        });
        
    }
    
}
function showMessage(message, username) {
    let date = new Date();
    $("#messages").append("<tr id='" + cantMessage + "'><td><h4 id='username'>" + username + "</h4>" + message + "</td></tr>");
    $("#messages").append("<p id='" + cantDate + "'>" + date.getHours()  + ":" + date.getMinutes() + "</p>");
    deleteOldMessages();
    deleteOldDates();
    cantMessage++;
    cantDate++;
}

function deleteOldMessages(){
    if (cantMessage > 4) {
        $("#" + (cantMessage - 4)).remove();
    }
}
function deleteOldDates(){
    if (cantDate > 4) {
        $("#" + (cantDate - 4)).remove();
    }
}

function consumeMaxCharacters(){
    var inputMessage = $("#inputMessage");

    inputMessage.on('keydown', function() {
        if(inputMessage.val().length > 70) {
            inputMessage.val(inputMessage.val().slice(0, 70));
        }
    });
}
function verifyInputUsername(){
    if($("#inputUser").val().trim() === ""){
        $("#send").prop("disabled", true);
        alert("Please enter your username");
    } else {
        $("#send").prop("disabled", false);
    }
}
$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    connect();
    consumeMaxCharacters();
    $("#inputMessage").on('keydown', () => {verifyInputUsername();});
    $("#send").click(() => sendMessage());
    $("#send").click(() => $("#inputMessage").val(""));
});