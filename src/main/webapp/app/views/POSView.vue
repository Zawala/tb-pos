<template>
  <div class="tb-checkout">
    <!-- Catalog -->
    <div class="tb-catalog">
      <div class="tb-catalog-bar">
        <div class="tb-scanrow">
          <label class="tb-field">
            <TbIcon name="barcode" :size="20" class-name="tb-field-ic" />
            <input ref="searchEl" v-model="q" placeholder="Scan barcode or search products…" @input="onSearch" @keydown.enter="onScan" />
            <button v-if="q" class="tb-field-clear" @click.prevent="clearSearch"><TbIcon name="x" :size="14" /></button>
          </label>
          <TbIconButton name="scan" kind="outline" />
        </div>
        <div class="tb-cats">
          <button v-for="c in catPills" :key="c.id" :class="['tb-catpill', cat === c.id ? 'is-active' : '']" @click="selectCat(c.id)">
            <TbIcon :name="c.id === 'all' ? 'grid' : 'tag'" :size="16" />{{ c.name }}
          </button>
        </div>
      </div>

      <div class="tb-grid">
        <div v-for="p in products" :key="p.id" :class="['tb-pcard', p.stockQuantity === 0 ? 'is-out' : '']" @click="add(p)">
          <TbTile :name="p.name" :seed="p.sku" size="md" />
          <span v-if="p.stockQuantity === 0" class="tb-out-badge"><TbChip tone="danger">Out</TbChip></span>
          <span v-else class="tb-pcard-add"><TbIcon name="plus" :size="18" /></span>
          <div class="tb-pcard-body">
            <div class="tb-pcard-name">{{ p.name }}</div>
            <div class="tb-pcard-foot">
              <span class="tb-pcard-price"><TbMoney :value="p.sellPriceUsd" /></span>
              <span class="tb-pcard-stock">{{ p.stockQuantity > 0 ? p.stockQuantity + ' left' : '—' }}</span>
            </div>
          </div>
        </div>

        <div v-if="products.length === 0" style="grid-column: 1/-1" class="tb-empty">
          <div class="ic"><TbIcon name="search" :size="28" /></div>
          No products match “{{ q }}”.
        </div>
      </div>
    </div>

    <!-- Cart -->
    <aside class="tb-cart">
      <div class="tb-cart-head">
        <h2>
          <TbIcon name="cart" :size="20" /> Current Sale
          <span v-if="cart.count > 0" class="tb-cart-count">{{ cart.count }}</span>
        </h2>
        <TbIconButton v-if="cart.items.length > 0" name="trash" kind="ghost" title="Clear" @click="cart.clear()" />
      </div>
      <div class="tb-cust" style="cursor: pointer" @click="custOpen = true">
        <TbIcon name="user" :size="18" /> {{ cart.customer ? cart.customer.name : 'Add customer · Walk-in' }}
      </div>

      <div v-if="cart.items.length === 0" class="tb-cart-empty">
        <div class="ic"><TbIcon name="cart" :size="34" /></div>
        <div>
          <div style="font-weight: 700; color: var(--text); margin-bottom: 4px">Cart is empty</div>
          <div style="font-size: 13px">Scan a barcode or tap a product to begin.</div>
        </div>
      </div>
      <div v-else class="tb-cart-items">
        <div v-for="l in cart.items" :key="l.product.id" class="tb-line">
          <TbTile :name="l.product.name" :seed="l.product.sku" size="sm" />
          <div class="tb-line-main">
            <div class="tb-line-name">{{ l.product.name }}</div>
            <div class="tb-line-meta"><TbMoney :value="l.product.sellPriceUsd" /> · #{{ l.product.sku }}</div>
          </div>
          <div class="tb-qty">
            <button @click="l.quantity === 1 ? cart.removeItem(l.product.id) : cart.setQuantity(l.product.id, l.quantity - 1)">
              <TbIcon :name="l.quantity === 1 ? 'trash' : 'minus'" :size="15" />
            </button>
            <span class="tnum">{{ l.quantity }}</span>
            <button @click="cart.setQuantity(l.product.id, l.quantity + 1)"><TbIcon name="plus" :size="15" /></button>
          </div>
          <div class="tb-line-price"><TbMoney :value="l.quantity * l.product.sellPriceUsd" /></div>
        </div>
      </div>

      <div class="tb-cart-foot">
        <div class="tb-totals">
          <div class="tb-totrow"><span>Subtotal</span><TbMoney :value="cart.subtotalUsd" /></div>
          <div v-if="cart.discountPct > 0" class="tb-totrow discount">
            <span>Discount ({{ cart.discountPct }}%)</span><span>−<TbMoney :value="cart.discountUsd" /></span>
          </div>
          <div v-if="cart.taxRate > 0" class="tb-totrow">
            <span>Tax ({{ Math.round(cart.taxRate * 100) }}%)</span><TbMoney :value="cart.taxUsd" />
          </div>
          <div class="tb-totrow grand"><span>Total</span><TbMoney :value="cart.totalUsd" /></div>
        </div>
        <div class="tb-cart-actions">
          <TbButton kind="default" icon="pct" title="Discount" @click="cart.cycleDiscount()">
            {{ cart.discountPct > 0 ? cart.discountPct + '%' : '' }}
          </TbButton>
          <TbButton kind="default" icon="pause" title="Hold sale" />
          <TbButton kind="primary" size="md" :disabled="cart.items.length === 0" @click="payOpen = true">
            Charge <TbMoney :value="cart.totalUsd" />
          </TbButton>
        </div>
      </div>
    </aside>

    <PaymentModal v-if="payOpen" @close="payOpen = false" @paid="onPaid" />
    <CustomerModal :open="custOpen" :current="cart.customer" @close="custOpen = false" @saved="onCustomerSaved" @clear="onCustomerClear" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useInventoryStore, type Product } from '@/stores/inventory';
import { useCartStore } from '@/stores/cart';
import { useCurrency } from '@/composables/useCurrency';
import { tbToast } from '@/composables/useOverlay';
import type { Customer } from '@/stores/customers';
import TbIcon from '@/components/ui/TbIcon.vue';
import TbTile from '@/components/ui/TbTile.vue';
import TbChip from '@/components/ui/TbChip.vue';
import TbMoney from '@/components/ui/TbMoney.vue';
import TbButton from '@/components/ui/TbButton.vue';
import TbIconButton from '@/components/ui/TbIconButton.vue';
import PaymentModal from '@/components/pos/PaymentModal.vue';
import CustomerModal from '@/components/pos/CustomerModal.vue';

const inventory = useInventoryStore();
const cart = useCartStore();
const { format } = useCurrency();
const { products, categories } = storeToRefs(inventory);

const q = ref('');
const cat = ref<string>('all');
const payOpen = ref(false);
const custOpen = ref(false);
const searchEl = ref<HTMLInputElement | null>(null);
let debounce: ReturnType<typeof setTimeout>;

const catPills = computed(() => [{ id: 'all', name: 'All Items' }, ...categories.value.map(c => ({ id: c, name: c }))]);

onMounted(() => {
  inventory.fetchProducts();
  inventory.fetchCategories();
  searchEl.value?.focus();
});

function refetch() {
  inventory.fetchProducts(q.value || undefined, cat.value === 'all' ? undefined : cat.value);
}

function onSearch() {
  clearTimeout(debounce);
  debounce = setTimeout(refetch, 300);
}

function selectCat(id: string) {
  cat.value = id;
  refetch();
}

function clearSearch() {
  q.value = '';
  refetch();
}

function add(p: Product) {
  cart.addItem(p);
}

// Barcode: exact SKU match adds and clears the field.
function onScan() {
  const hit = products.value.find(p => p.sku === q.value.trim());
  if (hit) {
    cart.addItem(hit);
    q.value = '';
  }
}

function onPaid(sale: any) {
  const method = (sale?.paymentMethod ?? '').toString().toUpperCase();
  payOpen.value = false;
  tbToast.success('Sale completed', `${format(Number(sale?.totalUsd ?? 0))}${method ? ' · ' + method : ''}`);
}

function onCustomerSaved(c: Customer) {
  cart.setCustomer(c);
  custOpen.value = false;
  tbToast.success('Customer added', c.name + ' attached to this sale');
}

function onCustomerClear() {
  cart.setCustomer(null);
  custOpen.value = false;
  tbToast.info('Customer removed');
}
</script>
