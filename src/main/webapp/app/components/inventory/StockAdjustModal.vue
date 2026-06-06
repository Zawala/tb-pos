<template>
  <Dialog :options="{ title: `Adjust Stock — ${product?.name ?? ''}` }" v-model="open">
    <template #body>
      <div class="flex flex-col gap-3 p-4">
        <div>
          <label class="text-xs text-ink-gray-4 mb-1 block">Movement Type</label>
          <select v-model="form.movementType" class="w-full border border-outline-gray-2 rounded px-3 py-2 text-sm">
            <option value="RECEIVE">Receive (add stock)</option>
            <option value="ISSUE">Issue (remove stock)</option>
            <option value="ADJUSTMENT">Adjustment (set quantity)</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-ink-gray-4 mb-1 block">Quantity</label>
          <input
            v-model.number="form.quantity"
            type="number"
            min="1"
            class="w-full border border-outline-gray-2 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label class="text-xs text-ink-gray-4 mb-1 block">Notes</label>
          <input
            v-model="form.notes"
            type="text"
            class="w-full border border-outline-gray-2 rounded px-3 py-2 text-sm"
            placeholder="Optional"
          />
        </div>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      </div>
    </template>
    <template #actions>
      <Button variant="subtle" @click="open = false">Cancel</Button>
      <Button :loading="saving" @click="submit">Save</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useInventoryStore, type Product } from '@/stores/inventory';

const props = defineProps<{ modelValue: boolean; product: Product | null }>();
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>();

const open = ref(props.modelValue);
watch(
  () => props.modelValue,
  v => (open.value = v),
);
watch(open, v => emit('update:modelValue', v));

const inventoryStore = useInventoryStore();
const saving = ref(false);
const error = ref('');
const form = ref({ movementType: 'RECEIVE' as 'RECEIVE' | 'ISSUE' | 'ADJUSTMENT', quantity: 1, notes: '' });

async function submit() {
  if (!props.product) return;
  saving.value = true;
  error.value = '';
  try {
    await inventoryStore.adjustStock(props.product.id, form.value.movementType, form.value.quantity, form.value.notes);
    open.value = false;
  } catch (e: any) {
    error.value = e?.response?.data?.detail || 'Failed to adjust stock';
  } finally {
    saving.value = false;
  }
}
</script>
