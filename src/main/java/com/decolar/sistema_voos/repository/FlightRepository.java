package com.decolar.sistema_voos.repository;

import com.decolar.sistema_voos.entity.Flight;
import com.decolar.sistema_voos.entity.FlightClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, String> {

    // Busca por rota: origem, destino, data, classe (ignora passageiros por enquanto)
    List<Flight> findByFromAndToAndDateAndFlightClass(String from, String to, LocalDate date, FlightClass flightClass);

    // Busca para recomendação por preço: voos com preço <= valorMaximo (sem origem)
    List<Flight> findByPriceLessThanEqual(BigDecimal maxPrice);

    // Busca com filtro de assentos disponíveis >= passageiros (data exata)
    @Query("SELECT f FROM Flight f WHERE f.from = :from AND f.to = :to AND f.date = :date " +
            "AND f.flightClass = :flightClass AND f.availableSeats >= :passengers")
    List<Flight> findAvailableFlights(@Param("from") String from,
                                      @Param("to") String to,
                                      @Param("date") LocalDate date,
                                      @Param("flightClass") FlightClass flightClass,
                                      @Param("passengers") int passengers);

    // Busca com intervalo de datas (±7 dias) e assentos suficientes
    @Query("SELECT f FROM Flight f WHERE f.from = :from AND f.to = :to " +
            "AND f.date BETWEEN :startDate AND :endDate " +
            "AND f.flightClass = :flightClass " +
            "AND f.availableSeats >= :passengers")
    List<Flight> findFlightsInDateRange(@Param("from") String from,
                                        @Param("to") String to,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate,
                                        @Param("flightClass") FlightClass flightClass,
                                        @Param("passengers") int passengers);

    // CORRIGIDO: Busca por origem, preço máximo TOTAL (preço unitário * passageiros) e assentos suficientes
    @Query("SELECT f FROM Flight f WHERE f.from = :from AND (f.price * :passengers) <= :maxPrice AND f.availableSeats >= :passengers")
    List<Flight> findByFromAndPriceLessThanEqual(@Param("from") String from,
                                                 @Param("maxPrice") BigDecimal maxPrice,
                                                 @Param("passengers") int passengers);
}