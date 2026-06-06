package com.tb.pos.product;

import java.math.BigDecimal;
import java.util.UUID;

public class ProductDTO {

    private UUID id;
    private String sku;
    private String name;
    private String category;
    private BigDecimal costPriceUsd;
    private BigDecimal sellPriceUsd;
    private int reorderLevel;
    private boolean active;
    private int stockQuantity;

    public ProductDTO() {}

    public ProductDTO(Product p, int stockQuantity) {
        this.id = p.getId();
        this.sku = p.getSku();
        this.name = p.getName();
        this.category = p.getCategory();
        this.costPriceUsd = p.getCostPriceUsd();
        this.sellPriceUsd = p.getSellPriceUsd();
        this.reorderLevel = p.getReorderLevel();
        this.active = p.isActive();
        this.stockQuantity = stockQuantity;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getCostPriceUsd() {
        return costPriceUsd;
    }

    public void setCostPriceUsd(BigDecimal costPriceUsd) {
        this.costPriceUsd = costPriceUsd;
    }

    public BigDecimal getSellPriceUsd() {
        return sellPriceUsd;
    }

    public void setSellPriceUsd(BigDecimal sellPriceUsd) {
        this.sellPriceUsd = sellPriceUsd;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(int reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}
