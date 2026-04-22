/*
 * UserResponse.java
 *
 * DTO que representa a resposta de autenticação (login ou cadastro bem‑sucedido).
 * Retorna os dados públicos do usuário para serem armazenados no frontend.
 */

package com.decolar.sistema_voos.dto;

public class UserResponse {

    private Long id;
    private String nome;
    private String email;

    public UserResponse() {}

    public UserResponse(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}