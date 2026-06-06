package com.tb.pos.inventory;

import java.util.UUID;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface InventoryRepository extends ReactiveCrudRepository<InventoryItem, UUID> {
    Mono<InventoryItem> findByProductId(UUID productId);
}
