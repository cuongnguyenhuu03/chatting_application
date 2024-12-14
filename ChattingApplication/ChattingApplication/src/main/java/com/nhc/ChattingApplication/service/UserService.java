package com.nhc.ChattingApplication.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nhc.ChattingApplication.entity.User;
import com.nhc.ChattingApplication.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User fetchById(Long id) {
        return this.userRepository.findById(id).get();
    }

    public User getUserByEmail(String email) {
        User user = this.userRepository.findByEmail(email);
        return user;
    }

    public void updateStatus(User user) {
        var storedUser = this.userRepository.findByEmail(user.getEmail());
        storedUser.setStatus("ONLINE");
        this.userRepository.save(storedUser);
    }

    public void disconnect(User user) {
        var storedUser = this.userRepository.findByEmail(user.getEmail());
        if (storedUser != null) {
            storedUser.setStatus("OFFLINE");
            this.userRepository.save(storedUser);
        }
    }

    public List<User> findConnectedUsers() {
        return this.userRepository.findAllByStatus("ONLINE");
    }
}
