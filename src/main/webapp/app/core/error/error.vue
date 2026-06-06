<template>
  <div class="max-w-2xl mx-auto py-8">
    <h1 class="text-2xl font-semibold mb-4 text-ink-red-4">Error page!</h1>

    <div v-if="errorMessage" class="p-4 rounded-lg bg-surface-red-2 text-ink-red-4 mb-3">
      {{ errorMessage }}
    </div>
    <div v-if="error403" class="p-4 rounded-lg bg-surface-red-2 text-ink-red-4 mb-3">You are not authorized to access this page.</div>
    <div v-if="error404" class="p-4 rounded-lg bg-surface-amber-1 text-ink-amber-3 mb-3">The page does not exist.</div>
  </div>
</template>

<script lang="ts" src="./error.component.ts"></script>
