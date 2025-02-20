package com.chat.websocket.controller;

import com.chat.websocket.model.Message;
import com.chat.websocket.model.MessageAndUsername;
import com.chat.websocket.model.Username;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat")
    @SendTo("/topic/channel")
    public MessageAndUsername getMessageAndUsername(Message message, Username username){
        System.out.println(message.getMessage() + " " + username.getUsername());
        return new MessageAndUsername(message.getMessage(), username.getUsername());
    }
}
