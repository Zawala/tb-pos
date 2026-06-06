<template>
  <div class="flex flex-col gap-4">
    <div v-if="currentHealth && currentHealth.details">
      <h5 class="text-sm font-semibold mb-2">Properties</h5>
      <div class="overflow-x-auto">
        <table class="w-full text-sm" aria-describedby="Health">
          <thead class="bg-surface-gray-2 text-ink-gray-6">
            <tr>
              <th class="px-3 py-2 text-left" scope="col">Name</th>
              <th class="px-3 py-2 text-left" scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in currentHealth.details.details" :key="index" class="border-t border-outline-gray-1">
              <td class="px-3 py-2">{{ index }}</td>
              <td class="px-3 py-2">{{ readableValue(item) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="currentHealth && currentHealth.error">
      <h4 class="text-sm font-semibold mb-1">Error</h4>
      <pre class="text-xs bg-surface-gray-2 p-3 rounded overflow-x-auto">{{ currentHealth.error }}</pre>
    </div>
  </div>
</template>

<script lang="ts" src="./health-modal.component.ts"></script>
