<template>
  <div class="tb-bars" :style="{ height: height + 'px' }">
    <div v-for="(v, i) in values" :key="i" class="tb-bar-col">
      <div class="tb-bar-track">
        <div class="tb-bar-fill" :style="{ height: (v / max) * 100 + '%', background: accent }">
          <span class="tb-bar-tip tnum">{{ format(v) }}</span>
        </div>
      </div>
      <span class="tb-bar-lbl">{{ labels[i] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCurrency } from '@/composables/useCurrency';

const props = withDefaults(defineProps<{ labels: (string | number)[]; values: number[]; accent: string; height?: number }>(), {
  height: 150,
});
const { format } = useCurrency();
const max = computed(() => Math.max(...props.values, 1));
</script>
