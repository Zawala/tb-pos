<template>
  <div class="max-w-xl mx-auto py-8">
    <h1 class="text-2xl font-semibold mb-4">Activation</h1>
    <div v-if="success" class="p-4 rounded-lg bg-surface-green-2 text-ink-green-3">
      <strong>Your user account has been activated.</strong> Please
      <a class="font-semibold underline cursor-pointer" @click="showLogin()">sign in</a>.
    </div>
    <div v-if="error" class="p-4 rounded-lg bg-surface-red-2 text-ink-red-4">
      <strong>Your user could not be activated.</strong> Please use the registration form to sign up.
    </div>
  </div>
</template>

<script lang="ts" src="./activate.component.ts"></script>
