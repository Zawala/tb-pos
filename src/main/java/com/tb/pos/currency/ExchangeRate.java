package com.tb.pos.currency;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("exchange_rates")
public class ExchangeRate implements Persistable<UUID> {

    @Id
    private UUID id;

    @Column("from_currency")
    private String fromCurrency;

    @Column("to_currency")
    private String toCurrency;

    private BigDecimal rate;

    @Column("effective_date")
    private LocalDate effectiveDate;

    @Column("created_at")
    private Instant createdAt;

    @org.springframework.data.annotation.Transient
    private boolean newEntity;

    public static ExchangeRate create(String from, String to, BigDecimal rate, LocalDate effectiveDate) {
        ExchangeRate er = new ExchangeRate();
        er.id = UUID.randomUUID();
        er.fromCurrency = from;
        er.toCurrency = to;
        er.rate = rate;
        er.effectiveDate = effectiveDate;
        er.createdAt = Instant.now();
        er.newEntity = true;
        return er;
    }

    @Override
    public boolean isNew() {
        return newEntity;
    }

    public UUID getId() {
        return id;
    }

    public String getFromCurrency() {
        return fromCurrency;
    }

    public String getToCurrency() {
        return toCurrency;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
