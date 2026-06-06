<template>
  <button class="tb-cur-toggle" :title="`Switch to ${activeCurrency === 'USD' ? 'ZiG' : 'USD'}`" @click="toggle">
    <span :class="['tb-cur-opt', activeCurrency === 'USD' ? 'is-on' : '']">USD</span>
    <span :class="['tb-cur-opt', activeCurrency === 'ZIG' ? 'is-on' : '']">ZiG</span>
  </button>
</template>

<script setup lang="ts">
import { useCurrency } from '@/composables/useCurrency';

const { activeCurrency, toggle } = useCurrency();
</script>

<style scoped>
.tb-cur-toggle {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 44px;
  padding: 4px;
  border-radius: var(--r-pill);
  border: 1px solid var(--border-strong);
  background: var(--surface);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--speed) var(--ease);
}
.tb-cur-toggle:hover {
  border-color: var(--text-subtle);
  box-shadow: var(--shadow-sm);
}
.tb-cur-opt {
  display: grid;
  place-items: center;
  height: 34px;
  padding: 0 12px;
  border-radius: var(--r-pill);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-subtle);
  transition: all var(--speed) var(--ease);
}
.tb-cur-opt.is-on {
  background: var(--primary-soft);
  color: var(--primary);
}
[data-theme='dark'] .tb-cur-opt.is-on {
  color: var(--accent-2);
}
</style>
