package com.tb.pos.report;

import java.math.BigDecimal;
import java.util.UUID;

public record InventoryValueRow(
    UUID id,
    String sku,
    String name,
    String category,
    BigDecimal costPriceUsd,
    Integer quantity,
    BigDecimal totalValueUsd
) {}
