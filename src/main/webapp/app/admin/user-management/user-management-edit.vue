<template>
  <div class="max-w-xl mx-auto py-8">
    <form novalidate @submit.prevent="save()" v-if="userAccount" class="flex flex-col gap-4">
      <h2 id="myUserLabel" class="text-xl font-semibold">Create or edit a user</h2>

      <div v-if="userAccount.id" class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6">ID</label>
        <TextInput type="text" name="id" v-model="userAccount.id" :disabled="true" class="w-full" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6">Login</label>
        <TextInput type="text" name="login" v-model="v$.userAccount.login.$model" class="w-full" />
        <div v-if="v$.userAccount.login.$anyDirty && v$.userAccount.login.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.userAccount.login.required">This field is required.</div>
          <div v-if="!v$.userAccount.login.maxLength">This field cannot be longer than 50 characters.</div>
          <div v-if="!v$.userAccount.login.pattern">This field can only contain letters, digits and e-mail addresses.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="firstName">First name</label>
        <TextInput
          type="text"
          id="firstName"
          name="firstName"
          placeholder="Your first name"
          v-model="v$.userAccount.firstName.$model"
          class="w-full"
        />
        <div v-if="v$.userAccount.firstName.$anyDirty && v$.userAccount.firstName.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.userAccount.firstName.maxLength">This field cannot be longer than 50 characters.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="lastName">Last name</label>
        <TextInput
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Your last name"
          v-model="v$.userAccount.lastName.$model"
          class="w-full"
        />
        <div v-if="v$.userAccount.lastName.$anyDirty && v$.userAccount.lastName.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.userAccount.lastName.maxLength">This field cannot be longer than 50 characters.</div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6" for="email">Email</label>
        <TextInput
          type="email"
          id="email"
          name="email"
          placeholder="Your email"
          v-model="v$.userAccount.email.$model"
          required
          class="w-full"
        />
        <div v-if="v$.userAccount.email.$anyDirty && v$.userAccount.email.$invalid" class="text-xs text-ink-red-4">
          <div v-if="!v$.userAccount.email.required">Your email is required.</div>
          <div v-if="!v$.userAccount.email.email">Your email is invalid.</div>
          <div v-if="!v$.userAccount.email.minLength">Your email is required to be at least 5 characters.</div>
          <div v-if="!v$.userAccount.email.maxLength">Your email cannot be longer than 50 characters.</div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input
          class="rounded"
          :disabled="userAccount.id === null"
          type="checkbox"
          id="activated"
          name="activated"
          v-model="userAccount.activated"
        />
        <label class="text-sm font-medium text-ink-gray-6" for="activated">Activated</label>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-ink-gray-6">Profiles</label>
        <select
          class="w-full rounded border border-outline-gray-2 px-3 py-2 text-sm"
          multiple
          name="authority"
          v-model="userAccount.authorities"
        >
          <option v-for="authority of authorities" :value="authority" :key="authority">{{ authority }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <Button type="button" variant="subtle" theme="gray" icon-left="x" label="Cancel" @click="previousState()" />
        <Button type="submit" :disabled="v$.userAccount.$invalid || isSaving" variant="solid" icon-left="save" label="Save" />
      </div>
    </form>
  </div>
</template>

<script lang="ts" src="./user-management-edit.component.ts"></script>
