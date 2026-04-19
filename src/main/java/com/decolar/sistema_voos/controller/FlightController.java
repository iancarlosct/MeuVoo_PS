package com.decolar.sistema_voos.controller;

import com.decolar.sistema_voos.entity.Flight;
import com.decolar.sistema_voos.entity.FlightClass;
import com.decolar.sistema_voos.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*") // Permite acesso do frontend (ajuste conforme necessário)
public class FlightController {

    @Autowired
    private FlightService flightService;

    // Endpoint para busca por rota
    @GetMapping("/search")
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam int passengers,
            @RequestParam FlightClass flightClass) {

        List<Flight> flights = flightService.searchFlights(from, to, date, passengers, flightClass);
        return ResponseEntity.ok(flights);
    }

    // Endpoint para recomendação por preço (AGORA COM ORIGEM)
    @GetMapping("/recommend")
    public ResponseEntity<List<Flight>> recommendByBudget(
            @RequestParam String from,
            @RequestParam BigDecimal maxPrice,
            @RequestParam int passengers) {

        List<Flight> flights = flightService.recommendByBudget(from, maxPrice, passengers);
        return ResponseEntity.ok(flights);
    }

    // (Opcional) Endpoint para popular dados – pode chamar ao iniciar a aplicação
    @PostMapping("/populate")
    public ResponseEntity<String> populate() {
        flightService.populateSampleData();
        return ResponseEntity.ok("Dados de exemplo inseridos.");
    }
}