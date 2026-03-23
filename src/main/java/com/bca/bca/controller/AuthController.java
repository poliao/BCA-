package com.bca.bca.controller;

import com.bca.bca.dto.LoginRequest;
import com.bca.bca.dto.LoginResponse;
import com.bca.bca.dto.RegisterRequest;
import com.bca.bca.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
    }
}
