package com.tb.pos.customer;

import java.math.BigDecimal;
import java.util.UUID;

public class CustomerDTO {

    private UUID id;
    private String name;
    private String phone;
    private String email;
    private int loyaltyPoints;
    private BigDecimal totalSpendUsd;

    public CustomerDTO() {}

    public CustomerDTO(Customer c, LoyaltyAccount loyalty) {
        this.id = c.getId();
        this.name = c.getName();
        this.phone = c.getPhone();
        this.email = c.getEmail();
        if (loyalty != null) {
            this.loyaltyPoints = loyalty.getPointsBalance();
            this.totalSpendUsd = loyalty.getTotalSpendUsd();
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public BigDecimal getTotalSpendUsd() {
        return totalSpendUsd;
    }
}
