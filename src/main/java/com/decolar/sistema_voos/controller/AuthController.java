/*
 * AuthController.java
 *
 * Controller responsável pelos endpoints de autenticação (registro e login).
 * Recebe requisições do frontend, delega a lógica de negócio ao AuthService
 * e retorna respostas adequadas em caso de sucesso ou erro.
 */

package com.decolar.sistema_voos.controller;

import com.decolar.sistema_voos.dto.LoginRequest;
import com.decolar.sistema_voos.dto.RegisterRequest;
import com.decolar.sistema_voos.dto.UserResponse;
import com.decolar.sistema_voos.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Endpoint para cadastro de novo usuário.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            UserResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para autenticação de usuário existente.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            UserResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}