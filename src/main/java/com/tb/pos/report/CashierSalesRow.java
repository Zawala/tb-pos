package com.tb.pos.report;

import java.math.BigDecimal;

public record CashierSalesRow(Long cashierId, String cashierLogin, Long saleCount, BigDecimal totalUsd) {}
