package com.decolar.sistema_voos.service;

import com.decolar.sistema_voos.entity.Flight;
import com.decolar.sistema_voos.entity.FlightClass;
import com.decolar.sistema_voos.entity.Seat;
import com.decolar.sistema_voos.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    // Busca tradicional por rota (com fallback para datas próximas)
    public List<Flight> searchFlights(String from, String to, LocalDate date,
                                      int passengers, FlightClass flightClass) {
        // Primeiro tenta data exata
        List<Flight> exactFlights = flightRepository.findAvailableFlights(from, to, date, flightClass, passengers);
        if (!exactFlights.isEmpty()) {
            return exactFlights;
        }

        // Se não encontrou, busca em ±7 dias
        LocalDate startDate = date.minusDays(7);
        LocalDate endDate = date.plusDays(7);
        List<Flight> nearbyFlights = flightRepository.findFlightsInDateRange(from, to, startDate, endDate, flightClass, passengers);

        // Ordena por proximidade da data original
        nearbyFlights.sort(Comparator.comparingLong(f -> Math.abs(ChronoUnit.DAYS.between(date, f.getDate()))));

        return nearbyFlights;
    }

    // Recomendação por preço máximo (agora com origem e limitada a 3 destinos distintos)
    public List<Flight> recommendByBudget(String from, BigDecimal maxPrice, int passengers) {
        // 1. Busca todos os voos que atendem aos critérios básicos
        List<Flight> allFlights = flightRepository.findByFromAndPriceLessThanEqual(from, maxPrice, passengers);
        if (allFlights.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Agrupa por destino e seleciona o voo de maior preço (mais próximo do orçamento) para cada destino
        Map<String, Flight> bestByDestination = allFlights.stream()
                .collect(Collectors.toMap(
                        Flight::getTo,
                        f -> f,
                        (existing, replacement) ->
                                existing.getPrice().compareTo(replacement.getPrice()) >= 0 ? existing : replacement
                ));

        // 3. Ordena os voos selecionados pelo preço decrescente (mais próximo do maxPrice primeiro)
        List<Flight> recommendations = new ArrayList<>(bestByDestination.values());
        recommendations.sort((f1, f2) -> f2.getPrice().compareTo(f1.getPrice()));

        // 4. Retorna no máximo 3 recomendações
        return recommendations.stream().limit(3).collect(Collectors.toList());
    }

    // Método para popular dados de exemplo (1000 voos realistas)
    public void populateSampleData() {
        // Descomente para forçar recriação sempre que iniciar
        // flightRepository.deleteAll();

        if (flightRepository.count() > 0) {
            System.out.println(">>> Banco já contém dados. Pulando população.");
            return;
        }

        // === Definição de distâncias para cálculo de preço ===
        Map<String, Integer> distancias = new HashMap<>();
        distancias.put("GRU-GIG", 360);   distancias.put("GRU-REC", 2100);
        distancias.put("GRU-SSA", 1450);  distancias.put("GRU-POA", 850);
        distancias.put("GRU-CWB", 400);   distancias.put("GRU-FOR", 2350);
        distancias.put("GRU-MAO", 2700);  distancias.put("GRU-SCL", 2600);
        distancias.put("GRU-EZE", 1700);  distancias.put("GRU-MIA", 6500);
        distancias.put("CGH-SDU", 360);   distancias.put("CGH-REC", 2100);
        distancias.put("BSB-GIG", 920);   distancias.put("BSB-SSA", 1050);
        distancias.put("GIG-SSA", 1200);  distancias.put("GIG-REC", 1850);
        distancias.put("REC-FOR", 630);   distancias.put("SSA-REC", 680);
        distancias.put("POA-CWB", 530);   distancias.put("CWB-GIG", 670);
        distancias.put("EZE-SCL", 1140);  distancias.put("MIA-JFK", 1750);
        distancias.put("SCL-LIM", 3300);  distancias.put("LIS-LHR", 1600);
        distancias.put("LHR-CDG", 340);   distancias.put("CDG-FCO", 1100);

        java.util.function.BiFunction<String, String, BigDecimal> calcularPrecoBase = (orig, dest) -> {
            String chave1 = orig + "-" + dest;
            String chave2 = dest + "-" + orig;
            Integer distancia = distancias.getOrDefault(chave1, distancias.get(chave2));
            if (distancia == null) distancia = 1500;

            boolean isInternacional = orig.equals("SCL") || orig.equals("EZE") || orig.equals("MIA") ||
                    orig.equals("JFK") || orig.equals("LIS") || orig.equals("LHR") ||
                    orig.equals("CDG") || dest.equals("SCL") || dest.equals("EZE") ||
                    dest.equals("MIA") || dest.equals("JFK") || dest.equals("LIS") ||
                    dest.equals("LHR") || dest.equals("CDG");
            double taxaKm = isInternacional ? 0.35 : 0.25;
            return BigDecimal.valueOf(150 + distancia * taxaKm);
        };

        String[] origens = {"GRU", "CGH", "BSB", "GIG", "SDU", "REC", "SSA", "CNF", "POA", "CWB", "FOR", "MAO"};
        String[] destinos = {"GRU", "CGH", "BSB", "GIG", "SDU", "REC", "SSA", "CNF", "POA", "CWB", "FOR", "MAO",
                "SCL", "EZE", "MIA", "JFK", "LIS", "LHR", "CDG"};
        String[] companhias = {"LATAM", "GOL", "AZUL", "American", "Delta", "United", "Air France", "TAP", "Iberia", "British Airways"};
        FlightClass[] classes = {FlightClass.ECONOMICA, FlightClass.EXECUTIVA};
        Random rand = new Random();
        List<Flight> flights = new ArrayList<>();

        int totalVoos = 5000;
        for (int i = 0; i < totalVoos; i++) {
            String origem = origens[rand.nextInt(origens.length)];
            String destino;
            do {
                destino = destinos[rand.nextInt(destinos.length)];
            } while (destino.equals(origem));

            LocalDate data = LocalDate.now().plusDays(rand.nextInt(60) + 1);
            LocalTime partida = LocalTime.of(rand.nextInt(24), rand.nextInt(12) * 5);
            String cia = companhias[rand.nextInt(companhias.length)];
            FlightClass classe = classes[rand.nextInt(classes.length)];

            BigDecimal precoBase = calcularPrecoBase.apply(origem, destino);
            double variacao = 0.85 + (rand.nextDouble() * 0.3);
            BigDecimal precoFinal = precoBase.multiply(BigDecimal.valueOf(variacao))
                    .setScale(2, java.math.RoundingMode.HALF_UP);
            if (classe == FlightClass.EXECUTIVA) {
                precoFinal = precoFinal.multiply(BigDecimal.valueOf(2.5))
                        .setScale(2, java.math.RoundingMode.HALF_UP);
            }

            int assentos = 20 + rand.nextInt(180);

            String id = cia.substring(0, Math.min(2, cia.length())).toUpperCase() + String.format("%05d", i);
            Flight voo = new Flight();
            voo.setId(id);
            voo.setFrom(origem);
            voo.setTo(destino);
            voo.setDate(data);
            voo.setDeparture(partida);
            voo.setAirline(cia);
            voo.setPrice(precoFinal);
            voo.setFlightClass(classe);
            voo.setAvailableSeats(assentos);

            // ========== Criar assentos para este voo ==========
            int totalAssentos = assentos; // quantidade gerada aleatoriamente
            for (int j = 0; j < totalAssentos; j++) {
                int fileira = (j / 6) + 1;
                char letra = (char) ('A' + (j % 6));
                String seatNumber = fileira + String.valueOf(letra);

                Seat seat = new Seat();
                seat.setSeatNumber(seatNumber);
                seat.setAvailable(true);
                seat.setFlight(voo);
                voo.getSeats().add(seat); // <-- Adiciona à lista do voo (cascade)
            }

            flights.add(voo);
        }

        flightRepository.saveAll(flights);
        System.out.println(">>> " + flights.size() + " voos gerados com sucesso!");
    }
}