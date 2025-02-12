package com.chat.websocket.controller;

import com.chat.websocket.model.Content;
import com.chat.websocket.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {

    @MessageMapping("/chat")
    @SendTo("/topic/channel")
    public Message getMessage(Content content){
        System.out.println(content.getName());
        return new Message(content.getName());
    }
}
