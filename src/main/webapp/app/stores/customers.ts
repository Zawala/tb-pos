import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  loyaltyPoints: number;
  totalSpendUsd: number | null;
}

export const useCustomersStore = defineStore('customers', () => {
  const results = ref<Customer[]>([]);
  const loading = ref(false);

  async function search(q: string) {
    loading.value = true;
    try {
      const res = await axios.get('/api/v1/customers', { params: { q } });
      results.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function getById(id: string): Promise<Customer> {
    const res = await axios.get(`/api/v1/customers/${id}`);
    return res.data;
  }

  async function create(dto: { name: string; phone?: string; email?: string }): Promise<Customer> {
    const res = await axios.post('/api/v1/customers', dto);
    return res.data;
  }

  async function redeemPoints(id: string, points: number) {
    const res = await axios.post(`/api/v1/customers/${id}/redeem`, { points });
    return res.data;
  }

  return { results, loading, search, getById, create, redeemPoints };
});
