<template>
  <div class="tb-page">
    <TbPageHead title="Settings" sub="Configure your register & appearance" />
    <div class="tb-settings">
      <nav class="tb-set-nav">
        <button v-for="t in tabs" :key="t.id" :class="['tb-set-navitem', tab === t.id ? 'is-active' : '']" @click="tab = t.id">
          <TbIcon :name="t.icon" :size="18" /> {{ t.label }}
        </button>
      </nav>

      <div class="tb-panel">
        <!-- Appearance -->
        <div v-if="tab === 'appearance'" class="tb-set-section">
          <div class="tb-setrow">
            <div class="tb-setrow-main"><b>Theme</b><span>Blue &amp; white in daylight, vibrant purple in the dark.</span></div>
            <TbSegmented
              :model-value="theme"
              :options="[
                { value: 'light', label: 'Light', icon: 'sun' },
                { value: 'dark', label: 'Dark', icon: 'moon' },
              ]"
              @update:model-value="setTheme($event as 'light' | 'dark')"
            />
          </div>
          <div class="tb-setrow">
            <div class="tb-setrow-main"><b>Accent — Light</b><span>Primary brand color used in light mode.</span></div>
            <div class="tb-swatchrow">
              <button
                v-for="c in blues"
                :key="c"
                :title="c"
                :class="['tb-swatch', accentLight === c ? 'is-on' : '']"
                :style="{ background: c }"
                @click="setAccent('light', c)"
              />
            </div>
          </div>
          <div class="tb-setrow">
            <div class="tb-setrow-main"><b>Accent — Dark</b><span>Vibrant color used in dark mode.</span></div>
            <div class="tb-swatchrow">
              <button
                v-for="c in purples"
                :key="c"
                :title="c"
                :class="['tb-swatch', accentDark === c ? 'is-on' : '']"
                :style="{ background: c }"
                @click="setAccent('dark', c)"
              />
            </div>
          </div>
          <div class="tb-setrow">
            <div class="tb-setrow-main">
              <b>Corner radius</b><span>{{ radius }}px — how round buttons &amp; cards appear.</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="2"
              :value="radius"
              style="width: 180px; accent-color: var(--primary)"
              @input="setRadius(+($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <!-- Store -->
        <div v-else-if="tab === 'store'" class="tb-set-section">
          <div v-for="f in storeFields" :key="f.label" class="tb-setrow">
            <div class="tb-setrow-main">
              <b>{{ f.label }}</b>
            </div>
            <input class="tb-select" :value="f.value" style="width: 240px" />
          </div>
        </div>

        <!-- Payments -->
        <div v-else-if="tab === 'payments'" class="tb-set-section">
          <div class="tb-setrow">
            <div class="tb-setrow-main"><b>Tax rate</b><span>Applied to taxable items at checkout (display estimate).</span></div>
            <input class="tb-select" type="number" min="0" max="100" :value="taxPct" style="width: 120px" @input="onTax($event)" />
          </div>
          <div v-for="p in paymentToggles" :key="p.label" class="tb-setrow">
            <div class="tb-setrow-main" style="display: flex; align-items: center; gap: 12px">
              <span class="tb-set-ic"><TbIcon :name="p.icon" :size="18" /></span>
              <b>{{ p.label }}</b>
            </div>
            <TbToggle v-model="p.on" />
          </div>
        </div>

        <!-- Receipt -->
        <div v-else-if="tab === 'receipt'" class="tb-set-section">
          <div class="tb-setrow">
            <div class="tb-setrow-main"><b>Header text</b></div>
            <input class="tb-select" value="TbPos · Thanks for shopping!" style="width: 280px" />
          </div>
          <div class="tb-setrow">
            <div class="tb-setrow-main"><b>Footer note</b></div>
            <input class="tb-select" value="Returns within 30 days with receipt" style="width: 280px" />
          </div>
          <div v-for="p in receiptToggles" :key="p.label" class="tb-setrow">
            <div class="tb-setrow-main" style="display: flex; align-items: center; gap: 12px">
              <span class="tb-set-ic"><TbIcon :name="p.icon" :size="18" /></span>
              <b>{{ p.label }}</b>
            </div>
            <TbToggle v-model="p.on" />
          </div>
        </div>

        <!-- Staff -->
        <div v-else class="tb-set-section">
          <div v-for="s in staff" :key="s.name" class="tb-setrow">
            <div class="tb-cellprod">
              <div class="tb-set-ava">{{ s.ini }}</div>
              <div class="tb-cellprod-main">
                <b>{{ s.name }}</b
                ><span>{{ s.role }}</span>
              </div>
            </div>
            <TbButton kind="ghost" size="sm" icon-right="chevron">Manage</TbButton>
          </div>
          <div style="padding-top: 16px"><TbButton kind="soft" icon="plus">Add staff member</TbButton></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { useCartStore } from '@/stores/cart';
import TbPageHead from '@/components/ui/TbPageHead.vue';
import TbSegmented from '@/components/ui/TbSegmented.vue';
import TbToggle from '@/components/ui/TbToggle.vue';
import TbButton from '@/components/ui/TbButton.vue';
import TbIcon from '@/components/ui/TbIcon.vue';

const { theme, accentLight, accentDark, radius, setTheme, setAccent, setRadius } = useTheme();
const cart = useCartStore();

const tab = ref('appearance');
const tabs = [
  { id: 'appearance', icon: 'settings', label: 'Appearance' },
  { id: 'store', icon: 'store', label: 'Store' },
  { id: 'payments', icon: 'card', label: 'Payments' },
  { id: 'receipt', icon: 'receipt', label: 'Receipt' },
  { id: 'staff', icon: 'user', label: 'Staff' },
];

const blues = ['#3b82f6', '#2563eb', '#0ea5e9', '#6366f1'];
const purples = ['#b06bff', '#ff5ec9', '#a855f7', '#22d3ee'];

const taxPct = computed(() => Math.round(cart.taxRate * 100));
function onTax(e: Event) {
  const v = Number((e.target as HTMLInputElement).value);
  cart.taxRate = Number.isFinite(v) ? v / 100 : 0;
}

const storeFields = [
  { label: 'Store name', value: 'TbPos' },
  { label: 'Branch', value: 'Downtown' },
  { label: 'Register', value: 'Register 1' },
  { label: 'Address', value: '120 Market St, Suite 4' },
  { label: 'Currency', value: 'USD ($)' },
  { label: 'Timezone', value: 'GMT−5 Eastern' },
];

const paymentToggles = ref([
  { label: 'Accept Cash', icon: 'cash', on: true },
  { label: 'Accept Card', icon: 'card', on: true },
  { label: 'Accept Mobile / QR', icon: 'qr', on: true },
  { label: 'Allow split payments', icon: 'pct', on: false },
  { label: 'Tipping', icon: 'dollar', on: false },
]);

const receiptToggles = ref([
  { label: 'Print automatically', icon: 'print', on: true },
  { label: 'Email receipt option', icon: 'receipt', on: true },
  { label: 'Show QR feedback link', icon: 'qr', on: false },
  { label: 'Include itemized tax', icon: 'pct', on: true },
]);

const staff = [
  { name: 'Alex Rivera', role: 'Manager', ini: 'AR' },
  { name: 'Maya Chen', role: 'Cashier', ini: 'MC' },
  { name: 'Diego Ruiz', role: 'Cashier', ini: 'DR' },
  { name: 'Aisha Khan', role: 'Supervisor', ini: 'AK' },
];
</script>

<style scoped>
.tb-set-ic {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--surface-3);
  color: var(--text-muted);
}
.tb-set-ava {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent-2));
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
}
</style>
