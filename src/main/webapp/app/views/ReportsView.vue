<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Reports</h2>
      <Button variant="subtle" @click="exportCsv">Export CSV</Button>
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 rounded text-sm font-medium border transition-colors"
        :class="activeTab === tab.id ? 'bg-ink-gray-7 text-white border-ink-gray-7' : 'border-outline-gray-2 hover:bg-surface-gray-1'"
        @click="
          activeTab = tab.id;
          load();
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab !== 'inventory-value' && activeTab !== 'low-stock' && activeTab !== 'loyalty-summary'" class="flex gap-2 mb-4">
      <input v-model="from" type="date" class="border border-outline-gray-2 rounded px-3 py-1.5 text-sm" />
      <span class="py-1.5 text-ink-gray-4">to</span>
      <input v-model="to" type="date" class="border border-outline-gray-2 rounded px-3 py-1.5 text-sm" />
      <Button size="sm" @click="load">Apply</Button>
    </div>

    <div v-if="loading" class="py-8 text-center text-ink-gray-4">Loading…</div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-outline-gray-2 text-left text-ink-gray-4">
            <th v-for="col in columns" :key="col.key" class="py-2 px-3" :class="col.right ? 'text-right' : ''">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i" class="border-b border-outline-gray-1 hover:bg-surface-gray-1">
            <td v-for="col in columns" :key="col.key" class="py-2 px-3" :class="col.right ? 'text-right' : ''">
              {{ formatCell(row[col.key], col) }}
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td :colspan="columns.length" class="py-8 text-center text-ink-gray-4">No data</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';

type TabId = 'sales-summary' | 'sales-by-product' | 'sales-by-cashier' | 'inventory-value' | 'low-stock' | 'loyalty-summary';

const tabs = [
  { id: 'sales-summary' as TabId, label: 'Daily Summary' },
  { id: 'sales-by-product' as TabId, label: 'By Product' },
  { id: 'sales-by-cashier' as TabId, label: 'By Cashier' },
  { id: 'inventory-value' as TabId, label: 'Inventory Value' },
  { id: 'low-stock' as TabId, label: 'Low Stock' },
  { id: 'loyalty-summary' as TabId, label: 'Loyalty' },
];

const activeTab = ref<TabId>('sales-summary');
const from = ref(new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));
const to = ref(new Date().toISOString().slice(0, 10));
const rows = ref<any[]>([]);
const loading = ref(false);

const columnMap: Record<TabId, Array<{ key: string; label: string; right?: boolean; money?: boolean }>> = {
  'sales-summary': [
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'saleCount', label: 'Sales', right: true },
    { key: 'totalUsd', label: 'Total (USD)', right: true, money: true },
    { key: 'avgBasketUsd', label: 'Avg Basket', right: true, money: true },
  ],
  'sales-by-product': [
    { key: 'productName', label: 'Product' },
    { key: 'qtySold', label: 'Qty Sold', right: true },
    { key: 'revenueUsd', label: 'Revenue (USD)', right: true, money: true },
  ],
  'sales-by-cashier': [
    { key: 'cashierLogin', label: 'Cashier' },
    { key: 'saleCount', label: 'Sales', right: true },
    { key: 'totalUsd', label: 'Total (USD)', right: true, money: true },
  ],
  'inventory-value': [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Stock', right: true },
    { key: 'costPriceUsd', label: 'Cost', right: true, money: true },
    { key: 'totalValueUsd', label: 'Total Value', right: true, money: true },
  ],
  'low-stock': [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Stock', right: true },
    { key: 'reorderLevel', label: 'Reorder Level', right: true },
  ],
  'loyalty-summary': [
    { key: 'name', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'pointsBalance', label: 'Points', right: true },
    { key: 'totalSpendUsd', label: 'Total Spend', right: true, money: true },
  ],
};

const columns = computed(() => columnMap[activeTab.value]);

async function load() {
  loading.value = true;
  try {
    const params: Record<string, string> = {};
    if (!['inventory-value', 'low-stock', 'loyalty-summary'].includes(activeTab.value)) {
      params.from = from.value;
      params.to = to.value;
    }
    const res = await axios.get(`/api/v1/reports/${activeTab.value}`, { params });
    rows.value = res.data;
  } catch {
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

function formatCell(val: any, col: any) {
  if (val == null) return '—';
  if (col.money) return `$${Number(val).toFixed(2)}`;
  return val;
}

function exportCsv() {
  const header = columns.value.map(c => c.label).join(',');
  const body = rows.value.map(row => columns.value.map(c => row[c.key] ?? '').join(',')).join('\n');
  const blob = new Blob([header + '\n' + body], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${activeTab.value}-${from.value}-to-${to.value}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

load();
</script>
