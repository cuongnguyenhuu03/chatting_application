package com.nhc.ChattingApplication.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.nhc.ChattingApplication.entity.ChatMessage;
import com.nhc.ChattingApplication.repository.ChatMessageRepository;

@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;

    public ChatMessageService(
            ChatMessageRepository chatMessageRepository,
            ChatRoomService chatRoomService) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomService = chatRoomService;
    }

    public ChatMessage save(ChatMessage chatMessage) {

        var chatRoom = chatRoomService
                .getChatRoomName(chatMessage.getSender().getId(), chatMessage.getReceiver().getId(), true)
                .orElseThrow();
        chatMessage.setRoomName(chatRoom);

        this.chatMessageRepository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(
            Long senderId,
            Long recipientId) {
        var chatroomName = chatRoomService.getChatRoomName(senderId, recipientId, false).get();
        List<ChatMessage> chatList = new ArrayList<>();
        chatList = this.chatMessageRepository.findByRoomName(chatroomName);
        return chatList;
    }
}
