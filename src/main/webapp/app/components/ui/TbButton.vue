<template>
  <button :class="['tb-btn', `tb-btn-${kind}`, `tb-btn-${size}`, full ? 'tb-full' : '', className]" :disabled="disabled">
    <TbIcon v-if="icon" :name="icon" :size="size === 'lg' ? 20 : 18" />
    <span v-if="$slots.default"><slot /></span>
    <TbIcon v-if="iconRight" :name="iconRight" :size="size === 'lg' ? 20 : 18" />
  </button>
</template>

<script setup lang="ts">
import TbIcon from './TbIcon.vue';

withDefaults(
  defineProps<{
    kind?: 'default' | 'primary' | 'soft' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
    iconRight?: string;
    full?: boolean;
    disabled?: boolean;
    className?: string;
  }>(),
  { kind: 'default', size: 'md', full: false, disabled: false, className: '' },
);
</script>
