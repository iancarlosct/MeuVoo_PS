package com.decolar.sistema_voos.config;

import com.decolar.sistema_voos.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private FlightService flightService;

    @Override
    public void run(String... args) throws Exception {
        flightService.populateSampleData();
    }
}