import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export interface SaleLineItem {
  productId?: string;
  productName: string;
  quantity: number;
  unitPriceUsd?: number;
  lineTotalUsd: number;
}

export interface Sale {
  id: string;
  customerId: string | null;
  currency: string;
  subtotalUsd: number;
  discountUsd: number;
  taxUsd: number;
  totalUsd: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  lineItems: SaleLineItem[];
}

export const useSalesStore = defineStore('sales', () => {
  // Backend currently exposes only POST /api/v1/sales and GET /{id} — no list
  // endpoint — so `orders` is primarily this session's completed sales, recorded
  // at checkout. fetchOrders() will populate from the API if a list route exists.
  const orders = ref<Sale[]>([]);

  function recordSale(sale: Sale) {
    if (sale && sale.id) orders.value.unshift(sale);
  }

  async function fetchOrders() {
    try {
      const res = await axios.get('/api/v1/sales');
      if (Array.isArray(res.data)) orders.value = res.data;
    } catch {
      // No list endpoint — keep the session-recorded sales.
    }
  }

  return { orders, recordSale, fetchOrders };
});
