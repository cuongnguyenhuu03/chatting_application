package com.nhc.ChattingApplication.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.nhc.ChattingApplication.entity.ChatMessage;
import com.nhc.ChattingApplication.entity.ChatNotification;
import com.nhc.ChattingApplication.entity.User;
import com.nhc.ChattingApplication.response.EntityResponse;
import com.nhc.ChattingApplication.service.ChatMessageService;
import com.nhc.ChattingApplication.service.UserService;

@Controller
public class ChatController {

    private final UserService userService;
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(
            UserService userService,
            ChatMessageService chatMessageService,
            SimpMessagingTemplate messagingTemplate) {
        this.userService = userService;
        this.chatMessageService = chatMessageService;
        this.messagingTemplate = messagingTemplate;
    }

    // update status online/ offline
    @MessageMapping("/user.addUser")
    @SendTo("/user/public")
    public User updateStatus(
            @Payload User user) {
        userService.updateStatus(user);
        return user;
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/public")
    public User disconnectUser(
            @Payload User user) {
        userService.disconnect(user);
        return user;
    }

    @GetMapping("/users")
    public ResponseEntity<EntityResponse> findConnectedUsers() {

        EntityResponse e = new EntityResponse();
        e.setDT(userService.findConnectedUsers());
        e.setEC(200);
        e.setEM("success");
        return ResponseEntity.ok(e);
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.save(chatMessage);

        ChatNotification chatNotification = new ChatNotification();
        chatNotification.setId(savedMsg.getId());
        chatNotification.setContent(savedMsg.getContent());
        chatNotification.setReceiverId(savedMsg.getReceiver().getId());
        chatNotification.setSenderId(savedMsg.getSender().getId());

        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiver().getEmail(),
                "/queue/messages",
                chatNotification);
    }

}
