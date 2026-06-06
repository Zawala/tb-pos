package com.tb.pos.inventory;

import com.tb.pos.product.ProductRepository;
import com.tb.pos.security.SecurityUtils;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    private final InventoryService inventoryService;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    public InventoryController(
        InventoryService inventoryService,
        InventoryRepository inventoryRepository,
        ProductRepository productRepository
    ) {
        this.inventoryService = inventoryService;
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/stock")
    public Flux<InventoryItem> stock() {
        return inventoryRepository.findAll();
    }

    @GetMapping("/stock/{productId}")
    public Mono<InventoryItem> stockByProduct(@PathVariable UUID productId) {
        return inventoryService.getStock(productId).switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

    @PostMapping("/movements")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<InventoryItem> adjust(@RequestBody StockRequest request) {
        return productRepository
            .findById(request.getProductId())
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")))
            .flatMap(product ->
                SecurityUtils.getCurrentUserId()
                    .defaultIfEmpty(-1L)
                    .flatMap(userId ->
                        inventoryService.adjustStock(
                            request.getProductId(),
                            request.getMovementType(),
                            request.getQuantity(),
                            request.getNotes(),
                            userId,
                            product.getName()
                        )
                    )
            );
    }
}
