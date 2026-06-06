<template>
  <div class="tb-page">
    <TbPageHead title="Orders" sub="Recent transactions & receipts">
      <TbButton kind="default" icon="filter" class-name="tb-hide-sm">Today</TbButton>
      <TbButton kind="default" icon="print">Export</TbButton>
    </TbPageHead>

    <div class="tb-grid2">
      <div class="tb-tablewrap">
        <div class="tb-tabletools">
          <TbSearchField v-model="q" placeholder="Search order # or customer…" />
        </div>
        <div style="overflow-x: auto">
          <table class="tb-table">
            <thead>
              <tr>
                <th>Order</th>
                <th class="tb-hide-sm">Customer</th>
                <th>Pay</th>
                <th class="r">Total</th>
                <th class="r tb-hide-sm">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="o in filtered"
                :key="o.id"
                :style="selected && selected.id === o.id ? { background: 'var(--primary-soft)' } : undefined"
                @click="selected = o"
              >
                <td>
                  <b style="font-weight: 700">{{ shortId(o.id) }}</b>
                  <div style="font-size: 12px; color: var(--text-subtle)">{{ itemCount(o) }} items</div>
                </td>
                <td class="tb-hide-sm">{{ customerLabel(o) }}</td>
                <td>
                  <TbChip :tone="payTone(o.paymentMethod)">{{ o.paymentMethod }}</TbChip>
                </td>
                <td class="r">
                  <b class="tnum"><TbMoney :value="Number(o.totalUsd)" /></b>
                </td>
                <td class="r tb-hide-sm" style="color: var(--text-subtle); font-size: 13px">{{ ago(o.createdAt) }}</td>
              </tr>
              <tr v-if="filtered.length === 0">
                <td colspan="5">
                  <div class="tb-empty" style="padding: 50px">
                    <div class="ic"><TbIcon name="receipt" :size="28" /></div>
                    No orders yet. Completed sales from this session appear here.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="selected" class="tb-panel" style="align-self: start">
        <div class="tb-panel-head">
          <div>
            <h3>{{ shortId(selected.id) }}</h3>
            <div class="sub">{{ customerLabel(selected) }} · {{ ago(selected.createdAt) }}</div>
          </div>
          <TbChip v-if="selected.status === 'REFUNDED'" tone="danger">Refunded</TbChip>
          <TbChip v-else tone="success"><TbIcon name="check" :size="13" /> {{ selected.status || 'Completed' }}</TbChip>
        </div>
        <div class="tb-orddetail">
          <div v-for="(it, i) in selected.lineItems" :key="i" class="tb-ord-line">
            <span
              ><b class="tnum" style="color: var(--text-muted)">{{ it.quantity }}×</b> &nbsp;{{ it.productName }}</span
            >
            <span class="tnum" style="font-weight: 600"><TbMoney :value="Number(it.lineTotalUsd)" /></span>
          </div>
        </div>
        <div class="tb-totals" style="margin-top: 16px">
          <div class="tb-totrow"><span>Subtotal</span><TbMoney :value="Number(selected.subtotalUsd)" /></div>
          <div v-if="Number(selected.discountUsd) > 0" class="tb-totrow discount">
            <span>Discount</span><span>−<TbMoney :value="Number(selected.discountUsd)" /></span>
          </div>
          <div v-if="Number(selected.taxUsd) > 0" class="tb-totrow"><span>Tax</span><TbMoney :value="Number(selected.taxUsd)" /></div>
          <div class="tb-totrow grand"><span>Total</span><TbMoney :value="Number(selected.totalUsd)" /></div>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 16px">
          <TbButton kind="default" icon="print" full @click="printReceipt">Reprint</TbButton>
          <TbButton kind="danger" icon="refresh" full>Refund</TbButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSalesStore, type Sale } from '@/stores/sales';
import TbPageHead from '@/components/ui/TbPageHead.vue';
import TbButton from '@/components/ui/TbButton.vue';
import TbSearchField from '@/components/ui/TbSearchField.vue';
import TbChip from '@/components/ui/TbChip.vue';
import TbIcon from '@/components/ui/TbIcon.vue';
import TbMoney from '@/components/ui/TbMoney.vue';

const sales = useSalesStore();
const { orders } = storeToRefs(sales);

const q = ref('');
const selected = ref<Sale | null>(null);

const filtered = computed(() =>
  orders.value.filter(o => {
    const s = q.value.toLowerCase();
    return !s || o.id.toLowerCase().includes(s) || customerLabel(o).toLowerCase().includes(s);
  }),
);

watch(
  filtered,
  list => {
    if (!selected.value && list.length) selected.value = list[0];
  },
  { immediate: true },
);

function shortId(id: string): string {
  return 'TB-' + id.slice(0, 8).toUpperCase();
}
function itemCount(o: Sale): number {
  return (o.lineItems ?? []).reduce((s, l) => s + l.quantity, 0);
}
function customerLabel(o: Sale): string {
  return o.customerId ? 'Customer ' + o.customerId.slice(0, 6) : 'Walk-in';
}
function payTone(p: string): 'success' | 'primary' | 'neutral' {
  if (p === 'cash' || p === 'Cash') return 'success';
  if (p === 'qr' || p === 'QR') return 'primary';
  return 'neutral';
}
function ago(iso: string): string {
  if (!iso) return 'just now';
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  return Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm ago';
}
function printReceipt() {
  window.print();
}

onMounted(() => sales.fetchOrders());
</script>
