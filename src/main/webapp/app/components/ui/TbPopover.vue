<template>
  <span class="tb-pop-anchor" ref="root">
    <span @click.stop="open = !open">
      <slot name="trigger" />
    </span>
    <div v-if="open" :class="['tb-popover', `align-${align}`]" :style="{ minWidth: width + 'px' }">
      <slot :close="() => (open = false)" />
    </div>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

withDefaults(
  defineProps<{
    align?: 'left' | 'right';
    width?: number;
  }>(),
  { align: 'left', width: 260 },
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false;
}

watch(open, val => {
  if (val) document.addEventListener('mousedown', onDocClick);
  else document.removeEventListener('mousedown', onDocClick);
});

onUnmounted(() => document.removeEventListener('mousedown', onDocClick));
</script>
