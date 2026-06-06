import { type Ref, defineComponent, inject, ref } from 'vue';

import HealthService from './health.service';
import JhiHealthModal from './health-modal.vue';

export default defineComponent({
  name: 'JhiHealth',
  components: {
    'health-modal': JhiHealthModal,
  },
  setup() {
    const healthService = inject('healthService', () => new HealthService(), true);

    const healthData: Ref<any> = ref(null);
    const currentHealth: Ref<any> = ref(null);
    const updatingHealth = ref(false);
    const healthModalOpen = ref(false);

    return {
      healthService,
      healthData,
      currentHealth,
      updatingHealth,
      healthModalOpen,
    };
  },
  mounted(): void {
    this.refresh();
  },
  methods: {
    baseName(name: any): any {
      return this.healthService.getBaseName(name);
    },
    getBadgeClass(statusState: any): string {
      return statusState === 'UP' ? 'green' : 'red';
    },
    refresh(): void {
      this.updatingHealth = true;
      this.healthService
        .checkHealth()
        .then(res => {
          this.healthData = this.healthService.transformHealthData(res.data);
          this.updatingHealth = false;
        })
        .catch(error => {
          if (error.status === 503) {
            this.healthData = this.healthService.transformHealthData(error.error);
          }
          this.updatingHealth = false;
        });
    },
    showHealth(health: any): void {
      this.currentHealth = health;
      this.healthModalOpen = true;
    },
    subSystemName(name: string): string {
      return this.healthService.getSubSystemName(name);
    },
  },
});
