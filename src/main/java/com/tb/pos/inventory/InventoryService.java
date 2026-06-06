package com.tb.pos.inventory;

import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository movementRepository;

    public InventoryService(InventoryRepository inventoryRepository, StockMovementRepository movementRepository) {
        this.inventoryRepository = inventoryRepository;
        this.movementRepository = movementRepository;
    }

    public Mono<InventoryItem> getStock(UUID productId) {
        return inventoryRepository.findByProductId(productId);
    }

    @Transactional
    public Mono<InventoryItem> initStock(UUID productId) {
        return inventoryRepository.save(InventoryItem.createFor(productId));
    }

    @Transactional
    public Mono<InventoryItem> adjustStock(
        UUID productId,
        StockMovement.MovementType type,
        int quantity,
        String notes,
        Long userId,
        String productName
    ) {
        return inventoryRepository
            .findByProductId(productId)
            .switchIfEmpty(Mono.defer(() -> inventoryRepository.save(InventoryItem.createFor(productId))))
            .flatMap(item -> {
                int newQty;
                if (type == StockMovement.MovementType.RECEIVE) {
                    newQty = item.getQuantity() + quantity;
                } else if (type == StockMovement.MovementType.ISSUE) {
                    newQty = item.getQuantity() - quantity;
                    if (newQty < 0) {
                        return Mono.error(new InsufficientStockException(productName, item.getQuantity(), quantity));
                    }
                } else {
                    newQty = quantity;
                }
                item.setQuantity(newQty);
                item.setLastUpdated(Instant.now());
                return inventoryRepository
                    .save(item)
                    .flatMap(saved ->
                        movementRepository.save(StockMovement.create(productId, type, quantity, notes, userId)).thenReturn(saved)
                    );
            });
    }
}
