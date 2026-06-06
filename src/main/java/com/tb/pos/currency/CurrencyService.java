package com.tb.pos.currency;

import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class CurrencyService {

    private static final BigDecimal ONE = BigDecimal.ONE;

    private final ExchangeRateRepository exchangeRateRepository;

    public CurrencyService(ExchangeRateRepository exchangeRateRepository) {
        this.exchangeRateRepository = exchangeRateRepository;
    }

    public Mono<ExchangeRate> getCurrentRate(PosCurrency from, PosCurrency to) {
        return exchangeRateRepository.findLatest(from.name(), to.name());
    }

    public Mono<BigDecimal> convertFromUsd(BigDecimal usdAmount, PosCurrency target) {
        if (target == PosCurrency.USD) {
            return Mono.just(usdAmount.setScale(2, RoundingMode.HALF_UP));
        }
        return getCurrentRate(PosCurrency.USD, target)
            .map(er -> usdAmount.multiply(er.getRate()).setScale(2, RoundingMode.HALF_UP))
            .defaultIfEmpty(usdAmount.setScale(2, RoundingMode.HALF_UP));
    }

    public Mono<BigDecimal> getUsdRate(PosCurrency from) {
        if (from == PosCurrency.USD) return Mono.just(ONE);
        return getCurrentRate(from, PosCurrency.USD).map(ExchangeRate::getRate).defaultIfEmpty(ONE);
    }
}
