/*
 * SeatService.java
 *
 * Serviço responsável pela consulta e reserva de assentos de um voo.
 * Gerencia a disponibilidade dos assentos e garante atomicidade nas reservas.
 */

package com.decolar.sistema_voos.service;

import com.decolar.sistema_voos.entity.Seat;
import com.decolar.sistema_voos.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    /**
     * Retorna todos os assentos associados a um voo.
     */
    public List<Seat> getSeatsByFlight(String flightId) {
        return seatRepository.findByFlightId(flightId);
    }

    /**
     * Reserva um conjunto de assentos para um voo.
     * A operação é transacional: se algum assento já estiver ocupado, a reserva é cancelada.
     */
    @Transactional
    public boolean reserveSeats(List<String> seatNumbers, String flightId) {
        List<Seat> seats = seatRepository.findByFlightId(flightId);
        for (Seat seat : seats) {
            if (seatNumbers.contains(seat.getSeatNumber())) {
                if (!seat.isAvailable()) {
                    return false;
                }
                seat.setAvailable(false);
            }
        }
        seatRepository.saveAll(seats);
        return true;
    }
}