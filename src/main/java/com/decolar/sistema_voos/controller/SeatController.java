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

    @GetMapping("/{flightId}")
    public ResponseEntity<List<Seat>> getSeats(@PathVariable String flightId) {
        return ResponseEntity.ok(seatService.getSeatsByFlight(flightId));
    }

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