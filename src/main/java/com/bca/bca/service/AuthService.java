package com.bca.bca.service;

import com.bca.bca.dto.LoginRequest;
import com.bca.bca.dto.LoginResponse;
import com.bca.bca.dto.RegisterRequest;
import com.bca.bca.entity.Role;
import com.bca.bca.entity.User;
import com.bca.bca.repository.UserRepository;
import com.bca.bca.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        
        if (user.getRoles() != null) {
            claims.put("roles", user.getRoles().stream()
                    .map(Role::getRoleCode)
                    .collect(Collectors.toList()));
        }

        String token = jwtUtils.generateToken(user.getUsername(), claims);

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .build();
    }

    @Transactional
    public void register(RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setIsActive(true);

        userRepository.save(user);
    }
}
