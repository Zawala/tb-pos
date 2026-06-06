package com.tb.pos.inventory;

import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("inventory_items")
public class InventoryItem implements Persistable<UUID> {

    @Id
    private UUID id;

    @Column("product_id")
    private UUID productId;

    private int quantity;

    @Column("last_updated")
    private Instant lastUpdated;

    @org.springframework.data.annotation.Transient
    private boolean newEntity;

    public static InventoryItem createFor(UUID productId) {
        InventoryItem item = new InventoryItem();
        item.id = UUID.randomUUID();
        item.productId = productId;
        item.quantity = 0;
        item.lastUpdated = Instant.now();
        item.newEntity = true;
        return item;
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

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
