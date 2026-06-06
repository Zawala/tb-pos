package com.tb.pos.inventory;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InsufficientStockException extends ResponseStatusException {

    public InsufficientStockException(String productName, int available, int requested) {
        super(HttpStatus.CONFLICT, "Insufficient stock for '" + productName + "': available=" + available + ", requested=" + requested);
    }
}
