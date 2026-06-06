<template>
  <div class="max-w-xl mx-auto py-8">
    <h2 v-if="username" id="password-title" class="text-2xl font-semibold mb-4">
      Password for [<strong>{{ username }}</strong
      >]
    </h2>

    <div v-if="success" class="mb-4 p-4 rounded-lg bg-surface-green-2 text-ink-green-3"><strong>Password changed!</strong></div>
    <div v-if="error" class="mb-4 p-4 rounded-lg bg-surface-red-2 text-ink-red-4">
      <strong>An error has occurred!</strong> The password could not be changed.
    </div>
    <div v-if="doNotMatch" class="mb-4 p-4 rounded-lg bg-surface-red-2 text-ink-red-4">The password and its confirmation do not match!</div>

    <form id="password-form" @submit.prevent="changePassword()" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="currentPassword">Current password</label>
        <TextInput
          type="password"
          id="currentPassword"
          name="currentPassword"
          placeholder="Current password"
          v-model="v$.resetPassword.currentPassword.$model"
          required
          data-cy="currentPassword"
          class="w-full"
        />
        <div v-if="v$.resetPassword.currentPassword.$anyDirty && v$.resetPassword.currentPassword.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.resetPassword.currentPassword.required">Your password is required.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="newPassword">New password</label>
        <TextInput
          type="password"
          id="newPassword"
          name="newPassword"
          placeholder="New password"
          v-model="v$.resetPassword.newPassword.$model"
          minlength="4"
          maxlength="50"
          required
          data-cy="newPassword"
          class="w-full"
        />
        <div v-if="v$.resetPassword.newPassword.$anyDirty && v$.resetPassword.newPassword.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.resetPassword.newPassword.required">Your password is required.</div>
          <div v-if="!v$.resetPassword.newPassword.minLength">Your password is required to be at least 4 characters.</div>
          <div v-if="!v$.resetPassword.newPassword.maxLength">Your password cannot be longer than 50 characters.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="confirmPassword">New password confirmation</label>
        <TextInput
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm the new password"
          v-model="v$.resetPassword.confirmPassword.$model"
          minlength="4"
          maxlength="50"
          required
          data-cy="confirmPassword"
          class="w-full"
        />
        <div v-if="v$.resetPassword.confirmPassword.$anyDirty && v$.resetPassword.confirmPassword.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.resetPassword.confirmPassword.sameAsPassword">The password and its confirmation do not match!</div>
        </div>
      </div>

      <Button type="submit" :disabled="v$.resetPassword.$invalid" variant="solid" label="Save" data-cy="submit" />
    </form>
  </div>
</template>

<script lang="ts" src="./change-password.component.ts"></script>
