package com.tb.pos.report;

import java.util.UUID;

public record LowStockRow(UUID id, String sku, String name, String category, Integer quantity, Integer reorderLevel) {}
