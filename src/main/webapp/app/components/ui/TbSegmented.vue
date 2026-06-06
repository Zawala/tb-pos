<template>
  <div :class="['tb-seg', `tb-seg-${size}`]" role="tablist">
    <button
      v-for="o in options"
      :key="o.value"
      role="tab"
      :aria-selected="modelValue === o.value"
      :class="['tb-seg-item', modelValue === o.value ? 'is-active' : '']"
      @click="$emit('update:modelValue', o.value)"
    >
      <TbIcon v-if="o.icon" :name="o.icon" :size="16" />
      {{ o.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import TbIcon from './TbIcon.vue';

interface Option {
  value: string;
  label: string;
  icon?: string;
}
withDefaults(defineProps<{ options: Option[]; modelValue: string; size?: 'sm' | 'md' }>(), { size: 'md' });
defineEmits<{ 'update:modelValue': [v: string] }>();
</script>
