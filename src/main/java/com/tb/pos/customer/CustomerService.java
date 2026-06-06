package com.tb.pos.customer;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final LoyaltyAccountRepository loyaltyAccountRepository;

    public CustomerService(CustomerRepository customerRepository, LoyaltyAccountRepository loyaltyAccountRepository) {
        this.customerRepository = customerRepository;
        this.loyaltyAccountRepository = loyaltyAccountRepository;
    }

    public Flux<CustomerDTO> search(String q) {
        if (q == null || q.isBlank()) {
            return customerRepository.findAll().flatMap(this::toDTO);
        }
        return customerRepository.search(q.trim()).flatMap(this::toDTO);
    }

    public Mono<CustomerDTO> findById(UUID id) {
        return customerRepository
            .findById(id)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMap(this::toDTO);
    }

    @Transactional
    public Mono<CustomerDTO> create(CustomerDTO dto) {
        Customer c = Customer.create();
        c.setName(dto.getName());
        c.setPhone(dto.getPhone());
        c.setEmail(dto.getEmail());
        return customerRepository
            .save(c)
            .flatMap(saved -> loyaltyAccountRepository.save(LoyaltyAccount.createFor(saved.getId())).thenReturn(saved))
            .flatMap(this::toDTO);
    }

    @Transactional
    public Mono<LoyaltyAccount> redeemPoints(UUID customerId, int points) {
        return loyaltyAccountRepository
            .findByCustomerId(customerId)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "No loyalty account")))
            .flatMap(account -> {
                if (account.getPointsBalance() < points) {
                    return Mono.error(new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient points"));
                }
                account.setPointsBalance(account.getPointsBalance() - points);
                return loyaltyAccountRepository.save(account);
            });
    }

    @Transactional
    public Mono<LoyaltyAccount> awardPoints(UUID customerId, BigDecimal usdAmount) {
        int pointsToAdd = usdAmount.setScale(0, RoundingMode.FLOOR).intValue();
        return loyaltyAccountRepository
            .findByCustomerId(customerId)
            .switchIfEmpty(Mono.defer(() -> loyaltyAccountRepository.save(LoyaltyAccount.createFor(customerId))))
            .flatMap(account -> {
                account.setPointsBalance(account.getPointsBalance() + pointsToAdd);
                account.setTotalSpendUsd(account.getTotalSpendUsd().add(usdAmount));
                return loyaltyAccountRepository.save(account);
            });
    }

    private Mono<CustomerDTO> toDTO(Customer c) {
        return loyaltyAccountRepository
            .findByCustomerId(c.getId())
            .map(loyalty -> new CustomerDTO(c, loyalty))
            .defaultIfEmpty(new CustomerDTO(c, null));
    }
}
