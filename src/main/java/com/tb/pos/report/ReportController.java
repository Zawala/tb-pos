package com.tb.pos.report;

import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/sales-summary")
    public Flux<SalesSummaryRow> salesSummary(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return reportService.getSalesSummary(from, to);
    }

    @GetMapping("/sales-by-product")
    public Flux<ProductSalesRow> salesByProduct(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return reportService.getSalesByProduct(from, to);
    }

    @GetMapping("/sales-by-cashier")
    public Flux<CashierSalesRow> salesByCashier(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return reportService.getSalesByCashier(from, to);
    }

    @GetMapping("/inventory-value")
    public Flux<InventoryValueRow> inventoryValue() {
        return reportService.getInventoryValue();
    }

    @GetMapping("/low-stock")
    public Flux<LowStockRow> lowStock() {
        return reportService.getLowStock();
    }

    @GetMapping("/loyalty-summary")
    public Flux<LoyaltySummaryRow> loyaltySummary() {
        return reportService.getLoyaltySummary();
    }
}
