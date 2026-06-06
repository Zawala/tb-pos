package com.tb.pos.sale;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class CreateSaleRequest {

    private UUID customerId;
    private String currency;
    private String paymentMethod;
    private BigDecimal discountUsd = BigDecimal.ZERO;
    private int loyaltyPointsToRedeem;
    private List<LineItemRequest> lineItems;

    public static class LineItemRequest {

        private UUID productId;
        private int quantity;

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
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getDiscountUsd() {
        return discountUsd;
    }

    public void setDiscountUsd(BigDecimal discountUsd) {
        this.discountUsd = discountUsd;
    }

    public int getLoyaltyPointsToRedeem() {
        return loyaltyPointsToRedeem;
    }

    public void setLoyaltyPointsToRedeem(int loyaltyPointsToRedeem) {
        this.loyaltyPointsToRedeem = loyaltyPointsToRedeem;
    }

    public List<LineItemRequest> getLineItems() {
        return lineItems;
    }

    public void setLineItems(List<LineItemRequest> lineItems) {
        this.lineItems = lineItems;
    }
}
