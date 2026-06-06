package com.tb.pos.sale;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("sales")
public class Sale implements Persistable<UUID> {

    @Id
    private UUID id;

    @Column("customer_id")
    private UUID customerId;

    @Column("cashier_id")
    private Long cashierId;

    private String currency;

    @Column("subtotal_usd")
    private BigDecimal subtotalUsd;

    @Column("discount_usd")
    private BigDecimal discountUsd = BigDecimal.ZERO;

    @Column("tax_usd")
    private BigDecimal taxUsd = BigDecimal.ZERO;

    @Column("total_usd")
    private BigDecimal totalUsd;

    @Column("total_display")
    private BigDecimal totalDisplay;

    @Column("exchange_rate")
    private BigDecimal exchangeRate;

    @Column("payment_method")
    private String paymentMethod;

    @Column("loyalty_points_redeemed")
    private int loyaltyPointsRedeemed;

    @Column("loyalty_points_earned")
    private int loyaltyPointsEarned;

    private String status = "COMPLETED";

    @Column("created_at")
    private Instant createdAt;

    @org.springframework.data.annotation.Transient
    private boolean newEntity;

    public static Sale create() {
        Sale s = new Sale();
        s.id = UUID.randomUUID();
        s.createdAt = Instant.now();
        s.newEntity = true;
        return s;
    }

    @Override
    public boolean isNew() {
        return newEntity;
    }

    public UUID getId() {
        return id;
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

    public Long getCashierId() {
        return cashierId;
    }

    public void setCashierId(Long cashierId) {
        this.cashierId = cashierId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getSubtotalUsd() {
        return subtotalUsd;
    }

    public void setSubtotalUsd(BigDecimal subtotalUsd) {
        this.subtotalUsd = subtotalUsd;
    }

    public BigDecimal getDiscountUsd() {
        return discountUsd;
    }

    public void setDiscountUsd(BigDecimal discountUsd) {
        this.discountUsd = discountUsd;
    }

    public BigDecimal getTaxUsd() {
        return taxUsd;
    }

    public void setTaxUsd(BigDecimal taxUsd) {
        this.taxUsd = taxUsd;
    }

    public BigDecimal getTotalUsd() {
        return totalUsd;
    }

    public void setTotalUsd(BigDecimal totalUsd) {
        this.totalUsd = totalUsd;
    }

    public BigDecimal getTotalDisplay() {
        return totalDisplay;
    }

    public void setTotalDisplay(BigDecimal totalDisplay) {
        this.totalDisplay = totalDisplay;
    }

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public int getLoyaltyPointsRedeemed() {
        return loyaltyPointsRedeemed;
    }

    public void setLoyaltyPointsRedeemed(int loyaltyPointsRedeemed) {
        this.loyaltyPointsRedeemed = loyaltyPointsRedeemed;
    }

    public int getLoyaltyPointsEarned() {
        return loyaltyPointsEarned;
    }

    public void setLoyaltyPointsEarned(int loyaltyPointsEarned) {
        this.loyaltyPointsEarned = loyaltyPointsEarned;
    }

    public String getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
