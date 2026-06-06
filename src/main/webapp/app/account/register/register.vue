<template>
  <div class="max-w-xl mx-auto py-8">
    <h1 class="text-2xl font-semibold mb-6" id="register-title" data-cy="registerTitle">Registration</h1>

    <div v-if="success" class="mb-4 p-4 rounded-lg bg-surface-green-2 text-ink-green-3">
      <strong>Registration saved!</strong> Please check your email for confirmation.
    </div>
    <div v-if="error" class="mb-4 p-4 rounded-lg bg-surface-red-2 text-ink-red-4">
      <strong>Registration failed!</strong> Please try again later.
    </div>
    <div v-if="errorUserExists" class="mb-4 p-4 rounded-lg bg-surface-red-2 text-ink-red-4">
      <strong>Login name already registered!</strong> Please choose another one.
    </div>
    <div v-if="errorEmailExists" class="mb-4 p-4 rounded-lg bg-surface-red-2 text-ink-red-4">
      <strong>Email is already in use!</strong> Please choose another one.
    </div>

    <form v-if="!success" id="register-form" @submit.prevent="register()" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="username">Username</label>
        <TextInput
          type="text"
          id="username"
          name="login"
          v-model="v$.registerAccount.login.$model"
          :class="{ 'border-red-500': v$.registerAccount.login.$anyDirty && v$.registerAccount.login.$invalid }"
          required
          minlength="1"
          maxlength="50"
          placeholder="Your username"
          data-cy="username"
          class="w-full"
        />
        <div v-if="v$.registerAccount.login.$anyDirty && v$.registerAccount.login.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.registerAccount.login.required">Your username is required.</div>
          <div v-if="!v$.registerAccount.login.minLength">Your username is required to be at least 1 character.</div>
          <div v-if="!v$.registerAccount.login.maxLength">Your username cannot be longer than 50 characters.</div>
          <div v-if="!v$.registerAccount.login.pattern">Your username is invalid.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="email">Email</label>
        <TextInput
          type="email"
          id="email"
          name="email"
          v-model="v$.registerAccount.email.$model"
          :class="{ 'border-red-500': v$.registerAccount.email.$anyDirty && v$.registerAccount.email.$invalid }"
          minlength="5"
          maxlength="254"
          required
          placeholder="Your email"
          data-cy="email"
          class="w-full"
        />
        <div v-if="v$.registerAccount.email.$anyDirty && v$.registerAccount.email.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.registerAccount.email.required">Your email is required.</div>
          <div v-if="!v$.registerAccount.email.email">Your email is invalid.</div>
          <div v-if="!v$.registerAccount.email.minLength">Your email is required to be at least 5 characters.</div>
          <div v-if="!v$.registerAccount.email.maxLength">Your email cannot be longer than 50 characters.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="firstPassword">New password</label>
        <TextInput
          type="password"
          id="firstPassword"
          name="password"
          v-model="v$.registerAccount.password.$model"
          minlength="4"
          maxlength="50"
          required
          placeholder="New password"
          data-cy="firstPassword"
          class="w-full"
        />
        <div v-if="v$.registerAccount.password.$anyDirty && v$.registerAccount.password.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.registerAccount.password.required">Your password is required.</div>
          <div v-if="!v$.registerAccount.password.minLength">Your password is required to be at least 4 characters.</div>
          <div v-if="!v$.registerAccount.password.maxLength">Your password cannot be longer than 50 characters.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="secondPassword">New password confirmation</label>
        <TextInput
          type="password"
          id="secondPassword"
          name="confirmPasswordInput"
          v-model="v$.confirmPassword.$model"
          minlength="4"
          maxlength="50"
          required
          placeholder="Confirm the new password"
          data-cy="secondPassword"
          class="w-full"
        />
        <div v-if="v$.confirmPassword.$dirty && v$.confirmPassword.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.confirmPassword.required">Your confirmation password is required.</div>
          <div v-if="!v$.confirmPassword.minLength">Your confirmation password is required to be at least 4 characters.</div>
          <div v-if="!v$.confirmPassword.maxLength">Your confirmation password cannot be longer than 50 characters.</div>
          <div v-if="!v$.confirmPassword.sameAsPassword">The password and its confirmation do not match!</div>
        </div>
      </div>

      <Button type="submit" :disabled="v$.$invalid" variant="solid" label="Register" data-cy="submit" />
    </form>

    <div class="mt-4 p-3 rounded-lg bg-surface-amber-1 text-ink-amber-3 text-sm">
      <span>If you want to </span>
      <a class="font-semibold underline cursor-pointer" @click="showLogin()">sign in</a>
      <span
        >, you can try the default accounts:<br />- Administrator (login="admin" / password="admin")<br />- User (login="user" /
        password="user").</span
      >
    </div>
  </div>
</template>

<script lang="ts" src="./register.component.ts"></script>
