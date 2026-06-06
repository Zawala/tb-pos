package com.tb.pos.report;

import java.math.BigDecimal;
import java.util.UUID;

public record LoyaltySummaryRow(UUID id, String name, String phone, Integer pointsBalance, BigDecimal totalSpendUsd) {}
