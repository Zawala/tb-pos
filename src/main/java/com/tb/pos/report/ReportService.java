package com.tb.pos.report;

import java.time.LocalDate;
import java.time.ZoneOffset;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ReportService {

    private final DatabaseClient db;

    public ReportService(DatabaseClient db) {
        this.db = db;
    }

    public Flux<SalesSummaryRow> getSalesSummary(LocalDate from, LocalDate to) {
        return db
            .sql(
                """
                SELECT payment_method,
                       COUNT(*) AS sale_count,
                       SUM(total_usd) AS total_usd,
                       AVG(total_usd) AS avg_basket_usd
                FROM sales
                WHERE created_at >= :from AND created_at <= :to
                  AND status = 'COMPLETED'
                GROUP BY payment_method
                ORDER BY total_usd DESC
                """
            )
            .bind("from", from.atStartOfDay().toInstant(ZoneOffset.UTC))
            .bind("to", to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC))
            .map((row, meta) ->
                new SalesSummaryRow(
                    row.get("payment_method", String.class),
                    row.get("sale_count", Long.class),
                    row.get("total_usd", java.math.BigDecimal.class),
                    row.get("avg_basket_usd", java.math.BigDecimal.class)
                )
            )
            .all();
    }

    public Flux<ProductSalesRow> getSalesByProduct(LocalDate from, LocalDate to) {
        return db
            .sql(
                """
                SELECT li.product_id, li.product_name,
                       SUM(li.quantity) AS qty_sold,
                       SUM(li.line_total_usd) AS revenue_usd
                FROM sale_line_items li
                JOIN sales s ON s.id = li.sale_id
                WHERE s.created_at >= :from AND s.created_at <= :to
                  AND s.status = 'COMPLETED'
                GROUP BY li.product_id, li.product_name
                ORDER BY revenue_usd DESC
                """
            )
            .bind("from", from.atStartOfDay().toInstant(ZoneOffset.UTC))
            .bind("to", to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC))
            .map((row, meta) ->
                new ProductSalesRow(
                    row.get("product_id", java.util.UUID.class),
                    row.get("product_name", String.class),
                    row.get("qty_sold", Long.class),
                    row.get("revenue_usd", java.math.BigDecimal.class)
                )
            )
            .all();
    }

    public Flux<CashierSalesRow> getSalesByCashier(LocalDate from, LocalDate to) {
        return db
            .sql(
                """
                SELECT s.cashier_id, u.login AS cashier_login,
                       COUNT(*) AS sale_count,
                       SUM(s.total_usd) AS total_usd
                FROM sales s
                LEFT JOIN jhi_user u ON u.id = s.cashier_id
                WHERE s.created_at >= :from AND s.created_at <= :to
                  AND s.status = 'COMPLETED'
                GROUP BY s.cashier_id, u.login
                ORDER BY total_usd DESC
                """
            )
            .bind("from", from.atStartOfDay().toInstant(ZoneOffset.UTC))
            .bind("to", to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC))
            .map((row, meta) ->
                new CashierSalesRow(
                    row.get("cashier_id", Long.class),
                    row.get("cashier_login", String.class),
                    row.get("sale_count", Long.class),
                    row.get("total_usd", java.math.BigDecimal.class)
                )
            )
            .all();
    }

    public Flux<InventoryValueRow> getInventoryValue() {
        return db
            .sql(
                """
                SELECT p.id, p.sku, p.name, p.category,
                       p.cost_price_usd, i.quantity,
                       p.cost_price_usd * i.quantity AS total_value_usd
                FROM products p
                JOIN inventory_items i ON i.product_id = p.id
                WHERE p.active = true
                ORDER BY total_value_usd DESC
                """
            )
            .map((row, meta) ->
                new InventoryValueRow(
                    row.get("id", java.util.UUID.class),
                    row.get("sku", String.class),
                    row.get("name", String.class),
                    row.get("category", String.class),
                    row.get("cost_price_usd", java.math.BigDecimal.class),
                    row.get("quantity", Integer.class),
                    row.get("total_value_usd", java.math.BigDecimal.class)
                )
            )
            .all();
    }

    public Flux<LowStockRow> getLowStock() {
        return db
            .sql(
                """
                SELECT p.id, p.sku, p.name, p.category,
                       i.quantity, p.reorder_level
                FROM products p
                JOIN inventory_items i ON i.product_id = p.id
                WHERE p.active = true AND i.quantity <= p.reorder_level
                ORDER BY i.quantity ASC
                """
            )
            .map((row, meta) ->
                new LowStockRow(
                    row.get("id", java.util.UUID.class),
                    row.get("sku", String.class),
                    row.get("name", String.class),
                    row.get("category", String.class),
                    row.get("quantity", Integer.class),
                    row.get("reorder_level", Integer.class)
                )
            )
            .all();
    }

    public Flux<LoyaltySummaryRow> getLoyaltySummary() {
        return db
            .sql(
                """
                SELECT c.id, c.name, c.phone,
                       la.points_balance, la.total_spend_usd
                FROM customers c
                JOIN loyalty_accounts la ON la.customer_id = c.id
                ORDER BY la.total_spend_usd DESC
                LIMIT 100
                """
            )
            .map((row, meta) ->
                new LoyaltySummaryRow(
                    row.get("id", java.util.UUID.class),
                    row.get("name", String.class),
                    row.get("phone", String.class),
                    row.get("points_balance", Integer.class),
                    row.get("total_spend_usd", java.math.BigDecimal.class)
                )
            )
            .all();
    }
}
