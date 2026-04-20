package com.decolar.sistema_voos.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Flight {

    @Id
    private String id; // ex: "LA1234"

    @Column(name = "origin_airport", nullable = false)
    private String from; // código IATA (ex: GRU)

    @Column(name = "destination_airport", nullable = false)
    private String to;   // código IATA (ex: REC)

    @Column(name = "flight_date", nullable = false)
    private LocalDate date; // usar LocalDate em vez de String

    @Column(name = "departure_time")
    private LocalTime departure; // horário de partida

    private String airline;

    @Column(precision = 10, scale = 2)
    private BigDecimal price; // BigDecimal para cálculos precisos

    @Enumerated(EnumType.STRING)
    private FlightClass flightClass; // Enum para Econômica/Executiva

    private Integer availableSeats; // assentos disponíveis (para controle de lotação)

    // NOVO: Relacionamento com assentos
    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seat> seats = new ArrayList<>();

    // Construtor padrão (obrigatório para JPA)
    public Flight() {
    }

    // Construtor com os campos principais
    public Flight(String id, String from, String to, LocalDate date, LocalTime departure,
                  String airline, BigDecimal price, FlightClass flightClass, Integer availableSeats) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.date = date;
        this.departure = departure;
        this.airline = airline;
        this.price = price;
        this.flightClass = flightClass;
        this.availableSeats = availableSeats;
    }

    // Getters e Setters existentes...

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getDeparture() {
        return departure;
    }

    public void setDeparture(LocalTime departure) {
        this.departure = departure;
    }

    public String getAirline() {
        return airline;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public FlightClass getFlightClass() {
        return flightClass;
    }

    public void setFlightClass(FlightClass flightClass) {
        this.flightClass = flightClass;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    // NOVO: Getter e Setter para seats
    public List<Seat> getSeats() {
        return seats;
    }

    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
}