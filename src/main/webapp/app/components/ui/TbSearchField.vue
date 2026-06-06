<template>
  <label class="tb-field">
    <TbIcon :name="icon" :size="18" class-name="tb-field-ic" />
    <input :value="modelValue" :placeholder="placeholder" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <button v-if="modelValue" class="tb-field-clear" @click.prevent="$emit('update:modelValue', '')">
      <TbIcon name="x" :size="14" />
    </button>
  </label>
</template>

<script setup lang="ts">
import TbIcon from './TbIcon.vue';

withDefaults(defineProps<{ modelValue: string; placeholder?: string; icon?: string }>(), { placeholder: '', icon: 'search' });
defineEmits<{ 'update:modelValue': [v: string] }>();
</script>
