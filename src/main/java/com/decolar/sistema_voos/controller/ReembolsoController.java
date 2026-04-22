/*
 * ReembolsoController.java
 *
 * Controller responsável pelo cálculo de reembolso em caso de cancelamento.
 * Utiliza uma hierarquia de políticas de cancelamento (herança e polimorfismo)
 * para determinar o percentual a ser devolvido com base na antecedência do voo.
 */

package com.decolar.sistema_voos.controller;

import com.decolar.sistema_voos.service.ReembolsoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/reembolso")
@CrossOrigin(origins = "*")
public class ReembolsoController {

    @Autowired
    private ReembolsoService reembolsoService;

    /**
     * Calcula o valor do reembolso com base na data do voo e no valor total pago.
     * O percentual aplicado segue a política de cancelamento vigente (polimorfismo).
     */
    @GetMapping("/calcular")
    public ResponseEntity<ReembolsoResponse> calcular(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataVoo,
            @RequestParam BigDecimal valorTotal) {

        ReembolsoService.ReembolsoResult result = reembolsoService.calcularReembolso(dataVoo, valorTotal);
        ReembolsoResponse response = new ReembolsoResponse(
                result.getValorReembolso(),
                result.getDescricao(),
                result.getPercentual()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * DTO interno para encapsular a resposta do cálculo de reembolso.
     */
    static class ReembolsoResponse {
        private BigDecimal valorReembolso;
        private String descricao;
        private BigDecimal percentual;

        public ReembolsoResponse(BigDecimal valorReembolso, String descricao, BigDecimal percentual) {
            this.valorReembolso = valorReembolso;
            this.descricao = descricao;
            this.percentual = percentual;
        }

        public BigDecimal getValorReembolso() { return valorReembolso; }
        public String getDescricao() { return descricao; }
        public BigDecimal getPercentual() { return percentual; }
    }
}