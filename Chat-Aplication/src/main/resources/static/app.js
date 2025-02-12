const stompClient = new StompJs.Client({
    brokerURL: "ws://localhost:8080/broker"
});
var cantMessage = 1;

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/channel', (message) => {
        showMessage(JSON.parse(message.body).message);

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
$("#connect").prop("disabled", connected);
$("#disconnect").prop("disabled", !connected);
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
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}
function sendMessage() {
    stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({'name': $("#inputMessage").val()})
    });
}
function showMessage(message) {
    $("#messages").append("<tr id='" + cantMessage + "'><td>" + message + "</td></tr>");
    deleteOldMessages();
    console.log(cantMessage);
    cantMessage++;
}

function deleteOldMessages(){
    if (cantMessage > 6) {
        $("#" + (cantMessage - 6)).remove();
    }
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    connect();
    $("#send").click(() => sendMessage());
    $("#send").click(() => $("#inputMessage").val(""));
});