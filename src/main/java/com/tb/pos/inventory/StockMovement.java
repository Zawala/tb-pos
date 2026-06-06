package com.tb.pos.inventory;

import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("stock_movements")
public class StockMovement implements Persistable<UUID> {

    public enum MovementType {
        RECEIVE,
        ISSUE,
        ADJUSTMENT,
    }

    @Id
    private UUID id;

    @Column("product_id")
    private UUID productId;

    @Column("movement_type")
    private String movementType;

    private int quantity;

    private String notes;

    @Column("created_by")
    private Long createdBy;

    @Column("created_at")
    private Instant createdAt;

    @org.springframework.data.annotation.Transient
    private boolean newEntity;

    public static StockMovement create(UUID productId, MovementType type, int quantity, String notes, Long createdBy) {
        StockMovement m = new StockMovement();
        m.id = UUID.randomUUID();
        m.productId = productId;
        m.movementType = type.name();
        m.quantity = quantity;
        m.notes = notes;
        m.createdBy = createdBy;
        m.createdAt = Instant.now();
        m.newEntity = true;
        return m;
    }

    @Override
    public boolean isNew() {
        return newEntity;
    }

    public UUID getId() {
        return id;
    }

    public UUID getProductId() {
        return productId;
    }

    public String getMovementType() {
        return movementType;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getNotes() {
        return notes;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
