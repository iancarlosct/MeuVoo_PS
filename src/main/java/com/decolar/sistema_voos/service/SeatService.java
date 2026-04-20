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

    public List<Seat> getSeatsByFlight(String flightId) {
        return seatRepository.findByFlightId(flightId);
    }

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