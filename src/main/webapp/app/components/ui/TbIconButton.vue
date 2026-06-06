<template>
  <button :class="['tb-iconbtn', `tb-iconbtn-${kind}`, className]" :title="title">
    <TbIcon :name="name" :size="size" />
  </button>
</template>

<script setup lang="ts">
import TbIcon from './TbIcon.vue';

withDefaults(defineProps<{ name: string; kind?: 'ghost' | 'outline'; size?: number; title?: string; className?: string }>(), {
  kind: 'ghost',
  size: 20,
  className: '',
});
</script>
