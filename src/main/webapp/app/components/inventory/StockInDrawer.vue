<template>
  <TbDrawer :open="open" title="Receive stock" sub="Add incoming units to inventory" @close="$emit('close')">
    <div class="tb-form">
      <div class="tb-form-row">
        <label class="tb-label">Product *</label>
        <select v-model="selectedId" class="tb-input" style="height: 46px">
          <option value="">Select product…</option>
          <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>

      <div v-if="selected" class="tb-product-preview">
        <TbTile :name="selected.name" :seed="selected.sku" size="sm" />
        <div class="tb-product-preview-info">
          <b>{{ selected.name }}</b>
          <span>{{ selected.category || '—' }} · {{ selected.sku }}</span>
          <span style="color: var(--text-muted); font-size: 12px">Current stock: {{ selected.stockQuantity }} units</span>
        </div>
      </div>

      <div class="tb-form-row">
        <label class="tb-label">Quantity received *</label>
        <input ref="qtyEl" v-model.number="qty" class="tb-input" type="number" min="1" placeholder="0" />
      </div>
      <div class="tb-form-row two">
        <div class="tb-form-row">
          <label class="tb-label">Unit cost (USD)</label>
          <input v-model.number="unitCost" class="tb-input" type="number" step="0.01" min="0" placeholder="0.00" />
        </div>
        <div class="tb-form-row">
          <label class="tb-label">Supplier</label>
          <input v-model="supplier" class="tb-input" placeholder="Optional" />
        </div>
      </div>
      <div class="tb-form-row">
        <label class="tb-label">Note</label>
        <textarea v-model="note" class="tb-input" placeholder="Optional note…" />
      </div>
      <p v-if="error" style="color: var(--danger); font-size: 13px; margin: 0">{{ error }}</p>
    </div>

    <template #footer>
      <TbButton kind="default" @click="$emit('close')">Cancel</TbButton>
      <TbButton kind="primary" icon="package" :disabled="!selectedId || !qty || saving" @click="save">
        Receive {{ qty || '' }} units
      </TbButton>
    </template>
  </TbDrawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useInventoryStore, type Product } from '@/stores/inventory';
import TbDrawer from '@/components/ui/TbDrawer.vue';
import TbButton from '@/components/ui/TbButton.vue';
import TbTile from '@/components/ui/TbTile.vue';

const props = defineProps<{ open: boolean; initialProduct?: Product | null }>();
const emit = defineEmits<{ close: []; saved: [name: string, qty: number] }>();

const inventory = useInventoryStore();
const { products } = storeToRefs(inventory);

const qtyEl = ref<HTMLInputElement | null>(null);
const selectedId = ref('');
const qty = ref<number | null>(null);
const unitCost = ref<number | null>(null);
const supplier = ref('');
const note = ref('');
const saving = ref(false);
const error = ref('');

const selected = computed(() => products.value.find(p => p.id === selectedId.value) ?? null);

watch(
  () => props.open,
  val => {
    if (val) {
      selectedId.value = props.initialProduct?.id ?? '';
      qty.value = null;
      unitCost.value = null;
      supplier.value = '';
      note.value = '';
      error.value = '';
      nextTick(() => qtyEl.value?.focus());
    }
  },
);

watch(
  () => props.initialProduct,
  p => {
    if (p && props.open) selectedId.value = p.id;
  },
);

async function save() {
  if (!selectedId.value || !qty.value || saving.value) return;
  saving.value = true;
  error.value = '';
  try {
    await inventory.adjustStock(selectedId.value, 'RECEIVE', qty.value, note.value || undefined);
    emit('saved', selected.value?.name ?? '', qty.value);
    emit('close');
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.response?.data?.message || 'Failed to receive stock';
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.tb-product-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--r);
  background: var(--surface-2);
}
.tb-product-preview-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13.5px;
}
</style>
