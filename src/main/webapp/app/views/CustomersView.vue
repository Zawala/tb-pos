<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Customers</h2>
      <Button @click="showCreate = true">+ Customer</Button>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQ"
        type="text"
        placeholder="Search by name or phone…"
        class="border border-outline-gray-2 rounded px-3 py-2 text-sm w-80"
        @input="onSearch"
      />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-outline-gray-2 text-left text-ink-gray-4">
            <th class="py-2 px-3">Name</th>
            <th class="py-2 px-3">Phone</th>
            <th class="py-2 px-3">Email</th>
            <th class="py-2 px-3 text-right">Loyalty Points</th>
            <th class="py-2 px-3 text-right">Total Spend</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in customersStore.results" :key="c.id" class="border-b border-outline-gray-1 hover:bg-surface-gray-1">
            <td class="py-2 px-3 font-medium">{{ c.name }}</td>
            <td class="py-2 px-3 text-ink-gray-4">{{ c.phone || '—' }}</td>
            <td class="py-2 px-3 text-ink-gray-4">{{ c.email || '—' }}</td>
            <td class="py-2 px-3 text-right font-medium">{{ c.loyaltyPoints }}</td>
            <td class="py-2 px-3 text-right">${{ c.totalSpendUsd?.toFixed(2) ?? '0.00' }}</td>
          </tr>
          <tr v-if="customersStore.results.length === 0">
            <td colspan="5" class="py-8 text-center text-ink-gray-4">Search for customers above</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog v-model="showCreate" :options="{ title: 'New Customer' }">
      <template #body>
        <div class="flex flex-col gap-3 p-4">
          <input v-model="newCustomer.name" placeholder="Name *" class="border border-outline-gray-2 rounded px-3 py-2 text-sm" />
          <input v-model="newCustomer.phone" placeholder="Phone" class="border border-outline-gray-2 rounded px-3 py-2 text-sm" />
          <input
            v-model="newCustomer.email"
            placeholder="Email"
            type="email"
            class="border border-outline-gray-2 rounded px-3 py-2 text-sm"
          />
          <p v-if="createError" class="text-red-500 text-sm">{{ createError }}</p>
        </div>
      </template>
      <template #actions>
        <Button variant="subtle" @click="showCreate = false">Cancel</Button>
        <Button :loading="creating" @click="submitCreate">Create</Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCustomersStore } from '@/stores/customers';

const customersStore = useCustomersStore();
const searchQ = ref('');
const showCreate = ref(false);
const creating = ref(false);
const createError = ref('');
const newCustomer = ref({ name: '', phone: '', email: '' });

let debounce: ReturnType<typeof setTimeout>;
function onSearch() {
  clearTimeout(debounce);
  debounce = setTimeout(() => customersStore.search(searchQ.value), 300);
}

async function submitCreate() {
  creating.value = true;
  createError.value = '';
  try {
    await customersStore.create(newCustomer.value);
    showCreate.value = false;
    newCustomer.value = { name: '', phone: '', email: '' };
    customersStore.search('');
  } catch (e: any) {
    createError.value = e?.response?.data?.detail || 'Failed to create customer';
  } finally {
    creating.value = false;
  }
}
</script>
