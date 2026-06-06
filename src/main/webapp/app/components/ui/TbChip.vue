<template>
  <span :class="['tb-chip', `tb-chip-${tone}`, className]"><slot /></span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'; className?: string }>(), {
  tone: 'neutral',
  className: '',
});
</script>
