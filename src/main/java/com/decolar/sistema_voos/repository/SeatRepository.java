/*
 * SeatRepository.java
 *
 * Repositório JPA para a entidade Seat. Fornece método para buscar todos os
 * assentos associados a um voo específico.
 */

package com.decolar.sistema_voos.repository;

import com.decolar.sistema_voos.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByFlightId(String flightId);
}