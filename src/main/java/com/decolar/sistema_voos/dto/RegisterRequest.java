/*
 * RegisterRequest.java
 *
 * DTO que representa a requisição de cadastro de novo usuário.
 * Contém os dados pessoais e credenciais enviados pelo frontend.
 */

package com.decolar.sistema_voos.dto;

public class RegisterRequest {

    private String nome;
    private String email;
    private String cpf;
    private String password;

    public RegisterRequest() {}

    public RegisterRequest(String nome, String email, String cpf, String password) {
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}