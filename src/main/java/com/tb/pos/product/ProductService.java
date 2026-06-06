package com.tb.pos.product;

import com.tb.pos.inventory.InventoryService;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryService inventoryService;

    public ProductService(ProductRepository productRepository, InventoryService inventoryService) {
        this.productRepository = productRepository;
        this.inventoryService = inventoryService;
    }

    public Flux<ProductDTO> findAll(String q, String category) {
        Flux<Product> products;
        if (q != null && !q.isBlank()) {
            products = productRepository.searchActive(q.trim());
        } else if (category != null && !category.isBlank()) {
            products = productRepository.findActiveByCategory(category);
        } else {
            products = productRepository.findAllActive();
        }
        return products.flatMap(this::toDTO);
    }

    public Flux<String> findCategories() {
        return productRepository.findDistinctCategories();
    }

    public Mono<ProductDTO> findById(UUID id) {
        return productRepository
            .findById(id)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMap(this::toDTO);
    }

    @Transactional
    public Mono<ProductDTO> create(ProductDTO dto) {
        return productRepository
            .existsBySku(dto.getSku())
            .flatMap(exists -> {
                if (exists) return Mono.error(new ResponseStatusException(HttpStatus.CONFLICT, "SKU already exists"));
                Product p = Product.create();
                p.setSku(dto.getSku());
                p.setName(dto.getName());
                p.setCategory(dto.getCategory());
                p.setCostPriceUsd(dto.getCostPriceUsd());
                p.setSellPriceUsd(dto.getSellPriceUsd());
                p.setReorderLevel(dto.getReorderLevel());
                return productRepository
                    .save(p)
                    .flatMap(saved -> inventoryService.initStock(saved.getId()).thenReturn(saved))
                    .flatMap(this::toDTO);
            });
    }

    @Transactional
    public Mono<ProductDTO> update(UUID id, ProductDTO dto) {
        return productRepository
            .findById(id)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMap(p -> {
                p.setName(dto.getName());
                p.setCategory(dto.getCategory());
                p.setCostPriceUsd(dto.getCostPriceUsd());
                p.setSellPriceUsd(dto.getSellPriceUsd());
                p.setReorderLevel(dto.getReorderLevel());
                p.setActive(dto.isActive());
                return productRepository.save(p);
            })
            .flatMap(this::toDTO);
    }

    private Mono<ProductDTO> toDTO(Product p) {
        return inventoryService.getStock(p.getId()).map(item -> new ProductDTO(p, item.getQuantity())).defaultIfEmpty(new ProductDTO(p, 0));
    }
}
