package com.tb.pos.product;

import java.util.UUID;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ProductRepository extends ReactiveCrudRepository<Product, UUID> {
    Mono<Boolean> existsBySku(String sku);

    Mono<Product> findBySku(String sku);

    @Query("SELECT * FROM products WHERE active = true ORDER BY name")
    Flux<Product> findAllActive();

    @Query(
        "SELECT * FROM products WHERE active = true AND (LOWER(name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(sku) LIKE LOWER(CONCAT('%', :q, '%'))) ORDER BY name"
    )
    Flux<Product> searchActive(String q);

    @Query("SELECT * FROM products WHERE active = true AND category = :category ORDER BY name")
    Flux<Product> findActiveByCategory(String category);

    @Query("SELECT DISTINCT category FROM products WHERE active = true AND category IS NOT NULL ORDER BY category")
    Flux<String> findDistinctCategories();
}
