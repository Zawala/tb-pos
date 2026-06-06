package com.tb.pos.report;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductSalesRow(UUID productId, String productName, Long qtySold, BigDecimal revenueUsd) {}
