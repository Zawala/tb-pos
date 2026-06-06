<template>
  <div class="tb-page">
    <TbPageHead title="Dashboard" :sub="`Today · Downtown · Register 1`">
      <TbSegmented v-model="range" size="sm" :options="rangeOptions" />
      <TbButton kind="default" icon="refresh" @click="load">Refresh</TbButton>
    </TbPageHead>

    <div class="tb-grid4">
      <TbStatCard label="Gross Sales" :value="format(grossSales)" icon="dollar" accent="var(--primary)" />
      <TbStatCard label="Transactions" :value="transactions" icon="receipt" accent="var(--success)" />
      <TbStatCard label="Avg. Basket" :value="format(avgBasket)" icon="cart" accent="var(--accent-2)" />
      <TbStatCard label="Items Sold" :value="itemsSold" icon="box" accent="var(--warning)" />
    </div>

    <div class="tb-grid2 tb-mt">
      <div class="tb-panel">
        <div class="tb-panel-head">
          <div>
            <h3>Sales by Hour</h3>
            <div class="sub">Revenue across opening hours (sample)</div>
          </div>
          <TbChip tone="success"><TbIcon name="arrowup" :size="13" /> Peak 18:00</TbChip>
        </div>
        <TbBarChart :labels="hours" :values="hourlySales" accent="linear-gradient(180deg, var(--primary), var(--accent-2))" :height="170" />
      </div>
      <div class="tb-panel">
        <div class="tb-panel-head">
          <div>
            <h3>Payment Mix</h3>
            <div class="sub">By transaction count</div>
          </div>
        </div>
        <div class="tb-donut-wrap">
          <div class="tb-donut" :style="{ background: donutGradient }">
            <div class="tb-donut-c">
              <b>{{ transactions }}</b
              ><span>orders</span>
            </div>
          </div>
          <div class="tb-legend">
            <div v-for="p in paymentMix" :key="p.name" class="tb-legrow">
              <span class="tb-legdot" :style="{ background: p.color }" />
              <span class="nm">{{ p.name }}</span
              ><span class="vl tnum">{{ p.pct }}%</span>
            </div>
            <div v-if="paymentMix.length === 0" class="sub" style="font-size: 13px">No sales yet today.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="tb-grid2 tb-mt">
      <div class="tb-panel">
        <div class="tb-panel-head">
          <div>
            <h3>Top Products</h3>
            <div class="sub">Best sellers today</div>
          </div>
        </div>
        <div class="tb-rank">
          <div v-for="(p, i) in topProducts" :key="p.productName" class="tb-rankrow">
            <span class="tb-rank-no">{{ i + 1 }}</span>
            <div class="tb-rank-main">
              <div class="tb-rank-name">{{ p.productName }}</div>
              <div class="tb-rank-bar"><i :style="{ width: topPct(p) + '%' }" /></div>
            </div>
            <div class="tb-rank-val">
              <b class="tnum">{{ p.qtySold }}</b
              ><span>{{ format(Number(p.revenueUsd)) }}</span>
            </div>
          </div>
          <div v-if="topProducts.length === 0" class="tb-empty" style="padding: 30px">No product sales yet.</div>
        </div>
      </div>
      <div class="tb-panel">
        <div class="tb-panel-head">
          <div>
            <h3>Low Stock Alerts</h3>
            <div class="sub">Reorder soon</div>
          </div>
          <TbChip tone="warning">{{ lowStock.length }} items</TbChip>
        </div>
        <div class="tb-rank">
          <div v-for="p in lowStock.slice(0, 5)" :key="p.id" class="tb-rankrow">
            <TbTile :name="p.name" :seed="p.sku" size="sm" />
            <div class="tb-rank-main">
              <div class="tb-rank-name">{{ p.name }}</div>
              <div class="sub" style="font-size: 12px; color: var(--text-subtle)">#{{ p.sku }}</div>
            </div>
            <TbChip :tone="p.quantity <= 6 ? 'danger' : 'warning'">{{ p.quantity }} left</TbChip>
          </div>
          <div v-if="lowStock.length === 0" class="tb-empty" style="padding: 30px">Everything well stocked.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useCurrency } from '@/composables/useCurrency';
import TbPageHead from '@/components/ui/TbPageHead.vue';
import TbStatCard from '@/components/ui/TbStatCard.vue';
import TbBarChart from '@/components/ui/TbBarChart.vue';
import TbSegmented from '@/components/ui/TbSegmented.vue';
import TbButton from '@/components/ui/TbButton.vue';
import TbChip from '@/components/ui/TbChip.vue';
import TbIcon from '@/components/ui/TbIcon.vue';
import TbTile from '@/components/ui/TbTile.vue';

interface SalesSummaryRow {
  paymentMethod: string;
  saleCount: number;
  totalUsd: number;
  avgBasketUsd: number;
}
interface ProductSalesRow {
  productId: string;
  productName: string;
  qtySold: number;
  revenueUsd: number;
}
interface LowStockRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
}

const { format } = useCurrency();

const range = ref('today');
const rangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const summary = ref<SalesSummaryRow[]>([]);
const topProducts = ref<ProductSalesRow[]>([]);
const lowStock = ref<LowStockRow[]>([]);

// No hourly endpoint exists — sample series, clearly labelled in the panel header.
const hours = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
const hourlySales = [320, 540, 880, 1240, 760, 690, 910, 1180, 1460, 980];

const PAY_COLORS: Record<string, string> = {
  Card: 'var(--primary)',
  Cash: 'var(--success)',
  QR: 'var(--accent-2)',
  Mobile: 'var(--accent-2)',
};

const grossSales = computed(() => summary.value.reduce((s, r) => s + Number(r.totalUsd ?? 0), 0));
const transactions = computed(() => summary.value.reduce((s, r) => s + Number(r.saleCount ?? 0), 0));
const avgBasket = computed(() => (transactions.value ? grossSales.value / transactions.value : 0));
const itemsSold = computed(() => topProducts.value.reduce((s, r) => s + Number(r.qtySold ?? 0), 0));

const paymentMix = computed(() => {
  const total = transactions.value || 1;
  return summary.value.map(r => ({
    name: r.paymentMethod,
    pct: Math.round((Number(r.saleCount) / total) * 100),
    color: PAY_COLORS[r.paymentMethod] ?? 'var(--text-subtle)',
  }));
});

const donutGradient = computed(() => {
  if (paymentMix.value.length === 0) return 'var(--surface-3)';
  let acc = 0;
  const segs = paymentMix.value.map(p => {
    const start = acc;
    acc += p.pct;
    return `${p.color} ${start}% ${acc}%`;
  });
  return `conic-gradient(${segs.join(', ')})`;
});

function topPct(p: ProductSalesRow): number {
  const max = Number(topProducts.value[0]?.qtySold ?? 1) || 1;
  return (Number(p.qtySold) / max) * 100;
}

function dateRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  if (range.value === 'week') from.setDate(from.getDate() - 7);
  else if (range.value === 'month') from.setMonth(from.getMonth() - 1);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}

async function load() {
  const { from, to } = dateRange();
  const params = { from, to };
  const [s, p, l] = await Promise.allSettled([
    axios.get('/api/v1/reports/sales-summary', { params }),
    axios.get('/api/v1/reports/sales-by-product', { params }),
    axios.get('/api/v1/reports/low-stock'),
  ]);
  summary.value = s.status === 'fulfilled' ? s.value.data : [];
  topProducts.value = p.status === 'fulfilled' ? (p.value.data as ProductSalesRow[]).slice(0, 5) : [];
  lowStock.value = l.status === 'fulfilled' ? l.value.data : [];
}

onMounted(load);
</script>
