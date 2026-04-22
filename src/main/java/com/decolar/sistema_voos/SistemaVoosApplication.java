package com.decolar.sistema_voos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.IOException;
import java.net.URI;

@SpringBootApplication
public class SistemaVoosApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaVoosApplication.class, args);
    }

    /**
     * Componente interno que escuta o evento de aplicação pronta (ApplicationReadyEvent)
     * e abre automaticamente o navegador do sistema na URL da aplicação.
     */
    @Component
    public static class BrowserLauncher {

        private final Environment environment;

        public BrowserLauncher(Environment environment) {
            this.environment = environment;
        }

        @EventListener(ApplicationReadyEvent.class)
        public void openBrowser() {
            String port = environment.getProperty("server.port", "8080");
            String url = "http://localhost:" + port;

            System.out.println("🚀 Aplicação iniciada! Tentando abrir o navegador em: " + url);

            // Tenta abrir o navegador de forma compatível com Windows, Linux e Mac
            try {
                if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                    Desktop.getDesktop().browse(new URI(url));
                } else {
                    // Fallback para comandos do sistema operacional
                    String os = System.getProperty("os.name").toLowerCase();
                    Runtime runtime = Runtime.getRuntime();
                    if (os.contains("win")) {
                        runtime.exec("rundll32 url.dll,FileProtocolHandler " + url);
                    } else if (os.contains("mac")) {
                        runtime.exec("open " + url);
                    } else if (os.contains("nix") || os.contains("nux")) {
                        runtime.exec("xdg-open " + url);
                    } else {
                        System.err.println("Não foi possível abrir o navegador automaticamente.");
                        System.out.println("Por favor, acesse manualmente: " + url);
                    }
                }
            } catch (IOException | java.net.URISyntaxException e) {
                System.err.println("Falha ao abrir o navegador automaticamente: " + e.getMessage());
                System.out.println("Por favor, acesse manualmente: " + url);
            }
        }
    }
}