<template>
  <div class="min-h-[calc(100vh-3.5rem)] flex flex-col">
    <!-- Authenticated: redirect hint -->
    <div v-if="authenticated" class="flex-1 flex items-center justify-center">
      <div class="text-center max-w-md px-4">
        <div class="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <p class="text-ink-gray-5 text-sm mb-1">Signed in as</p>
        <p class="text-ink-gray-9 font-semibold text-lg mb-6">{{ username }}</p>
        <router-link to="/pos" class="no-underline">
          <Button variant="solid" label="Open POS" size="md" class="w-full" />
        </router-link>
      </div>
    </div>

    <!-- Unauthenticated: hero -->
    <div v-else class="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <!-- Logo mark -->
      <div class="w-20 h-20 rounded-3xl brand-gradient flex items-center justify-center mb-8 shadow-xl shadow-violet-500/20">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>

      <h1 class="text-5xl font-bold brand-text tracking-tight mb-3 pb-1">TbPos</h1>
      <p class="text-ink-gray-5 text-lg mb-10 text-center max-w-sm">
        Point of Sale for Zimbabwean retail. Fast, offline-ready, multi-currency.
      </p>

      <!-- CTA -->
      <div class="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <router-link to="/login" class="no-underline flex-1">
          <Button variant="solid" label="Sign in" class="w-full" />
        </router-link>
        <router-link to="/register" class="no-underline flex-1">
          <Button variant="outline" label="Create account" class="w-full" />
        </router-link>
      </div>

      <!-- Demo credentials -->
      <div class="mt-10 w-full max-w-xs">
        <p class="text-xs font-medium text-ink-gray-4 uppercase tracking-wider mb-3 text-center">Demo accounts</p>
        <div class="flex flex-col gap-2">
          <div
            v-for="cred in demoCredentials"
            :key="cred.role"
            class="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-gray-2 border border-outline-gray-1"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full brand-gradient flex items-center justify-center">
                <span class="text-white text-xs font-bold">{{ cred.role.charAt(0) }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-ink-gray-8">{{ cred.role }}</p>
                <p class="text-xs text-ink-gray-4">{{ cred.login }} / {{ cred.password }}</p>
              </div>
            </div>
            <Badge :label="cred.badge" :theme="cred.badgeTheme" size="sm" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>
