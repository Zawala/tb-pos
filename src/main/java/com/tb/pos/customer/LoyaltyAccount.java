package com.tb.pos.customer;

import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("loyalty_accounts")
public class LoyaltyAccount implements Persistable<UUID> {

    @Id
    private UUID id;

    @Column("customer_id")
    private UUID customerId;

    @Column("points_balance")
    private int pointsBalance;

    @Column("total_spend_usd")
    private BigDecimal totalSpendUsd = BigDecimal.ZERO;

    @org.springframework.data.annotation.Transient
    private boolean newEntity;

    public static LoyaltyAccount createFor(UUID customerId) {
        LoyaltyAccount a = new LoyaltyAccount();
        a.id = UUID.randomUUID();
        a.customerId = customerId;
        a.pointsBalance = 0;
        a.totalSpendUsd = BigDecimal.ZERO;
        a.newEntity = true;
        return a;
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

    public int getPointsBalance() {
        return pointsBalance;
    }

    public void setPointsBalance(int pointsBalance) {
        this.pointsBalance = pointsBalance;
    }

    public BigDecimal getTotalSpendUsd() {
        return totalSpendUsd;
    }

    public void setTotalSpendUsd(BigDecimal totalSpendUsd) {
        this.totalSpendUsd = totalSpendUsd;
    }
}
