package com.tb.pos.customer;

import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public Flux<CustomerDTO> search(@RequestParam(required = false) String q) {
        return customerService.search(q);
    }

    @GetMapping("/{id}")
    public Mono<CustomerDTO> get(@PathVariable UUID id) {
        return customerService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<CustomerDTO> create(@RequestBody CustomerDTO dto) {
        return customerService.create(dto);
    }

    @PostMapping("/{id}/redeem")
    public Mono<LoyaltyAccount> redeem(@PathVariable UUID id, @RequestBody Map<String, Integer> body) {
        int points = body.getOrDefault("points", 0);
        return customerService.redeemPoints(id, points);
    }
}
