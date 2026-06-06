<template>
  <div class="tb-pagehead">
    <div>
      <h1 class="tb-h1">{{ title }}</h1>
      <p v-if="sub" class="tb-sub">{{ sub }}</p>
    </div>
    <div v-if="$slots.default" class="tb-pagehead-actions"><slot /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; sub?: string }>();
</script>
