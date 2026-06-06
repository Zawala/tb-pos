package com.tb.pos.report;

import java.math.BigDecimal;

public record SalesSummaryRow(String paymentMethod, Long saleCount, BigDecimal totalUsd, BigDecimal avgBasketUsd) {}
