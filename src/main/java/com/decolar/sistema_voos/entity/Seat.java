/*
 * Seat.java
 *
 * Entidade que representa um assento em um voo. Cada assento está associado
 * a um voo específico e possui um número (ex: "12A") e um status de disponibilidade.
 * A anotação @JsonIgnore evita recursão infinita na serialização JSON.
 */

package com.decolar.sistema_voos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;
    private boolean available;

    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    @JsonIgnore
    private Flight flight;

    public Seat() {}

    public Seat(String seatNumber, boolean available, Flight flight) {
        this.seatNumber = seatNumber;
        this.available = available;
        this.flight = flight;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public Flight getFlight() { return flight; }
    public void setFlight(Flight flight) { this.flight = flight; }
}