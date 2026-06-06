<template>
  <div class="py-4">
    <h2 class="text-xl font-semibold mb-4" id="configuration-page-heading" data-cy="configurationPageHeading">Configuration</h2>

    <div v-if="allConfiguration && configuration">
      <div class="mb-4">
        <TextInput type="text" v-model="filtered" placeholder="Filter by prefix..." class="w-full max-w-sm" />
      </div>

      <h3 class="text-base font-semibold mb-2">Spring configuration</h3>
      <div class="overflow-x-auto mb-6">
        <table class="w-full text-sm" aria-describedby="Configuration">
          <thead class="bg-surface-gray-2 text-ink-gray-6">
            <tr>
              <th class="px-3 py-2 text-left w-2/5 cursor-pointer hover:bg-surface-gray-3" @click="changeOrder('prefix')" scope="col">
                Prefix
              </th>
              <th class="px-3 py-2 text-left w-3/5 cursor-pointer hover:bg-surface-gray-3" @click="changeOrder('properties')" scope="col">
                Properties
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in filteredConfiguration" :key="entry.prefix" class="border-t border-outline-gray-1">
              <td class="px-3 py-2 align-top">{{ entry.prefix }}</td>
              <td class="px-3 py-2">
                <div v-for="key in keys(entry.properties)" :key="key" class="flex gap-2 text-xs mb-1">
                  <span class="w-2/5 font-medium text-ink-gray-6">{{ key }}</span>
                  <span class="w-3/5 break-all text-ink-gray-5">{{ entry.properties[key] }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-for="key in keys(allConfiguration)" :key="key" class="mb-4">
        <h4 class="text-sm font-semibold mb-2">{{ key }}</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm" aria-describedby="Properties">
            <thead class="bg-surface-gray-2 text-ink-gray-6">
              <tr>
                <th class="px-3 py-2 text-left w-2/5" scope="col">Property</th>
                <th class="px-3 py-2 text-left w-3/5" scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item of allConfiguration[key]" :key="item.key" class="border-t border-outline-gray-1">
                <td class="px-3 py-2 break-all">{{ item.key }}</td>
                <td class="px-3 py-2 break-all">{{ item.val }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./configuration.component.ts"></script>
