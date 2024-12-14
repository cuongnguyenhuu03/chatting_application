package com.nhc.ChattingApplication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhc.ChattingApplication.entity.ChatRoom;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    ChatRoom findBySenderIdAndReceiverId(Long senderId, Long receiverId);
}
