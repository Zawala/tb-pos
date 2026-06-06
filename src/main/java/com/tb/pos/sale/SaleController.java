package com.tb.pos.sale;

import com.tb.pos.security.SecurityUtils;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<SaleDTO> create(@RequestBody CreateSaleRequest request) {
        return SecurityUtils.getCurrentUserId().defaultIfEmpty(-1L).flatMap(userId -> saleService.createSale(request, userId));
    }

    @GetMapping("/{id}")
    public Mono<SaleDTO> get(@PathVariable UUID id) {
        return saleService.findById(id);
    }
}
