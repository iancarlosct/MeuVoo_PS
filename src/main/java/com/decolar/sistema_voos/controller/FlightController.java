/*
 * FlightController.java
 *
 * Controller responsável pelos endpoints de busca de voos.
 * Oferece duas modalidades de pesquisa: por rota (origem/destino/data)
 * e por orçamento (recomendação baseada no valor máximo informado).
 */

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
@CrossOrigin(origins = "*")
public class FlightController {

    @Autowired
    private FlightService flightService;

    /**
     * Busca voos por rota, data, número de passageiros e classe.
     * Caso não haja voos na data exata, retorna opções em datas próximas (±7 dias).
     */
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

    /**
     * Recomenda destinos a partir de uma origem, respeitando um orçamento máximo
     * e a quantidade de passageiros informada.
     */
    @GetMapping("/recommend")
    public ResponseEntity<List<Flight>> recommendByBudget(
            @RequestParam String from,
            @RequestParam BigDecimal maxPrice,
            @RequestParam int passengers) {

        List<Flight> flights = flightService.recommendByBudget(from, maxPrice, passengers);
        return ResponseEntity.ok(flights);
    }

    /**
     * Endpoint auxiliar para forçar a população de dados de exemplo.
     */
    @PostMapping("/populate")
    public ResponseEntity<String> populate() {
        flightService.populateSampleData();
        return ResponseEntity.ok("Dados de exemplo inseridos.");
    }
}