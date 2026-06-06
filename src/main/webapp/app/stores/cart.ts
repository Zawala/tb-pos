import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product } from './inventory';
import type { Customer } from './customers';

export interface CartItem {
  product: Product;
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const customer = ref<Customer | null>(null);
  const discountPct = ref(0);
  const loyaltyPointsToRedeem = ref(0);
  const currency = ref<'USD' | 'ZIG'>('USD');
  // Display-only tax rate (backend computes the authoritative total). Default 0
  // so the charged amount matches the cart total until configured in Settings.
  const taxRate = ref(0);

  const subtotalUsd = computed(() => items.value.reduce((sum, item) => sum + item.product.sellPriceUsd * item.quantity, 0));

  const discountUsd = computed(() => subtotalUsd.value * (discountPct.value / 100));
  const loyaltyDiscountUsd = computed(() => loyaltyPointsToRedeem.value / 100);

  const taxableUsd = computed(() => Math.max(0, subtotalUsd.value - discountUsd.value - loyaltyDiscountUsd.value));
  const taxUsd = computed(() => taxableUsd.value * taxRate.value);

  const totalUsd = computed(() => taxableUsd.value + taxUsd.value);

  const count = computed(() => items.value.reduce((s, l) => s + l.quantity, 0));

  function addItem(product: Product) {
    if (product.stockQuantity === 0) return;
    const existing = items.value.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ product, quantity: 1 });
    }
  }

  function removeItem(productId: string) {
    items.value = items.value.filter(i => i.product.id !== productId);
  }

  function setQuantity(productId: string, qty: number) {
    const item = items.value.find(i => i.product.id === productId);
    if (item) {
      if (qty <= 0) removeItem(productId);
      else item.quantity = qty;
    }
  }

  function setCustomer(c: Customer | null) {
    customer.value = c;
    loyaltyPointsToRedeem.value = 0;
  }

  /** Cycle the order-level discount 0 → 5 → 10 → 15 → 0 (%). */
  function cycleDiscount() {
    discountPct.value = discountPct.value === 0 ? 5 : discountPct.value === 5 ? 10 : discountPct.value === 10 ? 15 : 0;
  }

  function clear() {
    items.value = [];
    customer.value = null;
    discountPct.value = 0;
    loyaltyPointsToRedeem.value = 0;
  }

  function toSaleRequest(paymentMethod: string) {
    return {
      customerId: customer.value?.id ?? null,
      currency: currency.value,
      paymentMethod,
      discountUsd: discountUsd.value,
      loyaltyPointsToRedeem: loyaltyPointsToRedeem.value,
      lineItems: items.value.map(i => ({ productId: i.product.id, quantity: i.quantity })),
    };
  }

  return {
    items,
    customer,
    discountPct,
    loyaltyPointsToRedeem,
    currency,
    taxRate,
    subtotalUsd,
    discountUsd,
    loyaltyDiscountUsd,
    taxUsd,
    totalUsd,
    count,
    addItem,
    removeItem,
    setQuantity,
    setCustomer,
    cycleDiscount,
    clear,
    toSaleRequest,
  };
});
