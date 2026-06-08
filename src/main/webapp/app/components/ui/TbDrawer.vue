<template>
  <template v-if="open">
    <div class="tb-drawer-scrim" @click="$emit('close')" />
    <aside :class="['tb-drawer', side]" role="dialog" aria-modal="true">
      <div class="tb-drawer-head">
        <div>
          <h2>{{ title }}</h2>
          <div v-if="sub" class="sub">{{ sub }}</div>
        </div>
        <TbIconButton name="x" kind="ghost" @click="$emit('close')" />
      </div>
      <div class="tb-drawer-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="tb-drawer-foot">
        <slot name="footer" />
      </div>
    </aside>
  </template>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import TbIconButton from './TbIconButton.vue';

withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    sub?: string;
    side?: 'right' | 'left';
  }>(),
  { side: 'right' },
);

const emit = defineEmits<{ close: [] }>();

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>
