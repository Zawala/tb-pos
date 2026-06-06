import { ref, computed } from 'vue';
import axios from 'axios';

export type Currency = 'USD' | 'ZIG';

const activeCurrency = ref<Currency>('USD');
const zigRate = ref<number>(36.0);

let rateLoaded = false;

async function loadRate() {
  if (rateLoaded) return;
  try {
    const res = await axios.get('/api/v1/exchange-rates/current');
    const er = res.data;
    if (er?.rate) zigRate.value = Number(er.rate);
    rateLoaded = true;
  } catch {
    // fallback rate stays
  }
}

export function useCurrency() {
  loadRate();

  function convert(usdAmount: number): number {
    if (activeCurrency.value === 'USD') return usdAmount;
    return usdAmount * zigRate.value;
  }

  function format(usdAmount: number): string {
    const display = convert(usdAmount);
    if (activeCurrency.value === 'USD') {
      return `$${display.toFixed(2)}`;
    }
    return `ZiG ${display.toFixed(2)}`;
  }

  function toggle() {
    activeCurrency.value = activeCurrency.value === 'USD' ? 'ZIG' : 'USD';
  }

  function refreshRate() {
    rateLoaded = false;
    loadRate();
  }

  return {
    activeCurrency: computed(() => activeCurrency.value),
    zigRate: computed(() => zigRate.value),
    convert,
    format,
    toggle,
    refreshRate,
  };
}
