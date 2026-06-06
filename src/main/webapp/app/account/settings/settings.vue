<template>
  <div class="max-w-xl mx-auto py-8">
    <h2 v-if="username" id="settings-title" class="text-2xl font-semibold mb-4">
      User settings for [<strong>{{ username }}</strong
      >]
    </h2>

    <div v-if="success" class="mb-4 p-4 rounded-lg bg-surface-green-2 text-ink-green-3"><strong>Settings saved!</strong></div>
    <div v-if="errorEmailExists" class="mb-4 p-4 rounded-lg bg-surface-red-2 text-ink-red-4">
      <strong>Email is already in use!</strong> Please choose another one.
    </div>

    <form v-if="settingsAccount" id="settings-form" @submit.prevent="save()" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="firstName">First Name</label>
        <TextInput
          type="text"
          id="firstName"
          name="firstName"
          placeholder="Your first name"
          v-model="v$.settingsAccount.firstName.$model"
          minlength="1"
          maxlength="50"
          required
          data-cy="firstname"
          class="w-full"
        />
        <div v-if="v$.settingsAccount.firstName.$anyDirty && v$.settingsAccount.firstName.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.settingsAccount.firstName.required">Your first name is required.</div>
          <div v-if="!v$.settingsAccount.firstName.minLength">Your first name is required to be at least 1 character.</div>
          <div v-if="!v$.settingsAccount.firstName.maxLength">Your first name cannot be longer than 50 characters.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="lastName">Last Name</label>
        <TextInput
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Your last name"
          v-model="v$.settingsAccount.lastName.$model"
          minlength="1"
          maxlength="50"
          required
          data-cy="lastname"
          class="w-full"
        />
        <div v-if="v$.settingsAccount.lastName.$anyDirty && v$.settingsAccount.lastName.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.settingsAccount.lastName.required">Your last name is required.</div>
          <div v-if="!v$.settingsAccount.lastName.minLength">Your last name is required to be at least 1 character.</div>
          <div v-if="!v$.settingsAccount.lastName.maxLength">Your last name cannot be longer than 50 characters.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="email">Email</label>
        <TextInput
          type="email"
          id="email"
          name="email"
          placeholder="Your email"
          v-model="v$.settingsAccount.email.$model"
          minlength="5"
          maxlength="254"
          required
          data-cy="email"
          class="w-full"
        />
        <div v-if="v$.settingsAccount.email.$anyDirty && v$.settingsAccount.email.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.settingsAccount.email.required">Your email is required.</div>
          <div v-if="!v$.settingsAccount.email.email">Your email is invalid.</div>
          <div v-if="!v$.settingsAccount.email.minLength">Your email is required to be at least 5 characters.</div>
          <div v-if="!v$.settingsAccount.email.maxLength">Your email cannot be longer than 50 characters.</div>
        </div>
      </div>

      <Button type="submit" :disabled="v$.settingsAccount.$invalid" variant="solid" label="Save" data-cy="submit" />
    </form>
  </div>
</template>

<script lang="ts" src="./settings.component.ts"></script>
