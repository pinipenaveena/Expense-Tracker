
package com.expense.tracker.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.tracker.dto.AuthResponse;
import com.expense.tracker.dto.ChangePasswordRequest;
import com.expense.tracker.dto.LoginRequest;
import com.expense.tracker.dto.RegisterRequest;
import com.expense.tracker.dto.UserResponse;
import com.expense.tracker.entity.User;
import com.expense.tracker.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public UserResponse register(
            @RequestBody RegisterRequest request) {

        User user =
                authService.register(request);

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }


    // =========================
    // CHANGE PASSWORD
    // =========================

    @PostMapping("/change-password")
    public String changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        String username =
                authentication.getName();

        authService.changePassword(
                username,
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        return "Password changed successfully";
    }
}
