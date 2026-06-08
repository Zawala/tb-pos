<template>
  <span class="tb-pop-anchor" ref="root">
    <span @click.stop="open = !open">
      <slot name="trigger" />
    </span>
    <div
      v-if="open"
      :class="['tb-menu', `align-${align}`, up ? 'up' : '']"
      :style="width ? { minWidth: typeof width === 'number' ? width + 'px' : width } : undefined"
    >
      <template v-for="(it, i) in items" :key="i">
        <div v-if="it.divider" class="tb-menu-div" />
        <div v-else-if="it.header" class="tb-menu-label">{{ it.label }}</div>
        <button
          v-else
          :class="['tb-menu-item', it.danger ? 'danger' : '']"
          @click="
            open = false;
            it.onClick?.();
          "
        >
          <TbIcon v-if="it.icon" :name="it.icon" :size="17" />
          <span>{{ it.label }}</span>
          <TbIcon v-if="it.checked" name="check" :size="16" class="tb-check" />
          <span v-if="it.kbd" class="kbd">{{ it.kbd }}</span>
        </button>
      </template>
    </div>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import TbIcon from './TbIcon.vue';

export interface MenuItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  danger?: boolean;
  kbd?: string;
  checked?: boolean;
  divider?: boolean;
  header?: boolean;
}

withDefaults(
  defineProps<{
    items: MenuItem[];
    align?: 'left' | 'right';
    up?: boolean;
    width?: number | string;
  }>(),
  { align: 'left', up: false },
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false;
}
function onDocKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false;
}

watch(open, val => {
  if (val) {
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onDocKey);
  } else {
    document.removeEventListener('mousedown', onDocClick);
    document.removeEventListener('keydown', onDocKey);
  }
});

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocClick);
  document.removeEventListener('keydown', onDocKey);
});
</script>
