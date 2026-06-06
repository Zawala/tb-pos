<template>
  <div class="tb-overlay" @click="$emit('close')">
    <div class="tb-modal" @click.stop>
      <!-- Success / receipt -->
      <template v-if="done">
        <div class="tb-modal-body">
          <div class="tb-success">
            <div class="tb-success-ic"><TbIcon name="check" :size="44" :stroke="2.4" /></div>
            <h2 style="margin: 0 0 4px; font-size: 22px">Payment Complete</h2>
            <p style="color: var(--text-muted); margin: 0; font-size: 14px">
              <template v-if="method === 'cash'">
                Change due <b class="tnum" style="color: var(--success)">{{ format(change) }}</b>
              </template>
              <template v-else>Transaction approved</template>
            </p>
            <div class="tb-receipt">
              <h3>TbPos</h3>
              <div class="rc-sub">Downtown · Register 1 · {{ now }}</div>
              <div class="tb-receipt-row">
                <span>{{ count }} items</span><span>{{ format(subtotal) }}</span>
              </div>
              <div v-if="discount > 0" class="tb-receipt-row">
                <span>Discount</span><span>−{{ format(discount) }}</span>
              </div>
              <div v-if="tax > 0" class="tb-receipt-row">
                <span>Tax</span><span>{{ format(tax) }}</span>
              </div>
              <div class="tb-receipt-row b">
                <span>Total · {{ method.toUpperCase() }}</span
                ><span>{{ format(total) }}</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px">
              <TbButton kind="default" icon="print" full @click="printReceipt">Print</TbButton>
              <TbButton kind="primary" icon="check" full @click="newSale">New Sale</TbButton>
            </div>
          </div>
        </div>
      </template>

      <!-- Payment entry -->
      <template v-else>
        <div class="tb-modal-head">
          <h2>Take Payment</h2>
          <TbIconButton name="x" kind="ghost" @click="$emit('close')" />
        </div>
        <div class="tb-modal-body">
          <div class="tb-pay-amount">
            <div class="lbl">Amount due</div>
            <div class="val tnum">{{ format(total) }}</div>
          </div>
          <div class="tb-paytabs">
            <button v-for="m in methods" :key="m.id" :class="['tb-paytab', method === m.id ? 'is-active' : '']" @click="selectMethod(m.id)">
              <TbIcon :name="m.icon" :size="26" /> {{ m.label }}
            </button>
          </div>

          <template v-if="method === 'cash'">
            <div class="tb-quickcash">
              <button v-for="v in quickCash" :key="v" class="tnum" @click="tendered = String(v)">{{ format(v) }}</button>
            </div>
            <div class="tb-field" style="height: 56px; margin-bottom: 12px">
              <TbIcon name="cash" class-name="tb-field-ic" />
              <input
                class="tnum"
                style="font-size: 22px; font-weight: 700"
                :value="tendered ? '$' + tendered : ''"
                placeholder="$0.00"
                readonly
              />
            </div>
            <div class="tb-keypad">
              <button v-for="k in keys" :key="k" class="tb-key" @click="press(k)">{{ k === 'del' ? '⌫' : k }}</button>
            </div>
            <div v-if="tNum >= total" class="tb-change">
              <span>Change due</span><span class="tnum">{{ format(change) }}</span>
            </div>
          </template>

          <template v-else-if="method === 'card'">
            <div style="text-align: center; padding: 10px 0 6px">
              <div class="tb-qr-box">
                <div
                  style="
                    width: 120px;
                    height: 120px;
                    border-radius: 20px;
                    background: var(--primary-soft);
                    color: var(--primary);
                    display: grid;
                    place-items: center;
                  "
                >
                  <TbIcon v-if="processing" name="refresh" :size="42" class-name="tb-spin" />
                  <TbIcon v-else name="card" :size="48" />
                </div>
              </div>
              <p style="color: var(--text-muted); font-size: 14px; margin: 0">
                {{ processing ? 'Contacting terminal…' : 'Insert, tap, or swipe card on the terminal.' }}
              </p>
            </div>
          </template>

          <template v-else>
            <div class="tb-qr-box">
              <div class="tb-qr-img" :style="qrStyle" />
              <p style="color: var(--text-muted); font-size: 14px; margin: 14px 0 0; text-align: center">
                Ask the customer to scan to pay <b>{{ format(total) }}</b>
              </p>
            </div>
          </template>

          <p v-if="error" style="color: var(--danger); font-size: 13px; text-align: center; margin: 12px 0 0">{{ error }}</p>
        </div>
        <div style="padding: 0 22px 22px">
          <TbButton
            kind="success"
            size="lg"
            full
            :disabled="!canComplete || processing"
            :icon="processing ? undefined : 'check'"
            @click="confirm"
          >
            {{ processing ? 'Processing…' : method === 'cash' ? 'Confirm Cash Payment' : method === 'qr' ? 'Mark as Paid' : 'Charge Card' }}
          </TbButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import { useCartStore } from '@/stores/cart';
import { useSyncStore } from '@/stores/sync';
import { useSalesStore } from '@/stores/sales';
import { useCurrency } from '@/composables/useCurrency';
import { queueSale } from '@/services/offline';
import TbIcon from '@/components/ui/TbIcon.vue';
import TbButton from '@/components/ui/TbButton.vue';
import TbIconButton from '@/components/ui/TbIconButton.vue';

const emit = defineEmits<{ close: []; paid: [sale: any] }>();

const cart = useCartStore();
const syncStore = useSyncStore();
const salesStore = useSalesStore();
const { format } = useCurrency();

const methods = [
  { id: 'cash', icon: 'cash', label: 'Cash' },
  { id: 'card', icon: 'card', label: 'Card' },
  { id: 'qr', icon: 'qr', label: 'Mobile / QR' },
];
const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

const method = ref('card');
const tendered = ref('');
const processing = ref(false);
const done = ref(false);
const error = ref('');
const completedSale = ref<any>(null);

// Snapshot of the totals at confirm time (cart is cleared on New Sale).
const subtotal = computed(() => cart.subtotalUsd);
const discount = computed(() => cart.discountUsd);
const tax = computed(() => cart.taxUsd);
const total = computed(() => cart.totalUsd);
const count = computed(() => cart.count);

const tNum = computed(() => parseFloat(tendered.value || '0'));
const change = computed(() => Math.max(0, tNum.value - total.value));
const canComplete = computed(() => method.value !== 'cash' || tNum.value >= total.value);
const now = computed(() => new Date().toLocaleString());

const quickCash = computed(() => {
  const t = total.value;
  return [t, Math.ceil(t / 5) * 5, Math.ceil(t / 10) * 10, Math.ceil(t / 20) * 20].filter((v, i, a) => a.indexOf(v) === i);
});

const qrStyle = {
  backgroundImage: 'repeating-conic-gradient(#0f172a 0% 25%, #fff 0% 50%)',
  backgroundSize: '20px 20px',
  backgroundPosition: 'center',
};

function selectMethod(m: string) {
  method.value = m;
  tendered.value = '';
}

function press(k: string) {
  if (k === 'del') tendered.value = tendered.value.slice(0, -1);
  else tendered.value = (tendered.value + k).replace(/^0+(?=\d)/, '');
}

async function confirm() {
  if (!canComplete.value || processing.value) return;
  processing.value = true;
  error.value = '';
  const payload = { ...cart.toSaleRequest(method.value), currency: cart.currency };
  try {
    let sale: any;
    if (!navigator.onLine) {
      await queueSale(payload);
      syncStore.increment();
      sale = { offline: true, paymentMethod: method.value, totalUsd: total.value, currency: cart.currency };
    } else {
      const res = await axios.post('/api/v1/sales', payload);
      sale = res.data;
      salesStore.recordSale(sale);
    }
    completedSale.value = sale;
    // Brief terminal animation for card before showing the receipt.
    setTimeout(
      () => {
        processing.value = false;
        done.value = true;
      },
      method.value === 'card' ? 800 : 300,
    );
  } catch (e: any) {
    processing.value = false;
    error.value = e?.response?.data?.detail || e?.response?.data?.message || 'Sale failed';
  }
}

function printReceipt() {
  window.print();
}

function newSale() {
  const sale = completedSale.value ?? { paymentMethod: method.value, totalUsd: total.value };
  cart.clear();
  emit('paid', sale);
}
</script>
