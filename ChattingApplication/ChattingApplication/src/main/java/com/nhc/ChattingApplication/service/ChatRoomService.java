package com.nhc.ChattingApplication.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.nhc.ChattingApplication.entity.ChatRoom;
import com.nhc.ChattingApplication.repository.ChatRoomRepository;
import com.nhc.ChattingApplication.repository.UserRepository;

@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public ChatRoomService(
            ChatRoomRepository chatRoomRepository,
            UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
    }

    public Optional<String> getChatRoomName(
            Long senderId,
            Long recipientId,
            boolean createNewRoomIfNotExists) {

        return chatRoomRepository
                .findBySenderIdAndReceiverId(senderId, recipientId)
                .map(ChatRoom::getChatName)
                .or(() -> {
                    if (createNewRoomIfNotExists) {
                        var chatRoomName = createChatName(senderId, recipientId);
                        return Optional.of(chatRoomName);
                    }

                    return Optional.empty();
                });
    }

    private String createChatName(Long senderId, Long recipientId) {

        var chatName = String.format("%s_%s", senderId, recipientId);

        ChatRoom senderRecipientRoom = new ChatRoom();
        senderRecipientRoom.setChatName(chatName);
        senderRecipientRoom.setSender(this.userRepository.findById(senderId).get());
        senderRecipientRoom.setReceiver(this.userRepository.findById(recipientId).get());

        ChatRoom recipientSenderRoom = new ChatRoom();
        senderRecipientRoom.setChatName(chatName);
        senderRecipientRoom.setSender(this.userRepository.findById(recipientId).get());
        senderRecipientRoom.setReceiver(this.userRepository.findById(senderId).get());

        chatRoomRepository.save(senderRecipientRoom);
        chatRoomRepository.save(recipientSenderRoom);

        return chatName;
    }
}
