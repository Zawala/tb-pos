package com.tb.pos.inventory;

import java.util.UUID;

public class StockRequest {

    private UUID productId;
    private StockMovement.MovementType movementType;
    private int quantity;
    private String notes;

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public StockMovement.MovementType getMovementType() {
        return movementType;
    }

    public void setMovementType(StockMovement.MovementType movementType) {
        this.movementType = movementType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
