<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <Badge variant="subtle" class="cursor-pointer" @click="threadDumpFilter = ''">
        All <span class="ml-1 font-semibold">{{ threadDumpData.threadDumpAll }}</span>
      </Badge>
      <Badge theme="green" variant="subtle" class="cursor-pointer" @click="threadDumpFilter = 'RUNNABLE'">
        Runnable <span class="ml-1 font-semibold">{{ threadDumpData.threadDumpRunnable }}</span>
      </Badge>
      <Badge variant="subtle" class="cursor-pointer" @click="threadDumpFilter = 'WAITING'">
        Waiting <span class="ml-1 font-semibold">{{ threadDumpData.threadDumpWaiting }}</span>
      </Badge>
      <Badge theme="orange" variant="subtle" class="cursor-pointer" @click="threadDumpFilter = 'TIMED_WAITING'">
        Timed Waiting <span class="ml-1 font-semibold">{{ threadDumpData.threadDumpTimedWaiting }}</span>
      </Badge>
      <Badge theme="red" variant="subtle" class="cursor-pointer" @click="threadDumpFilter = 'BLOCKED'">
        Blocked <span class="ml-1 font-semibold">{{ threadDumpData.threadDumpBlocked }}</span>
      </Badge>
    </div>

    <TextInput type="text" v-model="threadDumpFilter" placeholder="Filter..." class="w-full" />

    <div v-for="(entry, key1) of filteredThreadDump" :key="key1" class="border border-outline-gray-1 rounded p-3">
      <div class="flex items-center gap-2 mb-2">
        <Badge :theme="getBadgeClass(entry.threadState)" variant="subtle" :label="entry.threadState" />
        <span class="text-sm font-medium">{{ entry.threadName }} (ID {{ entry.threadId }})</span>
        <button @click="entry.show = !entry.show" class="text-xs text-ink-gray-8 underline cursor-pointer">
          {{ entry.show ? 'Hide Stacktrace' : 'Show Stacktrace' }}
        </button>
      </div>

      <div v-if="entry.show" class="bg-surface-gray-2 rounded p-2 mb-2 text-xs font-mono overflow-x-auto">
        <div v-for="(st, key2) of entry.stackTrace" :key="key2" class="break-all">
          {{ st.className }}.{{ st.methodName }}(<code>{{ st.fileName }}:{{ st.lineNumber }}</code
          >)
        </div>
      </div>

      <table class="w-full text-xs" aria-describedby="Metrics">
        <thead class="bg-surface-gray-2 text-ink-gray-5">
          <tr>
            <th class="px-2 py-1 text-left" scope="col">Blocked Time</th>
            <th class="px-2 py-1 text-left" scope="col">Blocked Count</th>
            <th class="px-2 py-1 text-left" scope="col">Waited Time</th>
            <th class="px-2 py-1 text-left" scope="col">Waited Count</th>
            <th class="px-2 py-1 text-left" scope="col">Lock name</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t border-outline-gray-1">
            <td class="px-2 py-1">{{ entry.blockedTime }}</td>
            <td class="px-2 py-1">{{ entry.blockedCount }}</td>
            <td class="px-2 py-1">{{ entry.waitedTime }}</td>
            <td class="px-2 py-1">{{ entry.waitedCount }}</td>
            <td class="px-2 py-1 truncate max-w-xs" :title="entry.lockName">
              <code>{{ entry.lockName }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" src="./metrics-modal.component.ts"></script>
