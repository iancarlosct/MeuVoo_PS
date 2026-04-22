/*
 * UserRepository.java
 *
 * Repositório JPA para a entidade User. Fornece métodos para busca por e-mail
 * e verificação de existência de e-mail e CPF.
 */

package com.decolar.sistema_voos.repository;

import com.decolar.sistema_voos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
}