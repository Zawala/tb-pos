package com.tb.pos.customer;

import java.util.UUID;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface CustomerRepository extends ReactiveCrudRepository<Customer, UUID> {
    @Query(
        "SELECT * FROM customers WHERE LOWER(name) LIKE LOWER(CONCAT('%', :q, '%')) OR phone LIKE CONCAT('%', :q, '%') ORDER BY name LIMIT 20"
    )
    Flux<Customer> search(String q);
}
