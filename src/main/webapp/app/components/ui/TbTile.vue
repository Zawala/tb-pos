<template>
  <div :class="['tb-tile', 'tb-tile-' + size, className]" :style="tileStyle">
    <span style="font-weight: 700">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '@/composables/useTheme';

const props = withDefaults(defineProps<{ name: string; seed?: string | null; size?: 'sm' | 'md' | 'lg'; className?: string }>(), {
  size: 'md',
  className: '',
  seed: null,
});

const { theme } = useTheme();

// Deterministic category-tinted placeholder tile (mirrors the wireframe Tile):
// hue derived from a stable hash of the product sku/name so the grid reads as
// colourful even before real product images exist.
const hue = computed(() => {
  const key = props.seed || props.name || 'x';
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash % 360;
});

const initials = computed(() =>
  props.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase(),
);

const tileStyle = computed(() => {
  const h = hue.value;
  const dark = theme.value === 'dark';
  const bg = dark
    ? `linear-gradient(135deg, hsl(${h} 42% 22%), hsl(${h} 38% 15%))`
    : `linear-gradient(135deg, hsl(${h} 70% 93%), hsl(${h} 64% 87%))`;
  const fg = dark ? `hsl(${h} 70% 78%)` : `hsl(${h} 52% 42%)`;
  const stripe = dark ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.5)';
  return {
    background: bg,
    color: fg,
    backgroundImage: `repeating-linear-gradient(45deg, ${stripe} 0 1px, transparent 1px 9px), ${bg}`,
  };
});
</script>
