package com.tb.pos.product;

import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Flux<ProductDTO> list(@RequestParam(required = false) String q, @RequestParam(required = false) String category) {
        return productService.findAll(q, category);
    }

    @GetMapping("/categories")
    public Flux<String> categories() {
        return productService.findCategories();
    }

    @GetMapping("/{id}")
    public Mono<ProductDTO> get(@PathVariable UUID id) {
        return productService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ProductDTO> create(@RequestBody ProductDTO dto) {
        return productService.create(dto);
    }

    @PutMapping("/{id}")
    public Mono<ProductDTO> update(@PathVariable UUID id, @RequestBody ProductDTO dto) {
        return productService.update(id, dto);
    }
}
