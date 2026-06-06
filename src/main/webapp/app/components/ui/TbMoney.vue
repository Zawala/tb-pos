<template>
  <span :class="['tnum', className]">{{ format(value) }}</span>
</template>

<script setup lang="ts">
import { useCurrency } from '@/composables/useCurrency';

withDefaults(defineProps<{ value: number; className?: string }>(), { className: '' });
const { format } = useCurrency();
</script>
