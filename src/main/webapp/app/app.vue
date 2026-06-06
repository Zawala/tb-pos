<template>
  <div id="app">
    <ribbon></ribbon>

    <!-- Authenticated: full sidebar shell (mirrors wireframes/app.jsx) -->
    <div v-if="authenticated" class="tb-frame" data-nav="sidebar">
      <tb-sidebar></tb-sidebar>
      <div class="tb-content">
        <div class="tb-topbar">
          <span class="tb-topbar-title">{{ pageTitle }}</span>
          <div class="tb-topbar-spacer"></div>
          <div class="tb-store-pill">
            <span class="ava">{{ userInitial }}</span>
            <span class="tb-store-meta tb-hide-sm"> <b>TbPos</b><span>Downtown · Register 1</span> </span>
            <TbIcon name="chevdown" :size="16" class="tb-hide-sm" />
          </div>
          <TbCurrencyToggle class="tb-hide-sm" />
          <TbIconButton name="bell" kind="outline" class="tb-hide-sm" />
          <TbIconButton :name="theme === 'dark' ? 'sun' : 'moon'" kind="outline" title="Toggle theme" @click="toggleTheme" />
        </div>
        <div class="tb-scroll">
          <router-view></router-view>
        </div>
      </div>
    </div>

    <!-- Unauthenticated: full-bleed (login owns the screen) -->
    <div v-else class="tb-frame" data-nav="none">
      <router-view></router-view>
    </div>

    <Dialog v-model="loginModalOpen" :options="{ title: 'Sign in', description: 'Enter your credentials to sign in' }">
      <template #body-content>
        <login-form></login-form>
      </template>
    </Dialog>

    <Toasts />
  </div>
</template>

<script lang="ts" src="./app.component.ts"></script>
