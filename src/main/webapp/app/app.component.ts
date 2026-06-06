import { computed, defineComponent, provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { Toasts } from 'frappe-ui';

import { useLoginModal } from '@/account/login-modal';
import LoginForm from '@/account/login-form/login-form.vue';
import Ribbon from '@/core/ribbon/ribbon.vue';
import TbSidebar from '@/core/tb-shell/TbSidebar.vue';
import TbIcon from '@/components/ui/TbIcon.vue';
import TbIconButton from '@/components/ui/TbIconButton.vue';
import TbCurrencyToggle from '@/components/ui/TbCurrencyToggle.vue';
import { useStore } from '@/store';
import { useTheme } from '@/composables/useTheme';
import { useAlertService } from '@/shared/alert/alert.service';
import '@/shared/config/dayjs';

const TITLES: Record<string, string> = {
  '/pos': 'Point of Sale',
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/inventory': 'Inventory',
  '/orders': 'Orders',
  '/customers': 'Customers',
  '/settings': 'Settings',
  '/reports': 'Reports',
};

export default defineComponent({
  name: 'App',
  components: {
    ribbon: Ribbon,
    'login-form': LoginForm,
    'tb-sidebar': TbSidebar,
    TbIcon,
    TbIconButton,
    TbCurrencyToggle,
    Toasts,
  },
  setup() {
    provide('alertService', useAlertService());
    const { loginModalOpen } = storeToRefs(useLoginModal());
    const store = useStore();
    const route = useRoute();
    const { theme, toggle } = useTheme();

    const authenticated = computed(() => store.authenticated);
    const username = computed(() => (store.account?.login as string) ?? '');
    const userInitial = computed(() => (username.value || '?').charAt(0).toUpperCase());
    const pageTitle = computed(() => {
      const match = Object.keys(TITLES).find(p => route.path.startsWith(p));
      return match ? TITLES[match] : 'TbPos';
    });

    return {
      loginModalOpen,
      authenticated,
      username,
      userInitial,
      pageTitle,
      theme,
      toggleTheme: toggle,
    };
  },
});
