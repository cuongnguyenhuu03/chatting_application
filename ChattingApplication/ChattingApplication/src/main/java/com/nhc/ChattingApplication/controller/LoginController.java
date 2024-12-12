package com.nhc.ChattingApplication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.nhc.ChattingApplication.entity.User;
import com.nhc.ChattingApplication.response.EntityResponse;
import com.nhc.ChattingApplication.util.SecurityUtil;

@RestController
public class LoginController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;

    public LoginController(
            AuthenticationManagerBuilder authenticationManagerBuilder,
            SecurityUtil securityUtil) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<EntityResponse> postMethodName(@RequestBody User user) {

        // nạp input gồm username/ password vào security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                user.getEmail(), user.getPassword());

        // xác thực người dùng => cần viết hàm loaduserByUserName
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String access_token = this.securityUtil.createAccessToken(user.getEmail());

        EntityResponse e = new EntityResponse();
        e.setDT(access_token);
        e.setEC(200);
        e.setEM("success");

        return ResponseEntity.ok().body(e);
    }

}
