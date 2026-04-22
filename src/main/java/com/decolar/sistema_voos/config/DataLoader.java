/*
 * DataLoader.java
 *
 * Componente responsável por popular o banco de dados H2 com dados de exemplo
 * (voos e assentos) assim que a aplicação Spring Boot é iniciada, garantindo
 * que o sistema já possua conteúdo para testes e demonstração.
 */

package com.decolar.sistema_voos.config;

import com.decolar.sistema_voos.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private FlightService flightService;

    /**
     * Popula o banco de dados com voos de exemplo ao iniciar a aplicação.
     */
    @Override
    public void run(String... args) throws Exception {
        flightService.populateSampleData();
    }
}