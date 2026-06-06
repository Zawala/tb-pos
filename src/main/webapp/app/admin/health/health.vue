<template>
  <div class="py-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold" id="health-page-heading" data-cy="healthPageHeading">Health Checks</h2>
      <Button variant="solid" icon-left="refresh-cw" label="Refresh" @click="refresh()" :disabled="updatingHealth" />
    </div>

    <div class="overflow-x-auto">
      <table id="healthCheck" class="w-full text-sm" aria-describedby="Health check">
        <thead class="bg-surface-gray-2 text-ink-gray-6">
          <tr>
            <th class="px-3 py-2 text-left" scope="col">Service name</th>
            <th class="px-3 py-2 text-center" scope="col">Status</th>
            <th class="px-3 py-2 text-center" scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="health of healthData" :key="health.name" class="border-t border-outline-gray-1 hover:bg-surface-gray-1">
            <td class="px-3 py-2 capitalize">{{ baseName(health.name) }} {{ subSystemName(health.name) }}</td>
            <td class="px-3 py-2 text-center">
              <Badge :theme="getBadgeClass(health.status)" variant="subtle" :label="health.status" />
            </td>
            <td class="px-3 py-2 text-center">
              <Button v-if="health.details || health.error" variant="ghost" size="sm" icon="eye" @click="showHealth(health)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog
      v-model="healthModalOpen"
      :options="{ title: currentHealth ? baseName(currentHealth.name) + ' ' + subSystemName(currentHealth.name) : '' }"
    >
      <template #body-content>
        <health-modal :current-health="currentHealth" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" src="./health.component.ts"></script>
