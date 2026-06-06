import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  costPriceUsd: number;
  sellPriceUsd: number;
  reorderLevel: number;
  active: boolean;
  stockQuantity: number;
}

export const useInventoryStore = defineStore('inventory', () => {
  const products = ref<Product[]>([]);
  const categories = ref<string[]>([]);
  const loading = ref(false);

  async function fetchProducts(q?: string, category?: string) {
    loading.value = true;
    try {
      const params: Record<string, string> = {};
      if (q) params.q = q;
      if (category) params.category = category;
      const res = await axios.get('/api/v1/products', { params });
      products.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories() {
    const res = await axios.get('/api/v1/products/categories');
    categories.value = res.data;
  }

  async function createProduct(dto: Omit<Product, 'id' | 'stockQuantity'>) {
    const res = await axios.post('/api/v1/products', dto);
    products.value.unshift(res.data);
    return res.data as Product;
  }

  async function updateProduct(id: string, dto: Partial<Product>) {
    const res = await axios.put(`/api/v1/products/${id}`, dto);
    const idx = products.value.findIndex(p => p.id === id);
    if (idx >= 0) products.value[idx] = res.data;
    return res.data as Product;
  }

  async function adjustStock(productId: string, movementType: 'RECEIVE' | 'ISSUE' | 'ADJUSTMENT', quantity: number, notes?: string) {
    await axios.post('/api/v1/inventory/movements', { productId, movementType, quantity, notes });
    const idx = products.value.findIndex(p => p.id === productId);
    if (idx >= 0) await fetchProducts();
  }

  return { products, categories, loading, fetchProducts, fetchCategories, createProduct, updateProduct, adjustStock };
});
