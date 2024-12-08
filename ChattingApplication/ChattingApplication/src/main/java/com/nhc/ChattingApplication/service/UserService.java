package com.nhc.ChattingApplication.service;

import org.springframework.stereotype.Service;

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
}
