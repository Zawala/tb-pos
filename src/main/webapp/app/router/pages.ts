const POSView = () => import('@/views/POSView.vue');
const DashboardView = () => import('@/views/DashboardView.vue');
const ProductsView = () => import('@/views/ProductsView.vue');
const InventoryView = () => import('@/views/InventoryView.vue');
const OrdersView = () => import('@/views/OrdersView.vue');
const CustomersView = () => import('@/views/CustomersView.vue');
const ReportsView = () => import('@/views/ReportsView.vue');
const SettingsView = () => import('@/views/SettingsView.vue');

const STAFF = ['ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_USER'];
const MANAGER = ['ROLE_MANAGER', 'ROLE_ADMIN'];

export default [
  {
    path: '/pos',
    name: 'POS',
    component: POSView,
    meta: { authorities: STAFF },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { authorities: MANAGER },
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { authorities: STAFF },
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: InventoryView,
    meta: { authorities: MANAGER },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersView,
    meta: { authorities: STAFF },
  },
  {
    path: '/customers',
    name: 'Customers',
    component: CustomersView,
    meta: { authorities: STAFF },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { authorities: MANAGER },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { authorities: STAFF },
  },
];
