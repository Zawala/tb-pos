<template>
  <nav class="tb-side">
    <div class="tb-brand">T</div>

    <button v-for="n in nav" :key="n.id" :class="['tb-navitem', isActive(n.to) ? 'is-active' : '']" @click="router.push(n.to)">
      <span style="position: relative">
        <TbIcon :name="n.icon" :size="22" />
        <span v-if="n.id === 'checkout' && cartCount > 0" class="tb-side-badge">{{ cartCount }}</span>
      </span>
      {{ n.label }}
    </button>

    <div class="tb-side-foot">
      <TbIconButton :name="theme === 'dark' ? 'sun' : 'moon'" kind="outline" title="Toggle theme" @click="toggle" />
      <Dropdown :options="accountMenuItems" placement="right">
        <template #default>
          <div class="tb-side-avatar" :title="username || 'Account'">{{ userInitial }}</div>
        </template>
      </Dropdown>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '@/store';
import { useTheme } from '@/composables/useTheme';
import { useCartStore } from '@/stores/cart';
import TbIcon from '@/components/ui/TbIcon.vue';
import TbIconButton from '@/components/ui/TbIconButton.vue';

const router = useRouter();
const route = useRoute();
const store = useStore();
const cart = useCartStore();
const { theme, toggle } = useTheme();

const nav = [
  { id: 'checkout', icon: 'cart', label: 'Sell', to: '/pos' },
  { id: 'dashboard', icon: 'chart', label: 'Dashboard', to: '/dashboard' },
  { id: 'products', icon: 'tag', label: 'Products', to: '/products' },
  { id: 'inventory', icon: 'box', label: 'Inventory', to: '/inventory' },
  { id: 'orders', icon: 'receipt', label: 'Orders', to: '/orders' },
  { id: 'customers', icon: 'user', label: 'Customers', to: '/customers' },
  { id: 'settings', icon: 'settings', label: 'Settings', to: '/settings' },
];

const cartCount = computed(() => cart.items.reduce((s, l) => s + l.quantity, 0));
const username = computed(() => store.account?.login as string | undefined);
const userInitial = computed(() => (username.value ?? '?').charAt(0).toUpperCase());

function isActive(to: string): boolean {
  return route.path === to || route.path.startsWith(to + '/');
}

const logout = () => {
  localStorage.removeItem('jhi-authenticationToken');
  sessionStorage.removeItem('jhi-authenticationToken');
  store.logout();
  if (router.currentRoute.value.path !== '/') router.push('/');
};

const accountMenuItems = computed(() => [
  { label: 'Account settings', onClick: () => router.push('/account/settings') },
  { label: 'Password', onClick: () => router.push('/account/password') },
  { label: 'User management', onClick: () => router.push('/admin/user-management') },
  { label: 'Metrics', onClick: () => router.push('/admin/metrics') },
  { label: 'Health', onClick: () => router.push('/admin/health') },
  { label: 'Sign out', onClick: logout },
]);
</script>

<style scoped>
.tb-side-badge {
  position: absolute;
  top: -7px;
  right: -9px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--danger);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: grid;
  place-items: center;
  line-height: 1;
}
</style>
