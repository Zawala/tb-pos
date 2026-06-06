<template>
  <div class="max-w-2xl mx-auto py-8">
    <div v-if="user">
      <h2 class="text-xl font-semibold mb-4">
        User [<strong>{{ user.login }}</strong
        >]
      </h2>
      <dl class="divide-y divide-outline-gray-1">
        <div class="grid grid-cols-3 py-2">
          <dt class="text-sm font-medium text-ink-gray-5">Login</dt>
          <dd class="col-span-2 text-sm flex items-center gap-2">
            {{ user.login }}
            <Badge v-if="user.activated" theme="green" variant="subtle" label="Activated" />
            <Badge v-if="!user.activated" theme="red" variant="subtle" label="Deactivated" />
          </dd>
        </div>
        <div class="grid grid-cols-3 py-2">
          <dt class="text-sm font-medium text-ink-gray-5">First name</dt>
          <dd class="col-span-2 text-sm">{{ user.firstName }}</dd>
        </div>
        <div class="grid grid-cols-3 py-2">
          <dt class="text-sm font-medium text-ink-gray-5">Last name</dt>
          <dd class="col-span-2 text-sm">{{ user.lastName }}</dd>
        </div>
        <div class="grid grid-cols-3 py-2">
          <dt class="text-sm font-medium text-ink-gray-5">Email</dt>
          <dd class="col-span-2 text-sm">{{ user.email }}</dd>
        </div>
        <div class="grid grid-cols-3 py-2">
          <dt class="text-sm font-medium text-ink-gray-5">Created by</dt>
          <dd class="col-span-2 text-sm">{{ user.createdBy }}</dd>
        </div>
        <div class="grid grid-cols-3 py-2">
          <dt class="text-sm font-medium text-ink-gray-5">Created date</dt>
          <dd class="col-span-2 text-sm">{{ user.createdDate ? formatDate(user.createdDate) : '' }}</dd>
        </div>
        <div class="grid grid-cols-3 py-2">
          <dt class="text-sm font-medium text-ink-gray-5">Modified by</dt>
          <dd class="col-span-2 text-sm">{{ user.lastModifiedBy }}</dd>
        </div>
        <div class="grid grid-cols-3 py-2">
          <dt class="text-sm font-medium text-ink-gray-5">Modified date</dt>
          <dd class="col-span-2 text-sm">{{ user.lastModifiedDate ? formatDate(user.lastModifiedDate) : '' }}</dd>
        </div>
        <div class="grid grid-cols-3 py-2">
          <dt class="text-sm font-medium text-ink-gray-5">Profiles</dt>
          <dd class="col-span-2 text-sm flex flex-wrap gap-1">
            <Badge v-for="authority of user.authorities" :key="authority" variant="subtle" :label="authority" />
          </dd>
        </div>
      </dl>
      <div class="mt-4">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'JhiUser' }">
          <Button @click="navigate" variant="subtle" theme="gray" icon-left="arrow-left" label="Back" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./user-management-view.component.ts"></script>
