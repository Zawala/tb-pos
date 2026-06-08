<template>
  <TbModal v-if="open" size="sm" icon="user" title="Customer" sub="Attach a customer to this sale" @close="$emit('close')">
    <div class="tb-form">
      <div class="tb-form-row">
        <label class="tb-label">Full name *</label>
        <input ref="nameEl" v-model="form.name" class="tb-input" placeholder="e.g. John Doe" required />
      </div>
      <div class="tb-form-row">
        <label class="tb-label">Phone</label>
        <input v-model="form.phone" class="tb-input" type="tel" placeholder="Optional" />
      </div>
      <div class="tb-form-row">
        <label class="tb-label">Email</label>
        <input v-model="form.email" class="tb-input" type="email" placeholder="Optional" />
      </div>
      <div v-if="current" class="tb-form-row" style="background: var(--primary-soft); border-radius: var(--r); padding: 10px 14px">
        <span style="font-size: 13px; color: var(--primary); font-weight: 600"> Loyalty points: {{ current.loyaltyPoints ?? 0 }} </span>
      </div>
      <p v-if="error" style="color: var(--danger); font-size: 13px; margin: 0">{{ error }}</p>
    </div>

    <template #footer>
      <TbButton v-if="current" kind="ghost" style="color: var(--danger); margin-right: auto" @click="$emit('clear')">
        Remove customer
      </TbButton>
      <TbButton kind="default" @click="$emit('close')">Cancel</TbButton>
      <TbButton kind="primary" icon="check" :disabled="!form.name.trim() || saving" @click="save"> Save </TbButton>
    </template>
  </TbModal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useCustomersStore, type Customer } from '@/stores/customers';
import TbModal from '@/components/ui/TbModal.vue';
import TbButton from '@/components/ui/TbButton.vue';

const props = defineProps<{ open: boolean; current?: Customer | null }>();
const emit = defineEmits<{ close: []; saved: [c: Customer]; clear: [] }>();

const customersStore = useCustomersStore();
const nameEl = ref<HTMLInputElement | null>(null);
const saving = ref(false);
const error = ref('');
const form = ref({ name: '', phone: '', email: '' });

watch(
  () => props.open,
  val => {
    if (val) {
      form.value = {
        name: props.current?.name ?? '',
        phone: props.current?.phone ?? '',
        email: props.current?.email ?? '',
      };
      error.value = '';
      nextTick(() => nameEl.value?.focus());
    }
  },
);

async function save() {
  if (!form.value.name.trim() || saving.value) return;
  saving.value = true;
  error.value = '';
  try {
    const customer = await customersStore.create({
      name: form.value.name.trim(),
      phone: form.value.phone.trim() || undefined,
      email: form.value.email.trim() || undefined,
    });
    emit('saved', customer);
    emit('close');
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.response?.data?.message || 'Failed to save customer';
  } finally {
    saving.value = false;
  }
}
</script>
