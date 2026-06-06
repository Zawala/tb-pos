<template>
  <div class="tb-stat">
    <div class="tb-stat-top">
      <span class="tb-stat-label">{{ label }}</span>
      <span
        class="tb-stat-ic"
        :style="accent ? { color: accent, background: `color-mix(in srgb, ${accent} 14%, transparent)` } : undefined"
      >
        <TbIcon :name="icon" :size="18" />
      </span>
    </div>
    <div class="tb-stat-value tnum">{{ value }}</div>
    <div v-if="delta != null" :class="['tb-stat-delta', deltaDir === 'down' ? 'is-down' : 'is-up']">
      <TbIcon :name="deltaDir === 'down' ? 'arrowdown' : 'arrowup'" :size="14" />
      <span class="tnum">{{ delta }}</span>
      <span class="tb-stat-delta-lbl">vs last week</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import TbIcon from './TbIcon.vue';

defineProps<{ label: string; value: string | number; icon: string; accent?: string; delta?: string | null; deltaDir?: 'up' | 'down' }>();
</script>
