package com.tb.pos.customer;

import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("customers")
public class Customer implements Persistable<UUID> {

    @Id
    private UUID id;

    private String name;

    private String phone;

    private String email;

    @Column("created_at")
    private Instant createdAt;

    @org.springframework.data.annotation.Transient
    private boolean newEntity;

    public static Customer create() {
        Customer c = new Customer();
        c.id = UUID.randomUUID();
        c.createdAt = Instant.now();
        c.newEntity = true;
        return c;
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

    public Instant getCreatedAt() {
        return createdAt;
    }
}
