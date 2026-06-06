<template>
  <button
    :class="['tb-toggle', modelValue ? 'is-on' : '']"
    role="switch"
    :aria-checked="modelValue"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="tb-toggle-knob" />
  </button>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>();
defineEmits<{ 'update:modelValue': [v: boolean] }>();
</script>
