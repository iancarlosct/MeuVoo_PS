/*
 * ReembolsoService.java
 *
 * Serviço responsável pelo cálculo de reembolso em caso de cancelamento.
 * Utiliza uma hierarquia de políticas de cancelamento (herança e polimorfismo)
 * para determinar o percentual a ser devolvido com base na antecedência do voo.
 */

package com.decolar.sistema_voos.service;

import com.decolar.sistema_voos.policy.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class ReembolsoService {

    /**
     * Determina a política de cancelamento adequada com base na data do voo.
     * POLIMORFISMO: retorna uma referência de CancelPolicy (superclasse), mas a instância
     * concreta varia conforme a regra de negócio.
     */
    public CancelPolicy determinarPolitica(LocalDate dataVoo) {
        LocalDate hoje = LocalDate.now();
        long diasAteVoo = ChronoUnit.DAYS.between(hoje, dataVoo);

        if (dataVoo.isBefore(hoje)) {
            return new VooJaOcorridoPolicy();
        } else if (diasAteVoo >= 7) {
            return new Antecedencia7DiasPolicy();
        } else if (diasAteVoo >= 2) {
            return new Antecedencia2DiasPolicy();
        } else {
            return new Antecedencia0DiasPolicy();
        }
    }

    /**
     * Calcula o valor do reembolso aplicando a política determinada.
     * POLIMORFISMO: chama métodos da superclasse que são executados pela subclasse concreta.
     */
    public ReembolsoResult calcularReembolso(LocalDate dataVoo, BigDecimal valorTotal) {
        CancelPolicy politica = determinarPolitica(dataVoo);
        BigDecimal percentual = politica.getPercentualReembolso();
        BigDecimal valorReembolso = valorTotal.multiply(percentual);
        return new ReembolsoResult(valorReembolso, politica.getDescricao(), percentual);
    }

    /**
     * Classe interna para encapsular o resultado do cálculo de reembolso.
     */
    public static class ReembolsoResult {
        private final BigDecimal valorReembolso;
        private final String descricao;
        private final BigDecimal percentual;

        public ReembolsoResult(BigDecimal valorReembolso, String descricao, BigDecimal percentual) {
            this.valorReembolso = valorReembolso;
            this.descricao = descricao;
            this.percentual = percentual;
        }

        public BigDecimal getValorReembolso() { return valorReembolso; }
        public String getDescricao() { return descricao; }
        public BigDecimal getPercentual() { return percentual; }
    }
}