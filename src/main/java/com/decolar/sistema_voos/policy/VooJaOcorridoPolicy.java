/*
 * VooJaOcorridoPolicy.java
 *
 * Política de cancelamento aplicada quando a data do voo já passou.
 * Nenhum valor é reembolsado.
 */

package com.decolar.sistema_voos.policy;

import java.math.BigDecimal;

public class VooJaOcorridoPolicy extends CancelPolicy {

    @Override
    public BigDecimal getPercentualReembolso() {
        return BigDecimal.ZERO;
    }

    @Override
    public String getDescricao() {
        return "O voo já ocorreu. Não há reembolso.";
    }
}