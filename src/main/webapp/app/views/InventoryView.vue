<template>
  <div class="tb-page">
    <TbPageHead title="Inventory" sub="Stock levels & reorder management">
      <TbButton kind="default" icon="print" class-name="tb-hide-sm">Export</TbButton>
      <TbButton kind="primary" icon="plus" @click="openStockIn">Stock In</TbButton>
    </TbPageHead>

    <div class="tb-grid4" style="margin-bottom: 22px">
      <TbStatCard label="Total Units" :value="totalUnits.toLocaleString()" icon="package" accent="var(--primary)" />
      <TbStatCard label="Stock Value" :value="format(stockValue)" icon="dollar" accent="var(--success)" />
      <TbStatCard label="Low Stock" :value="lowCount" icon="warn" accent="var(--warning)" />
      <TbStatCard label="Out of Stock" :value="outCount" icon="x" accent="var(--danger)" />
    </div>

    <div class="tb-tablewrap">
      <div class="tb-tabletools">
        <TbSearchField v-model="q" placeholder="Search inventory…" @update:model-value="onSearch" />
        <TbChip tone="warning"><TbIcon name="warn" :size="13" /> {{ lowCount }} low</TbChip>
        <TbChip tone="danger"><TbIcon name="x" :size="13" /> {{ outCount }} out</TbChip>
      </div>
      <div style="overflow-x: auto">
        <table class="tb-table">
          <thead>
            <tr>
              <th>Product</th>
              <th class="tb-hide-sm">SKU</th>
              <th>Stock Level</th>
              <th class="r tb-hide-sm">Reorder at</th>
              <th class="r">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id" @click="openAdjust(p)">
              <td>
                <div class="tb-cellprod">
                  <TbTile :name="p.name" :seed="p.sku" size="sm" />
                  <div class="tb-cellprod-main">
                    <b>{{ p.name }}</b
                    ><span>{{ p.category || '—' }}</span>
                  </div>
                </div>
              </td>
              <td class="tb-hide-sm">
                <span class="tb-mono">{{ p.sku }}</span>
              </td>
              <td>
                <div class="tb-stockbar">
                  <div class="tb-stockbar-track"><i :style="{ width: barPct(p) + '%', background: barColor(p) }" /></div>
                  <b class="tnum" :style="{ color: barColor(p) }">{{ p.stockQuantity }}</b>
                </div>
              </td>
              <td class="r tb-hide-sm tb-mono">{{ p.reorderLevel }}</td>
              <td class="r">
                <b class="tnum"><TbMoney :value="p.stockQuantity * p.costPriceUsd" /></b>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="5"><div class="tb-empty" style="padding: 40px">No inventory found.</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <StockAdjustModal v-model="showAdjust" :product="selectedProduct" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useInventoryStore, type Product } from '@/stores/inventory';
import { useCurrency } from '@/composables/useCurrency';
import StockAdjustModal from '@/components/inventory/StockAdjustModal.vue';
import TbPageHead from '@/components/ui/TbPageHead.vue';
import TbButton from '@/components/ui/TbButton.vue';
import TbStatCard from '@/components/ui/TbStatCard.vue';
import TbSearchField from '@/components/ui/TbSearchField.vue';
import TbChip from '@/components/ui/TbChip.vue';
import TbIcon from '@/components/ui/TbIcon.vue';
import TbTile from '@/components/ui/TbTile.vue';
import TbMoney from '@/components/ui/TbMoney.vue';

const inventory = useInventoryStore();
const { products } = storeToRefs(inventory);
const { format } = useCurrency();

const q = ref('');
const showAdjust = ref(false);
const selectedProduct = ref<Product | null>(null);
let debounce: ReturnType<typeof setTimeout>;

const totalUnits = computed(() => products.value.reduce((s, p) => s + p.stockQuantity, 0));
const stockValue = computed(() => products.value.reduce((s, p) => s + p.stockQuantity * p.costPriceUsd, 0));
const lowCount = computed(() => products.value.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.reorderLevel).length);
const outCount = computed(() => products.value.filter(p => p.stockQuantity === 0).length);

function barPct(p: Product): number {
  return Math.min(100, (p.stockQuantity / 60) * 100);
}
function barColor(p: Product): string {
  if (p.stockQuantity === 0) return 'var(--danger)';
  if (p.stockQuantity <= p.reorderLevel) return 'var(--warning)';
  return 'var(--success)';
}

function onSearch() {
  clearTimeout(debounce);
  debounce = setTimeout(() => inventory.fetchProducts(q.value || undefined), 300);
}

function openAdjust(p: Product) {
  selectedProduct.value = p;
  showAdjust.value = true;
}
function openStockIn() {
  selectedProduct.value = products.value[0] ?? null;
  showAdjust.value = true;
}

onMounted(() => inventory.fetchProducts());
</script>
