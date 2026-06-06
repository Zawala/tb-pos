<template>
  <div class="max-w-xl mx-auto py-8">
    <h1 class="text-2xl font-semibold mb-4">Reset your password</h1>

    <div v-if="!success" class="mb-4 p-4 rounded-lg bg-surface-amber-1 text-ink-amber-3">Enter the email address you used to register.</div>
    <div v-if="success" class="mb-4 p-4 rounded-lg bg-surface-green-2 text-ink-green-3">
      Check your email for details on how to reset your password.
    </div>

    <form v-if="!success" @submit.prevent="requestReset()" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="email">Email</label>
        <TextInput
          type="email"
          id="email"
          name="email"
          placeholder="Your email"
          v-model="v$.resetAccount.email.$model"
          minlength="5"
          maxlength="254"
          required
          data-cy="emailResetPassword"
          class="w-full"
        />
        <div v-if="v$.resetAccount.email.$anyDirty && v$.resetAccount.email.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.resetAccount.email.required">Your email is required.</div>
          <div v-if="!v$.resetAccount.email.email">Your email is invalid.</div>
          <div v-if="!v$.resetAccount.email.minLength">Your email is required to be at least 5 characters.</div>
          <div v-if="!v$.resetAccount.email.maxLength">Your email cannot be longer than 50 characters.</div>
        </div>
      </div>
      <Button type="submit" :disabled="v$.resetAccount.$invalid" variant="solid" label="Reset password" data-cy="submit" />
    </form>
  </div>
</template>

<script lang="ts" src="./reset-password-init.component.ts"></script>
