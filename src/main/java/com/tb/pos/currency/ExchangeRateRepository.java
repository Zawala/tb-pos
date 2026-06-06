package com.tb.pos.currency;

import java.util.UUID;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface ExchangeRateRepository extends ReactiveCrudRepository<ExchangeRate, UUID> {
    @Query(
        "SELECT * FROM exchange_rates WHERE from_currency = :fromCurrency AND to_currency = :toCurrency ORDER BY effective_date DESC LIMIT 1"
    )
    Mono<ExchangeRate> findLatest(String fromCurrency, String toCurrency);
}
