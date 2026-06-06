<template>
  <div class="max-w-xl mx-auto py-8">
    <h1 class="text-2xl font-semibold mb-4">Reset your password</h1>

    <div v-if="keyMissing" class="mb-4 p-4 rounded-lg bg-surface-red-2 text-ink-red-4">The reset key is missing.</div>
    <div v-if="error" class="mb-4 p-4 rounded-lg bg-surface-red-2 text-ink-red-4">
      Your password couldn't be reset. Remember a password request is only valid for 24 hours.
    </div>
    <div v-if="success" class="mb-4 p-4 rounded-lg bg-surface-green-2 text-ink-green-3">
      <strong>Your password has been reset.</strong> Please
      <a class="font-semibold underline cursor-pointer" @click="showLogin()">sign in</a>.
    </div>
    <div v-if="doNotMatch" class="mb-4 p-4 rounded-lg bg-surface-red-2 text-ink-red-4">The password and its confirmation do not match!</div>
    <div v-if="!success && !keyMissing" class="mb-4 p-4 rounded-lg bg-surface-amber-1 text-ink-amber-3">Choose a new password.</div>

    <div v-if="!keyMissing">
      <form v-if="!success" @submit.prevent="finishReset()" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-ink-gray-6" for="newPassword">New password</label>
          <TextInput
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="New password"
            v-model="v$.resetAccount.newPassword.$model"
            minlength="4"
            maxlength="50"
            required
            data-cy="resetPassword"
            class="w-full"
          />
          <div v-if="v$.resetAccount.newPassword.$anyDirty && v$.resetAccount.newPassword.$invalid" class="text-xs text-ink-red-4">
            <div v-if="!v$.resetAccount.newPassword.required">Your password is required.</div>
            <div v-if="!v$.resetAccount.newPassword.minLength">Your password is required to be at least 4 characters.</div>
            <div v-if="!v$.resetAccount.newPassword.maxLength">Your password cannot be longer than 50 characters.</div>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-ink-gray-6" for="confirmPassword">New password confirmation</label>
          <TextInput
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm the new password"
            v-model="v$.resetAccount.confirmPassword.$model"
            minlength="4"
            maxlength="50"
            required
            data-cy="confirmResetPassword"
            class="w-full"
          />
          <div v-if="v$.resetAccount.confirmPassword.$anyDirty && v$.resetAccount.confirmPassword.$invalid" class="text-xs text-ink-red-4">
            <div v-if="!v$.resetAccount.confirmPassword.sameAsPassword">The password and its confirmation do not match!</div>
          </div>
        </div>
        <Button type="submit" :disabled="v$.resetAccount.$invalid" variant="solid" label="Save" data-cy="submit" />
      </form>
    </div>
  </div>
</template>

<script lang="ts" src="./reset-password-finish.component.ts"></script>
