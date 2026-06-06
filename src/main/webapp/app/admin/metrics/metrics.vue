<template>
  <div class="py-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold" id="metrics-page-heading" data-cy="metricsPageHeading">Application Metrics</h2>
      <Button variant="solid" icon-left="refresh-cw" label="Refresh" @click="refresh()" />
    </div>

    <h3 class="text-base font-semibold mt-4 mb-2">JVM Metrics</h3>
    <div class="grid grid-cols-3 gap-4" v-if="!updatingMetrics">
      <div>
        <h4 class="text-sm font-medium mb-2">Memory</h4>
        <div v-for="(entry, key) of metrics.jvm" :key="key" class="mb-3">
          <div class="text-xs text-ink-gray-5 mb-1">
            <span v-if="entry.max !== -1"
              >{{ key }} ({{ formatNumber1(entry.used / 1048576) }}M / {{ formatNumber1(entry.max / 1048576) }}M)</span
            >
            <span v-else>{{ key }} {{ formatNumber1(entry.used / 1048576) }}M</span>
            <div>Committed: {{ formatNumber1(entry.committed / 1048576) }}M</div>
          </div>
          <div v-if="entry.max !== -1" class="h-2 bg-surface-gray-3 rounded overflow-hidden">
            <div class="h-full bg-surface-green-3 transition-all" :style="{ width: (entry.used / entry.max) * 100 + '%' }"></div>
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-sm font-medium mb-2">Threads</h4>
        <div class="mb-2">
          <div class="flex justify-between text-xs text-ink-gray-5 mb-1">
            <span>Runnable</span><span>{{ threadStats.threadDumpRunnable }}</span>
          </div>
          <div class="h-2 bg-surface-gray-3 rounded overflow-hidden">
            <div
              class="h-full bg-surface-green-3"
              :style="{
                width: threadStats.threadDumpAll ? (threadStats.threadDumpRunnable / threadStats.threadDumpAll) * 100 + '%' : '0%',
              }"
            ></div>
          </div>
        </div>
        <div class="mb-2">
          <div class="flex justify-between text-xs text-ink-gray-5 mb-1">
            <span>Timed Waiting</span><span>{{ threadStats.threadDumpTimedWaiting }}</span>
          </div>
          <div class="h-2 bg-surface-gray-3 rounded overflow-hidden">
            <div
              class="h-full bg-surface-green-3"
              :style="{
                width: threadStats.threadDumpAll ? (threadStats.threadDumpTimedWaiting / threadStats.threadDumpAll) * 100 + '%' : '0%',
              }"
            ></div>
          </div>
        </div>
        <div class="mb-2">
          <div class="flex justify-between text-xs text-ink-gray-5 mb-1">
            <span>Waiting</span><span>{{ threadStats.threadDumpWaiting }}</span>
          </div>
          <div class="h-2 bg-surface-gray-3 rounded overflow-hidden">
            <div
              class="h-full bg-surface-green-3"
              :style="{ width: threadStats.threadDumpAll ? (threadStats.threadDumpWaiting / threadStats.threadDumpAll) * 100 + '%' : '0%' }"
            ></div>
          </div>
        </div>
        <div class="mb-2">
          <div class="flex justify-between text-xs text-ink-gray-5 mb-1">
            <span>Blocked</span><span>{{ threadStats.threadDumpBlocked }}</span>
          </div>
          <div class="h-2 bg-surface-gray-3 rounded overflow-hidden">
            <div
              class="h-full bg-surface-green-3"
              :style="{ width: threadStats.threadDumpAll ? (threadStats.threadDumpBlocked / threadStats.threadDumpAll) * 100 + '%' : '0%' }"
            ></div>
          </div>
        </div>
        <div class="text-xs text-ink-gray-5 flex items-center gap-1">
          Total: {{ threadStats.threadDumpAll }}
          <Button variant="ghost" size="sm" icon="eye" @click="openModal()" />
        </div>
      </div>

      <div>
        <h4 class="text-sm font-medium mb-2">System</h4>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-ink-gray-5">Uptime</span
            ><span>{{ convertMillisecondsToDuration(metrics.processMetrics?.['process.uptime']) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-gray-5">Start time</span><span>{{ formatDate(metrics.processMetrics?.['process.start.time']) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-gray-5">Process CPU</span
            ><span>{{ formatNumber2(100 * metrics.processMetrics?.['process.cpu.usage']) }} %</span>
          </div>
          <div class="h-2 bg-surface-gray-3 rounded overflow-hidden">
            <div
              class="h-full bg-surface-green-3"
              :style="{ width: 100 * (metrics.processMetrics?.['process.cpu.usage'] || 0) + '%' }"
            ></div>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-gray-5">System CPU</span
            ><span>{{ formatNumber2(100 * metrics.processMetrics?.['system.cpu.usage']) }} %</span>
          </div>
          <div class="h-2 bg-surface-gray-3 rounded overflow-hidden">
            <div
              class="h-full bg-surface-green-3"
              :style="{ width: 100 * (metrics.processMetrics?.['system.cpu.usage'] || 0) + '%' }"
            ></div>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-gray-5">CPU count</span><span>{{ metrics.processMetrics?.['system.cpu.count'] }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-gray-5">Load avg 1m</span
            ><span>{{ formatNumber2(metrics.processMetrics?.['system.load.average.1m']) }}</span>
          </div>
        </div>
      </div>
    </div>

    <h3 class="text-base font-semibold mt-6 mb-2">Garbage collections</h3>
    <div v-if="!updatingMetrics && isObjectExisting(metrics, 'garbageCollector')" class="overflow-x-auto">
      <table class="w-full text-sm" aria-describedby="Jvm gc">
        <thead class="bg-surface-gray-2 text-ink-gray-6">
          <tr>
            <th class="px-3 py-2 text-left" scope="col"></th>
            <th class="px-3 py-2 text-right" scope="col">Count</th>
            <th class="px-3 py-2 text-right" scope="col">Mean</th>
            <th class="px-3 py-2 text-right" scope="col">Min</th>
            <th class="px-3 py-2 text-right" scope="col">p50</th>
            <th class="px-3 py-2 text-right" scope="col">p75</th>
            <th class="px-3 py-2 text-right" scope="col">p95</th>
            <th class="px-3 py-2 text-right" scope="col">p99</th>
            <th class="px-3 py-2 text-right" scope="col">Max</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t border-outline-gray-1">
            <td class="px-3 py-2">jvm.gc.pause</td>
            <td class="px-3 py-2 text-right">{{ metrics.garbageCollector['jvm.gc.pause'].count }}</td>
            <td class="px-3 py-2 text-right">{{ formatNumber2(metrics.garbageCollector['jvm.gc.pause'].mean) }}</td>
            <td class="px-3 py-2 text-right">{{ formatNumber2(metrics.garbageCollector['jvm.gc.pause']['0.0']) }}</td>
            <td class="px-3 py-2 text-right">{{ formatNumber2(metrics.garbageCollector['jvm.gc.pause']['0.5']) }}</td>
            <td class="px-3 py-2 text-right">{{ formatNumber2(metrics.garbageCollector['jvm.gc.pause']['0.75']) }}</td>
            <td class="px-3 py-2 text-right">{{ formatNumber2(metrics.garbageCollector['jvm.gc.pause']['0.95']) }}</td>
            <td class="px-3 py-2 text-right">{{ formatNumber2(metrics.garbageCollector['jvm.gc.pause']['0.99']) }}</td>
            <td class="px-3 py-2 text-right">{{ formatNumber2(metrics.garbageCollector['jvm.gc.pause'].max) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="text-base font-semibold mt-6 mb-2">HTTP requests (time in millisecond)</h3>
    <div class="overflow-x-auto" v-if="!updatingMetrics && isObjectExisting(metrics, 'http.server.requests')">
      <table class="w-full text-sm" aria-describedby="Jvm http">
        <thead class="bg-surface-gray-2 text-ink-gray-6">
          <tr>
            <th class="px-3 py-2 text-left" scope="col">Code</th>
            <th class="px-3 py-2 text-left" scope="col">Count</th>
            <th class="px-3 py-2 text-right" scope="col">Mean</th>
            <th class="px-3 py-2 text-right" scope="col">Max</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, key) of metrics['http.server.requests']['percode']" :key="key" class="border-t border-outline-gray-1">
            <td class="px-3 py-2">{{ key }}</td>
            <td class="px-3 py-2">
              <div class="h-2 bg-surface-gray-3 rounded overflow-hidden">
                <div
                  class="h-full bg-surface-green-3"
                  :style="{
                    width: metrics['http.server.requests']['all'].count
                      ? (entry.count / metrics['http.server.requests']['all'].count) * 100 + '%'
                      : '0%',
                  }"
                ></div>
              </div>
              <span class="text-xs">{{ formatNumber1(entry.count) }}</span>
            </td>
            <td class="px-3 py-2 text-right">{{ formatNumber2(filterNaN(entry.mean)) }}</td>
            <td class="px-3 py-2 text-right">{{ formatNumber2(entry.max) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="text-base font-semibold mt-6 mb-2">Endpoints requests (time in millisecond)</h3>
    <div class="overflow-x-auto" v-if="!updatingMetrics">
      <table class="w-full text-sm" aria-describedby="Endpoint">
        <thead class="bg-surface-gray-2 text-ink-gray-6">
          <tr>
            <th class="px-3 py-2 text-left" scope="col">Method</th>
            <th class="px-3 py-2 text-left" scope="col">Endpoint url</th>
            <th class="px-3 py-2 text-right" scope="col">Count</th>
            <th class="px-3 py-2 text-right" scope="col">Mean</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(entry, entryKey) of metrics.services">
            <tr v-for="(method, methodKey) of entry" :key="entryKey + '-' + methodKey" class="border-t border-outline-gray-1">
              <td class="px-3 py-2">{{ methodKey }}</td>
              <td class="px-3 py-2">{{ entryKey }}</td>
              <td class="px-3 py-2 text-right">{{ method.count }}</td>
              <td class="px-3 py-2 text-right">{{ formatNumber2(method.mean) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <h3 class="text-base font-semibold mt-6 mb-2">Cache statistics</h3>
    <div class="overflow-x-auto" v-if="!updatingMetrics && isObjectExisting(metrics, 'cache')">
      <table class="w-full text-sm" aria-describedby="Cache">
        <thead class="bg-surface-gray-2 text-ink-gray-6">
          <tr>
            <th class="px-3 py-2 text-left" scope="col">Cache name</th>
            <th class="px-3 py-2 text-right" scope="col">Hits</th>
            <th class="px-3 py-2 text-right" scope="col">Misses</th>
            <th class="px-3 py-2 text-right" scope="col">Gets</th>
            <th class="px-3 py-2 text-right" scope="col">Puts</th>
            <th class="px-3 py-2 text-right" scope="col">Removals</th>
            <th class="px-3 py-2 text-right" scope="col">Evictions</th>
            <th class="px-3 py-2 text-right" scope="col">Hit %</th>
            <th class="px-3 py-2 text-right" scope="col">Miss %</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, key) of metrics.cache" :key="key" class="border-t border-outline-gray-1">
            <td class="px-3 py-2">{{ key }}</td>
            <td class="px-3 py-2 text-right">{{ entry['cache.gets.hit'] }}</td>
            <td class="px-3 py-2 text-right">{{ entry['cache.gets.miss'] }}</td>
            <td class="px-3 py-2 text-right">{{ entry['cache.gets.hit'] + entry['cache.gets.miss'] }}</td>
            <td class="px-3 py-2 text-right">{{ entry['cache.puts'] }}</td>
            <td class="px-3 py-2 text-right">{{ entry['cache.removals'] }}</td>
            <td class="px-3 py-2 text-right">{{ entry['cache.evictions'] }}</td>
            <td class="px-3 py-2 text-right">
              {{ formatNumber2(filterNaN((100 * entry['cache.gets.hit']) / (entry['cache.gets.hit'] + entry['cache.gets.miss']))) }}
            </td>
            <td class="px-3 py-2 text-right">
              {{ formatNumber2(filterNaN((100 * entry['cache.gets.miss']) / (entry['cache.gets.hit'] + entry['cache.gets.miss']))) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog v-model="metricsModalOpen" :options="{ title: 'Threads dump', size: '3xl' }">
      <template #body-content>
        <metrics-modal :thread-dump="threadData" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" src="./metrics.component.ts"></script>
