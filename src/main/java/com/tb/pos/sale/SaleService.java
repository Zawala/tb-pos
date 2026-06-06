package com.tb.pos.sale;

import com.tb.pos.currency.CurrencyService;
import com.tb.pos.currency.PosCurrency;
import com.tb.pos.customer.CustomerService;
import com.tb.pos.inventory.InventoryService;
import com.tb.pos.inventory.StockMovement;
import com.tb.pos.product.ProductRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleLineItemRepository lineItemRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;
    private final CurrencyService currencyService;
    private final CustomerService customerService;

    public SaleService(
        SaleRepository saleRepository,
        SaleLineItemRepository lineItemRepository,
        ProductRepository productRepository,
        InventoryService inventoryService,
        CurrencyService currencyService,
        CustomerService customerService
    ) {
        this.saleRepository = saleRepository;
        this.lineItemRepository = lineItemRepository;
        this.productRepository = productRepository;
        this.inventoryService = inventoryService;
        this.currencyService = currencyService;
        this.customerService = customerService;
    }

    public Mono<SaleDTO> findById(UUID id) {
        return saleRepository
            .findById(id)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMap(sale -> lineItemRepository.findBySaleId(id).collectList().map(items -> new SaleDTO(sale, items)));
    }

    @Transactional
    public Mono<SaleDTO> createSale(CreateSaleRequest req, Long cashierId) {
        if (req.getLineItems() == null || req.getLineItems().isEmpty()) {
            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "No line items"));
        }

        PosCurrency currency;
        try {
            currency = PosCurrency.valueOf(req.getCurrency() != null ? req.getCurrency().toUpperCase() : "USD");
        } catch (IllegalArgumentException e) {
            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid currency"));
        }

        return Flux.fromIterable(req.getLineItems())
            .flatMap(lineReq ->
                productRepository
                    .findById(lineReq.getProductId())
                    .switchIfEmpty(
                        Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + lineReq.getProductId()))
                    )
                    .map(product -> new Object[] { product, lineReq.getQuantity() })
            )
            .collectList()
            .flatMap(productQtyPairs -> {
                BigDecimal subtotal = productQtyPairs
                    .stream()
                    .map(pair -> {
                        com.tb.pos.product.Product p = (com.tb.pos.product.Product) pair[0];
                        int qty = (int) pair[1];
                        return p.getSellPriceUsd().multiply(BigDecimal.valueOf(qty));
                    })
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal discount = req.getDiscountUsd() != null ? req.getDiscountUsd() : BigDecimal.ZERO;
                BigDecimal loyaltyDiscount = BigDecimal.valueOf(req.getLoyaltyPointsToRedeem()).divide(
                    BigDecimal.valueOf(100),
                    4,
                    RoundingMode.HALF_UP
                );
                BigDecimal totalUsd = subtotal.subtract(discount).subtract(loyaltyDiscount).max(BigDecimal.ZERO);

                return currencyService
                    .convertFromUsd(totalUsd, currency)
                    .flatMap(totalDisplay -> {
                        Sale sale = Sale.create();
                        sale.setCashierId(cashierId);
                        sale.setCurrency(currency.name());
                        sale.setSubtotalUsd(subtotal.setScale(4, RoundingMode.HALF_UP));
                        sale.setDiscountUsd(discount.add(loyaltyDiscount).setScale(4, RoundingMode.HALF_UP));
                        sale.setTaxUsd(BigDecimal.ZERO);
                        sale.setTotalUsd(totalUsd.setScale(4, RoundingMode.HALF_UP));
                        sale.setTotalDisplay(totalDisplay);
                        sale.setPaymentMethod(req.getPaymentMethod());
                        sale.setLoyaltyPointsRedeemed(req.getLoyaltyPointsToRedeem());
                        int pointsEarned = totalUsd.setScale(0, RoundingMode.FLOOR).intValue();
                        sale.setLoyaltyPointsEarned(pointsEarned);
                        if (req.getCustomerId() != null) sale.setCustomerId(req.getCustomerId());

                        return currencyService
                            .getCurrentRate(PosCurrency.USD, currency)
                            .map(er -> {
                                sale.setExchangeRate(er.getRate());
                                return sale;
                            })
                            .defaultIfEmpty(sale)
                            .flatMap(saleRepository::save)
                            .flatMap(savedSale -> {
                                List<Mono<Void>> ops = new java.util.ArrayList<>();

                                for (Object[] pair : productQtyPairs) {
                                    com.tb.pos.product.Product p = (com.tb.pos.product.Product) pair[0];
                                    int qty = (int) pair[1];
                                    SaleLineItem item = SaleLineItem.create(
                                        savedSale.getId(),
                                        p.getId(),
                                        p.getName(),
                                        qty,
                                        p.getSellPriceUsd()
                                    );
                                    ops.add(lineItemRepository.save(item).then());
                                    ops.add(
                                        inventoryService
                                            .adjustStock(
                                                p.getId(),
                                                StockMovement.MovementType.ISSUE,
                                                qty,
                                                "Sale " + savedSale.getId(),
                                                cashierId,
                                                p.getName()
                                            )
                                            .then()
                                    );
                                }

                                if (req.getLoyaltyPointsToRedeem() > 0 && req.getCustomerId() != null) {
                                    ops.add(customerService.redeemPoints(req.getCustomerId(), req.getLoyaltyPointsToRedeem()).then());
                                }
                                if (req.getCustomerId() != null && pointsEarned > 0) {
                                    ops.add(customerService.awardPoints(req.getCustomerId(), totalUsd).then());
                                }

                                return Flux.merge(ops).then(
                                    lineItemRepository
                                        .findBySaleId(savedSale.getId())
                                        .collectList()
                                        .map(items -> new SaleDTO(savedSale, items))
                                );
                            });
                    });
            });
    }
}
