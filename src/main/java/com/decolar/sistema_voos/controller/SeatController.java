/*
 * SeatController.java
 *
 * Controller responsável pela consulta e reserva de assentos de um voo.
 * Permite obter o mapa de assentos disponíveis e efetuar a reserva temporária
 * dos assentos selecionados pelo usuário.
 */

package com.decolar.sistema_voos.controller;

import com.decolar.sistema_voos.entity.Seat;
import com.decolar.sistema_voos.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "*")
public class SeatController {

    @Autowired
    private SeatService seatService;

    /**
     * Retorna a lista de todos os assentos de um voo específico.
     */
    @GetMapping("/{flightId}")
    public ResponseEntity<List<Seat>> getSeats(@PathVariable String flightId) {
        return ResponseEntity.ok(seatService.getSeatsByFlight(flightId));
    }

    /**
     * Reserva um conjunto de assentos para um determinado voo.
     * Retorna erro caso algum assento já esteja ocupado.
     */
    @PostMapping("/reserve")
    public ResponseEntity<String> reserveSeats(@RequestParam String flightId,
                                               @RequestBody List<String> seatNumbers) {
        boolean success = seatService.reserveSeats(seatNumbers, flightId);
        if (success) {
            return ResponseEntity.ok("Assentos reservados com sucesso!");
        } else {
            return ResponseEntity.badRequest().body("Um ou mais assentos já estão ocupados.");
        }
    }
}