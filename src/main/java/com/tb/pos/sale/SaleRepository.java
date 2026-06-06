package com.tb.pos.sale;

import java.time.Instant;
import java.util.UUID;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface SaleRepository extends ReactiveCrudRepository<Sale, UUID> {
    @Query("SELECT * FROM sales WHERE created_at >= :from AND created_at <= :to ORDER BY created_at DESC")
    Flux<Sale> findByDateRange(Instant from, Instant to);

    @Query("SELECT * FROM sales WHERE cashier_id = :cashierId ORDER BY created_at DESC LIMIT 50")
    Flux<Sale> findByCashier(Long cashierId);
}
