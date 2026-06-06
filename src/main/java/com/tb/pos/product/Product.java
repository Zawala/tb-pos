package com.tb.pos.product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("products")
public class Product implements Persistable<UUID> {

    @Id
    private UUID id;

    private String sku;

    private String name;

    private String category;

    @Column("cost_price_usd")
    private BigDecimal costPriceUsd;

    @Column("sell_price_usd")
    private BigDecimal sellPriceUsd;

    @Column("reorder_level")
    private int reorderLevel = 5;

    private boolean active = true;

    @Column("created_at")
    private Instant createdAt;

    @org.springframework.data.annotation.Transient
    private boolean newEntity;

    public static Product create() {
        Product p = new Product();
        p.id = UUID.randomUUID();
        p.createdAt = Instant.now();
        p.newEntity = true;
        return p;
    }

    @Override
    public boolean isNew() {
        return newEntity;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
