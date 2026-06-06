package com.tb.pos.sale;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class SaleDTO {

    private UUID id;
    private UUID customerId;
    private Long cashierId;
    private String currency;
    private BigDecimal subtotalUsd;
    private BigDecimal discountUsd;
    private BigDecimal taxUsd;
    private BigDecimal totalUsd;
    private BigDecimal totalDisplay;
    private BigDecimal exchangeRate;
    private String paymentMethod;
    private int loyaltyPointsRedeemed;
    private int loyaltyPointsEarned;
    private String status;
    private Instant createdAt;
    private List<SaleLineItem> lineItems;

    public SaleDTO(Sale sale, List<SaleLineItem> lineItems) {
        this.id = sale.getId();
        this.customerId = sale.getCustomerId();
        this.cashierId = sale.getCashierId();
        this.currency = sale.getCurrency();
        this.subtotalUsd = sale.getSubtotalUsd();
        this.discountUsd = sale.getDiscountUsd();
        this.taxUsd = sale.getTaxUsd();
        this.totalUsd = sale.getTotalUsd();
        this.totalDisplay = sale.getTotalDisplay();
        this.exchangeRate = sale.getExchangeRate();
        this.paymentMethod = sale.getPaymentMethod();
        this.loyaltyPointsRedeemed = sale.getLoyaltyPointsRedeemed();
        this.loyaltyPointsEarned = sale.getLoyaltyPointsEarned();
        this.status = sale.getStatus();
        this.createdAt = sale.getCreatedAt();
        this.lineItems = lineItems;
    }

    public UUID getId() {
        return id;
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public Long getCashierId() {
        return cashierId;
    }

    public String getCurrency() {
        return currency;
    }

    public BigDecimal getSubtotalUsd() {
        return subtotalUsd;
    }

    public BigDecimal getDiscountUsd() {
        return discountUsd;
    }

    public BigDecimal getTaxUsd() {
        return taxUsd;
    }

    public BigDecimal getTotalUsd() {
        return totalUsd;
    }

    public BigDecimal getTotalDisplay() {
        return totalDisplay;
    }

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public int getLoyaltyPointsRedeemed() {
        return loyaltyPointsRedeemed;
    }

    public int getLoyaltyPointsEarned() {
        return loyaltyPointsEarned;
    }

    public String getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public List<SaleLineItem> getLineItems() {
        return lineItems;
    }
}
