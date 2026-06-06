package com.tb.pos.inventory;

import java.util.UUID;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface StockMovementRepository extends ReactiveCrudRepository<StockMovement, UUID> {
    @Query("SELECT * FROM stock_movements WHERE product_id = :productId ORDER BY created_at DESC LIMIT 50")
    Flux<StockMovement> findRecentByProduct(UUID productId);
}
