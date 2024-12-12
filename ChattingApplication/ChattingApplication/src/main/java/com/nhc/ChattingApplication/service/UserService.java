package com.nhc.ChattingApplication.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nhc.ChattingApplication.entity.Status;
import com.nhc.ChattingApplication.entity.User;
import com.nhc.ChattingApplication.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByEmail(String email) {
        User user = this.userRepository.findByEmail(email);
        return user;
    }

    public void updateStatus(User user) {
        user.setStatus(Status.ONLINE);
        this.userRepository.save(user);
    }

    public void disconnect(User user) {
        var storedUser = this.userRepository.findByEmail(user.getEmail());
        if (storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            this.userRepository.save(storedUser);
        }
    }

    public List<User> findConnectedUsers() {
        return this.userRepository.findAllByStatus(Status.ONLINE);
    }
}
