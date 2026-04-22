/*
 * CancelPolicy.java
 *
 * Classe abstrata que define o contrato para políticas de cancelamento.
 * Cada subclasse concreta implementa o percentual de reembolso e uma
 * descrição legível da regra aplicada (ex.: "90% de reembolso").
 */

package com.decolar.sistema_voos.policy;

import java.math.BigDecimal;

public abstract class CancelPolicy {

    public abstract BigDecimal getPercentualReembolso();

    public abstract String getDescricao();
}