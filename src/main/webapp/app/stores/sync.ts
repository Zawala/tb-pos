import { defineStore } from 'pinia';
import { ref } from 'vue';
import { countPendingSales } from '@/services/offline';

export const useSyncStore = defineStore('sync', () => {
  const pendingCount = ref(0);

  async function refreshCount() {
    pendingCount.value = await countPendingSales();
  }

  function increment() {
    pendingCount.value++;
  }
  function decrement() {
    if (pendingCount.value > 0) pendingCount.value--;
  }

  return { pendingCount, refreshCount, increment, decrement };
});
