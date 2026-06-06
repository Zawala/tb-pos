import { computed, createApp, h, provide } from 'vue';
import { createPinia, storeToRefs } from 'pinia';
import { FrappeUI, setConfig, frappeRequest, Button, Dropdown, Dialog, Badge, TextInput } from 'frappe-ui';

import App from './app.vue';
import router from './router';
import { useStore } from '@/store';
import { setupAxiosInterceptors } from '@/shared/config/axios-interceptor';

import { initFortAwesome } from '@/shared/config/config';
import JhiItemCountComponent from '@/shared/jhi-item-count.vue';
import JhiSortIndicatorComponent from '@/shared/sort/jhi-sort-indicator.vue';
import { useLoginModal } from '@/account/login-modal';
import AccountService from '@/account/account.service';

import '../content/css/tailwind.css';
import '../content/scss/global.scss';
import { setupOnlineListener } from '@/services/sync';
import { initTheme } from '@/composables/useTheme';

initTheme();

const pinia = createPinia();

setConfig('resourceFetcher', frappeRequest);

// jhipster-needle-add-entity-service-to-main-import - JHipster will import entities services here

const app = createApp({
  components: { App },
  setup() {
    const { hideLogin, showLogin } = useLoginModal();
    const store = useStore();
    const accountService = new AccountService(store);
    provide(
      'currentLanguage',
      computed(() => store.account?.langKey ?? navigator.language ?? 'en'),
    );

    router.beforeResolve(async (to, from, next) => {
      hideLogin();

      if (!store.authenticated) {
        await accountService.update();
      }
      // Authenticated users landing on the marketing home go straight to the POS.
      if (to.path === '/' && store.authenticated) {
        next({ path: '/pos' });
        return;
      }
      if (to.meta?.authorities && to.meta.authorities.length > 0) {
        const value = await accountService.hasAnyAuthorityAndCheckAuth(to.meta.authorities);
        if (!value) {
          if (from.path !== '/forbidden') {
            next({ path: '/forbidden' });
            return;
          }
        }
      }
      next();
    });

    setupAxiosInterceptors(
      error => {
        const url = error.response?.config?.url;
        const status = error.status || error.response.status;
        if (status === 401) {
          store.logout();
          if (!url.endsWith('api/account') && !url.endsWith('api/authenticate')) {
            showLogin();
            return;
          }
        }
        return Promise.reject(error);
      },
      error => {
        return Promise.reject(error);
      },
    );

    const { authenticated } = storeToRefs(store);
    provide('authenticated', authenticated);
    provide(
      'currentUsername',
      computed(() => store.account?.login),
    );

    provide('accountService', accountService);
    // jhipster-needle-add-entity-service-to-main - JHipster will import entities services here
  },
  render: () => h(App),
});

setupOnlineListener();
initFortAwesome(app);

app
  .component('jhi-item-count', JhiItemCountComponent)
  .component('jhi-sort-indicator', JhiSortIndicatorComponent)
  .component('Button', Button)
  .component('Dropdown', Dropdown)
  .component('Dialog', Dialog)
  .component('Badge', Badge)
  .component('TextInput', TextInput)
  .use(router)
  .use(pinia)
  .use(FrappeUI, { socketio: false })
  .mount('#app');
