<template>
  <div class="py-4">
    <h2 class="text-xl font-semibold mb-4" id="logs-page-heading" data-cy="logsPageHeading">Logs</h2>

    <div v-if="loggers">
      <p class="text-sm text-ink-gray-5 mb-3">There are {{ loggers.length }} loggers.</p>

      <div class="mb-3">
        <TextInput type="text" v-model="filtered" placeholder="Filter..." class="w-full max-w-sm" />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm" aria-describedby="Logs">
          <thead class="bg-surface-gray-2 text-ink-gray-6">
            <tr>
              <th class="px-3 py-2 text-left cursor-pointer hover:bg-surface-gray-3" @click="changeOrder('name')" scope="col">Name</th>
              <th class="px-3 py-2 text-left cursor-pointer hover:bg-surface-gray-3" @click="changeOrder('level')" scope="col">Level</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="logger in filteredLoggers" :key="logger.name" class="border-t border-outline-gray-1 hover:bg-surface-gray-1">
              <td class="px-3 py-2">
                <small>{{ logger.name }}</small>
              </td>
              <td class="px-3 py-2">
                <div class="flex items-center gap-1">
                  <Button
                    size="sm"
                    @click="updateLevel(logger.name, 'TRACE')"
                    :variant="logger.level === 'TRACE' ? 'solid' : 'subtle'"
                    theme="gray"
                    label="TRACE"
                  />
                  <Button
                    size="sm"
                    @click="updateLevel(logger.name, 'DEBUG')"
                    :variant="logger.level === 'DEBUG' ? 'solid' : 'subtle'"
                    :theme="logger.level === 'DEBUG' ? 'green' : 'gray'"
                    label="DEBUG"
                  />
                  <Button
                    size="sm"
                    @click="updateLevel(logger.name, 'INFO')"
                    :variant="logger.level === 'INFO' ? 'solid' : 'subtle'"
                    :theme="logger.level === 'INFO' ? 'blue' : 'gray'"
                    label="INFO"
                  />
                  <Button
                    size="sm"
                    @click="updateLevel(logger.name, 'WARN')"
                    :variant="logger.level === 'WARN' ? 'solid' : 'subtle'"
                    :theme="logger.level === 'WARN' ? 'orange' : 'gray'"
                    label="WARN"
                  />
                  <Button
                    size="sm"
                    @click="updateLevel(logger.name, 'ERROR')"
                    :variant="logger.level === 'ERROR' ? 'solid' : 'subtle'"
                    :theme="logger.level === 'ERROR' ? 'red' : 'gray'"
                    label="ERROR"
                  />
                  <Button
                    size="sm"
                    @click="updateLevel(logger.name, 'OFF')"
                    :variant="logger.level === 'OFF' ? 'solid' : 'subtle'"
                    theme="gray"
                    label="OFF"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./logs.component.ts"></script>
