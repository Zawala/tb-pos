package com.tb.pos.customer;

import java.util.UUID;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface LoyaltyAccountRepository extends ReactiveCrudRepository<LoyaltyAccount, UUID> {
    Mono<LoyaltyAccount> findByCustomerId(UUID customerId);
}
