/*
 * LoginRequest.java
 *
 * DTO que representa a requisição de login do usuário.
 * Contém as credenciais (e-mail e senha) enviadas pelo frontend.
 */

package com.decolar.sistema_voos.dto;

public class LoginRequest {

    private String email;
    private String password;

    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}