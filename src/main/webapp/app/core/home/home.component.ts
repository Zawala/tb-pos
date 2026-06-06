import { type ComputedRef, defineComponent, inject } from 'vue';

export default defineComponent({
  setup() {
    const authenticated = inject<ComputedRef<boolean>>('authenticated');
    const username = inject<ComputedRef<string>>('currentUsername');

    const demoCredentials = [
      { role: 'Administrator', login: 'admin', password: 'admin', badge: 'Admin', badgeTheme: 'red' },
      { role: 'User', login: 'user', password: 'user', badge: 'User', badgeTheme: 'blue' },
    ];

    return {
      authenticated,
      username,
      demoCredentials,
    };
  },
});
