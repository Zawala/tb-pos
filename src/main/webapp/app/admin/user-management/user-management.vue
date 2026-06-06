<template>
  <div class="py-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold" id="user-management-page-heading" data-cy="userManagementPageHeading">Users</h2>
      <div class="flex items-center gap-2">
        <Button variant="subtle" :loading="isLoading" @click="handleSyncList" icon-left="refresh-cw" label="Refresh list" />
        <router-link custom v-slot="{ navigate }" :to="{ name: 'JhiUserCreate' }">
          <Button @click="navigate" variant="solid" icon-left="plus" label="Create a new user" />
        </router-link>
      </div>
    </div>

    <div v-if="users" class="overflow-x-auto">
      <table class="w-full text-sm" aria-describedby="Users">
        <thead class="bg-surface-gray-2 text-ink-gray-6">
          <tr>
            <th class="px-3 py-2 text-left cursor-pointer hover:bg-surface-gray-3" scope="col" @click="changeOrder('id')">
              ID <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'" />
            </th>
            <th class="px-3 py-2 text-left cursor-pointer hover:bg-surface-gray-3" scope="col" @click="changeOrder('login')">
              Login <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'login'" />
            </th>
            <th class="px-3 py-2 text-left cursor-pointer hover:bg-surface-gray-3" scope="col" @click="changeOrder('email')">
              Email <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'email'" />
            </th>
            <th class="px-3 py-2 text-left" scope="col">Status</th>
            <th class="px-3 py-2 text-left" scope="col">Profiles</th>
            <th class="px-3 py-2 text-left cursor-pointer hover:bg-surface-gray-3" scope="col" @click="changeOrder('createdDate')">
              Created date <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'createdDate'" />
            </th>
            <th class="px-3 py-2 text-left cursor-pointer hover:bg-surface-gray-3" scope="col" @click="changeOrder('lastModifiedBy')">
              Modified by <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'lastModifiedBy'" />
            </th>
            <th class="px-3 py-2 text-left cursor-pointer hover:bg-surface-gray-3" scope="col" @click="changeOrder('lastModifiedDate')">
              Modified date <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'lastModifiedDate'" />
            </th>
            <th class="px-3 py-2" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" :id="user.login" class="border-t border-outline-gray-1 hover:bg-surface-gray-1">
            <td class="px-3 py-2">
              <router-link :to="{ name: 'JhiUserView', params: { userId: user.login } }" class="text-ink-gray-8 underline">{{
                user.id
              }}</router-link>
            </td>
            <td class="px-3 py-2">{{ user.login }}</td>
            <td class="px-3 py-2">{{ user.email }}</td>
            <td class="px-3 py-2">
              <Button v-if="!user.activated" size="sm" variant="subtle" theme="red" label="Deactivated" @click="setActive(user, true)" />
              <Button
                v-if="user.activated"
                size="sm"
                variant="subtle"
                theme="green"
                label="Activated"
                @click="setActive(user, false)"
                :disabled="username === user.login"
              />
            </td>
            <td class="px-3 py-2">
              <div class="flex flex-wrap gap-1">
                <Badge v-for="authority of user.authorities" :key="authority" variant="subtle" :label="authority" />
              </div>
            </td>
            <td class="px-3 py-2">{{ formatDate(user.createdDate) }}</td>
            <td class="px-3 py-2">{{ user.lastModifiedBy }}</td>
            <td class="px-3 py-2">{{ formatDate(user.lastModifiedDate) }}</td>
            <td class="px-3 py-2">
              <div class="flex items-center gap-1">
                <router-link :to="{ name: 'JhiUserView', params: { userId: user.login } }" custom v-slot="{ navigate }">
                  <Button @click="navigate" size="sm" variant="subtle" icon="eye" />
                </router-link>
                <router-link :to="{ name: 'JhiUserEdit', params: { userId: user.login } }" custom v-slot="{ navigate }">
                  <Button @click="navigate" size="sm" variant="subtle" icon="edit-2" />
                </router-link>
                <Button
                  @click="prepareRemove(user)"
                  size="sm"
                  variant="subtle"
                  theme="red"
                  icon="trash-2"
                  :disabled="username === user.login"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <Dialog
        v-model="deleteDialogOpen"
        :options="{
          title: 'Confirm delete operation',
          actions: [
            { label: 'Delete', variant: 'solid', theme: 'red', onClick: deleteUser },
            { label: 'Cancel', variant: 'subtle', theme: 'gray', onClick: closeDialog },
          ],
        }"
      >
        <template #body-content>
          <p id="jhi-delete-user-heading">
            Are you sure you want to delete user <strong>{{ removeId }}</strong
            >?
          </p>
        </template>
      </Dialog>
    </div>

    <div v-show="users && users.length > 0" class="mt-4 flex flex-col items-center gap-2">
      <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage" />
      <div class="flex items-center gap-1">
        <Button size="sm" variant="subtle" theme="gray" label="Previous" :disabled="page <= 1" @click="loadPage(page - 1)" />
        <span class="px-3 py-1 text-sm text-ink-gray-6">Page {{ page }}</span>
        <Button
          size="sm"
          variant="subtle"
          theme="gray"
          label="Next"
          :disabled="page * itemsPerPage >= totalItems"
          @click="loadPage(page + 1)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./user-management.component.ts"></script>
