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

    <Dialog v-model="showCreate" :options="{ title: 'New Product' }">
      <template #body>
        <div class="flex flex-col gap-3 p-4">
          <input v-model="newProduct.sku" placeholder="SKU *" class="border border-outline-gray-2 rounded px-3 py-2 text-sm" />
          <input v-model="newProduct.name" placeholder="Name *" class="border border-outline-gray-2 rounded px-3 py-2 text-sm" />
          <input v-model="newProduct.category" placeholder="Category" class="border border-outline-gray-2 rounded px-3 py-2 text-sm" />
          <input
            v-model.number="newProduct.costPriceUsd"
            type="number"
            step="0.01"
            placeholder="Cost Price (USD) *"
            class="border border-outline-gray-2 rounded px-3 py-2 text-sm"
          />
          <input
            v-model.number="newProduct.sellPriceUsd"
            type="number"
            step="0.01"
            placeholder="Sell Price (USD) *"
            class="border border-outline-gray-2 rounded px-3 py-2 text-sm"
          />
          <input
            v-model.number="newProduct.reorderLevel"
            type="number"
            placeholder="Reorder Level"
            class="border border-outline-gray-2 rounded px-3 py-2 text-sm"
          />
          <p v-if="createError" class="text-red-500 text-sm">{{ createError }}</p>
        </div>
      </template>
      <template #actions>
        <Button variant="subtle" @click="showCreate = false">Cancel</Button>
        <Button :loading="creating" @click="submitCreate">Create</Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useInventoryStore } from '@/stores/inventory';
import TbPageHead from '@/components/ui/TbPageHead.vue';
import TbButton from '@/components/ui/TbButton.vue';
import TbSearchField from '@/components/ui/TbSearchField.vue';
import TbChip from '@/components/ui/TbChip.vue';
import TbTile from '@/components/ui/TbTile.vue';
import TbMoney from '@/components/ui/TbMoney.vue';

const inventory = useInventoryStore();
const { products, categories } = storeToRefs(inventory);

const q = ref('');
const cat = ref('all');
const showCreate = ref(false);
const creating = ref(false);
const createError = ref('');
const newProduct = ref({ sku: '', name: '', category: '', costPriceUsd: 0, sellPriceUsd: 0, reorderLevel: 5, active: true });
let debounce: ReturnType<typeof setTimeout>;

function refetch() {
  inventory.fetchProducts(q.value || undefined, cat.value === 'all' ? undefined : cat.value);
}
function onSearch() {
  clearTimeout(debounce);
  debounce = setTimeout(refetch, 300);
}

async function submitCreate() {
  creating.value = true;
  createError.value = '';
  try {
    await inventory.createProduct(newProduct.value);
    showCreate.value = false;
    newProduct.value = { sku: '', name: '', category: '', costPriceUsd: 0, sellPriceUsd: 0, reorderLevel: 5, active: true };
  } catch (e: any) {
    createError.value = e?.response?.data?.detail || 'Failed to create product';
  } finally {
    creating.value = false;
  }
}

onMounted(() => {
  inventory.fetchProducts();
  inventory.fetchCategories();
});
</script>
