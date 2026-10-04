package com.expense.tracker.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.expense.tracker.dto.AuthResponse;
import com.expense.tracker.dto.LoginRequest;
import com.expense.tracker.dto.RegisterRequest;
import com.expense.tracker.entity.User;
import com.expense.tracker.repository.UserRepository;
import com.expense.tracker.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // REGISTER
    public User register(RegisterRequest request) {

        if (request.getUsername() == null ||
                request.getUsername().trim().isEmpty()) {

            throw new RuntimeException("Username is required");
        }

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null ||
                request.getPassword().length() < 6) {

            throw new RuntimeException(
                    "Password must contain at least 6 characters"
            );
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        return userRepository.save(user);
    }

    // LOGIN
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid username or password"
            );
        }

        String token =
                jwtService.generateToken(user.getUsername());

        return new AuthResponse(
                token,
                user.getUsername()
        );
    }
    public void changePassword(
        String username,
        String currentPassword,
        String newPassword) {

    User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    if (currentPassword == null ||
            currentPassword.isBlank()) {

        throw new RuntimeException(
                "Current password is required");
    }

    if (newPassword == null ||
            newPassword.length() < 6) {

        throw new RuntimeException(
                "New password must contain at least 6 characters");
    }

    if (!passwordEncoder.matches(
            currentPassword,
            user.getPassword())) {

        throw new RuntimeException(
                "Current password is incorrect");
    }

    if (passwordEncoder.matches(
            newPassword,
            user.getPassword())) {

        throw new RuntimeException(
                "New password must be different from current password");
    }

    user.setPassword(
            passwordEncoder.encode(newPassword)
    );

    userRepository.save(user);
}
}