package com.tb.pos.currency;

import com.tb.pos.security.AuthoritiesConstants;
import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/exchange-rates")
public class ExchangeRateController {

    private final ExchangeRateRepository exchangeRateRepository;

    public ExchangeRateController(ExchangeRateRepository exchangeRateRepository) {
        this.exchangeRateRepository = exchangeRateRepository;
    }

    @GetMapping("/current")
    public Mono<ExchangeRate> current() {
        return exchangeRateRepository
            .findLatest("USD", "ZIG")
            .switchIfEmpty(Mono.just(ExchangeRate.create("USD", "ZIG", java.math.BigDecimal.valueOf(36.0), LocalDate.now())));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.MANAGER + "')")
    public Mono<ExchangeRate> create(@RequestBody ExchangeRateRequest request) {
        ExchangeRate er = ExchangeRate.create(
            request.getFromCurrency(),
            request.getToCurrency(),
            request.getRate(),
            request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now()
        );
        return exchangeRateRepository.save(er);
    }
}
