<template>
  <TbModal v-if="open" size="md" icon="tag" title="Add product" sub="Create a new catalog item" @close="$emit('close')">
    <form class="tb-form" @submit.prevent="save">
      <div class="tb-form-row">
        <label class="tb-label">Product name *</label>
        <input ref="nameEl" v-model="form.name" class="tb-input" placeholder="e.g. Coca-Cola 500ml" required />
      </div>
      <div class="tb-form-row two">
        <div class="tb-form-row">
          <label class="tb-label">Sell price (USD) *</label>
          <input v-model.number="form.sellPriceUsd" class="tb-input" type="number" step="0.01" min="0" placeholder="0.00" required />
        </div>
        <div class="tb-form-row">
          <label class="tb-label">Cost price (USD)</label>
          <input v-model.number="form.costPriceUsd" class="tb-input" type="number" step="0.01" min="0" placeholder="0.00" />
        </div>
      </div>
      <div class="tb-form-row two">
        <div class="tb-form-row">
          <label class="tb-label">Category</label>
          <input v-model="form.category" class="tb-input" placeholder="e.g. Beverages" list="cat-list" />
          <datalist id="cat-list">
            <option v-for="c in categories" :key="c" :value="c" />
          </datalist>
        </div>
        <div class="tb-form-row">
          <label class="tb-label">SKU</label>
          <input v-model="form.sku" class="tb-input" placeholder="e.g. BEV-001" />
        </div>
      </div>
      <div class="tb-form-row">
        <label class="tb-label">Opening stock</label>
        <input v-model.number="form.stockQuantity" class="tb-input" type="number" min="0" placeholder="0" />
      </div>
      <div class="tb-form-row">
        <label class="tb-label">Reorder level</label>
        <input v-model.number="form.reorderLevel" class="tb-input" type="number" min="0" placeholder="5" />
      </div>
      <p v-if="error" style="color: var(--danger); font-size: 13px; margin: 0">{{ error }}</p>
    </form>
    <template #footer>
      <TbButton kind="default" @click="$emit('close')">Cancel</TbButton>
      <TbButton kind="primary" icon="check" :disabled="!form.name.trim() || !form.sellPriceUsd" @click="save"> Save product </TbButton>
    </template>
  </TbModal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useInventoryStore } from '@/stores/inventory';
import TbModal from '@/components/ui/TbModal.vue';
import TbButton from '@/components/ui/TbButton.vue';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: []; saved: [name: string] }>();

const inventory = useInventoryStore();
const { categories } = storeToRefs(inventory);

const nameEl = ref<HTMLInputElement | null>(null);
const saving = ref(false);
const error = ref('');
const form = ref({ name: '', sellPriceUsd: 0, costPriceUsd: 0, category: '', sku: '', stockQuantity: 0, reorderLevel: 5, active: true });

function resetForm() {
  form.value = { name: '', sellPriceUsd: 0, costPriceUsd: 0, category: '', sku: '', stockQuantity: 0, reorderLevel: 5, active: true };
  error.value = '';
}

watch(
  () => props.open,
  val => {
    if (val) {
      resetForm();
      nextTick(() => nameEl.value?.focus());
    }
  },
);

async function save() {
  if (!form.value.name.trim() || !form.value.sellPriceUsd || saving.value) return;
  saving.value = true;
  error.value = '';
  try {
    const p = await inventory.createProduct({
      name: form.value.name.trim(),
      sku: form.value.sku.trim() || form.value.name.trim().toUpperCase().replace(/\s+/g, '-').slice(0, 16),
      category: form.value.category.trim() || null,
      costPriceUsd: form.value.costPriceUsd,
      sellPriceUsd: form.value.sellPriceUsd,
      reorderLevel: form.value.reorderLevel,
      active: true,
    });
    emit('saved', p.name);
    emit('close');
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.response?.data?.message || 'Failed to save product';
  } finally {
    saving.value = false;
  }
}
</script>
