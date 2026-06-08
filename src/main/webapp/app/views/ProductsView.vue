<template>
  <div class="tb-page">
    <TbPageHead title="Products" :sub="`${products.length} items across ${categories.length} categories`">
      <TbButton kind="default" icon="filter" class-name="tb-hide-sm">Filters</TbButton>
      <TbButton kind="primary" icon="plus" @click="showCreate = true">Add Product</TbButton>
    </TbPageHead>

    <div class="tb-tablewrap">
      <div class="tb-tabletools">
        <TbSearchField v-model="q" placeholder="Search by name or SKU…" @update:model-value="onSearch" />
        <select v-model="cat" class="tb-select" @change="refetch">
          <option value="all">All Items</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div style="overflow-x: auto">
        <table class="tb-table">
          <thead>
            <tr>
              <th>Product</th>
              <th class="tb-hide-sm">SKU</th>
              <th class="tb-hide-sm">Category</th>
              <th class="r">Price</th>
              <th class="r">Stock</th>
              <th class="r">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
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
              <td class="tb-hide-sm">
                <TbChip>{{ p.category || '—' }}</TbChip>
              </td>
              <td class="r">
                <b class="tnum"><TbMoney :value="p.sellPriceUsd" /></b>
              </td>
              <td class="r tnum" style="font-weight: 600">{{ p.stockQuantity }}</td>
              <td class="r">
                <TbChip v-if="p.stockQuantity === 0" tone="danger">Out</TbChip>
                <TbChip v-else-if="p.stockQuantity <= p.reorderLevel" tone="warning">Low</TbChip>
                <TbChip v-else tone="success">In stock</TbChip>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="6"><div class="tb-empty" style="padding: 40px">No products found.</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ProductModal :open="showCreate" @close="showCreate = false" @saved="onProductSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useInventoryStore } from '@/stores/inventory';
import { tbToast } from '@/composables/useOverlay';
import TbPageHead from '@/components/ui/TbPageHead.vue';
import TbButton from '@/components/ui/TbButton.vue';
import TbSearchField from '@/components/ui/TbSearchField.vue';
import TbChip from '@/components/ui/TbChip.vue';
import TbTile from '@/components/ui/TbTile.vue';
import TbMoney from '@/components/ui/TbMoney.vue';
import ProductModal from '@/components/products/ProductModal.vue';

const inventory = useInventoryStore();
const { products, categories } = storeToRefs(inventory);

const q = ref('');
const cat = ref('all');
const showCreate = ref(false);
let debounce: ReturnType<typeof setTimeout>;

function refetch() {
  inventory.fetchProducts(q.value || undefined, cat.value === 'all' ? undefined : cat.value);
}
function onSearch() {
  clearTimeout(debounce);
  debounce = setTimeout(refetch, 300);
}

function onProductSaved(name: string) {
  tbToast.success('Product added', name + ' is now in your catalog');
}

onMounted(() => {
  inventory.fetchProducts();
  inventory.fetchCategories();
});
</script>
