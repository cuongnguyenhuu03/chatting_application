package com.nhc.ChattingApplication.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class PostController {

    @GetMapping("/post")
    public ResponseEntity<String> getMethodName() {
        return ResponseEntity.ok().body("post");
    }
}
