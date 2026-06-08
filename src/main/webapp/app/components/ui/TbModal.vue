<template>
  <div class="tb-overlay" @click="closeOnBackdrop && $emit('close')">
    <div :class="['tb-modal', `size-${size}`]" @click.stop role="dialog" aria-modal="true">
      <div v-if="title" class="tb-modal-head">
        <div style="display: flex; align-items: center; gap: 12px">
          <span v-if="icon" class="tb-modal-icon-badge">
            <TbIcon :name="icon" :size="20" />
          </span>
          <div>
            <h2>{{ title }}</h2>
            <div v-if="sub" class="sub">{{ sub }}</div>
          </div>
        </div>
        <TbIconButton name="x" kind="ghost" @click="$emit('close')" />
      </div>
      <div class="tb-modal-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="tb-modal-foot">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import TbIcon from './TbIcon.vue';
import TbIconButton from './TbIconButton.vue';

withDefaults(
  defineProps<{
    title?: string;
    sub?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    icon?: string;
    closeOnBackdrop?: boolean;
  }>(),
  { size: 'md', closeOnBackdrop: true },
);

const emit = defineEmits<{ close: [] }>();

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<style scoped>
.tb-modal-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: var(--primary-soft);
  color: var(--primary);
  flex: none;
}
</style>
