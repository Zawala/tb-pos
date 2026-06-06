package com.tb.pos.sale;

import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("sale_line_items")
public class SaleLineItem implements Persistable<UUID> {

    @Id
    private UUID id;

    @Column("sale_id")
    private UUID saleId;

    @Column("product_id")
    private UUID productId;

    @Column("product_name")
    private String productName;

    private int quantity;

    @Column("unit_price_usd")
    private BigDecimal unitPriceUsd;

    @Column("line_total_usd")
    private BigDecimal lineTotalUsd;

    @org.springframework.data.annotation.Transient
    private boolean newEntity;

    public static SaleLineItem create(UUID saleId, UUID productId, String productName, int quantity, BigDecimal unitPriceUsd) {
        SaleLineItem item = new SaleLineItem();
        item.id = UUID.randomUUID();
        item.saleId = saleId;
        item.productId = productId;
        item.productName = productName;
        item.quantity = quantity;
        item.unitPriceUsd = unitPriceUsd;
        item.lineTotalUsd = unitPriceUsd.multiply(BigDecimal.valueOf(quantity));
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

    public UUID getSaleId() {
        return saleId;
    }

    public UUID getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPriceUsd() {
        return unitPriceUsd;
    }

    public BigDecimal getLineTotalUsd() {
        return lineTotalUsd;
    }
}
