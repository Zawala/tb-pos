package com.tb.pos.sale;

import java.util.UUID;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface SaleLineItemRepository extends ReactiveCrudRepository<SaleLineItem, UUID> {
    Flux<SaleLineItem> findBySaleId(UUID saleId);
}
