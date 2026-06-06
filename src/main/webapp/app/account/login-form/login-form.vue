<template>
  <div>
    <div v-if="authenticationError" data-cy="loginError" class="tb-login-error">
      <strong>Failed to sign in!</strong> Please check your credentials and try again.
    </div>

    <form class="tb-login-form" @submit.prevent="doLogin()">
      <div>
        <label for="username">Username</label>
        <label class="tb-field">
          <TbIcon name="user" :size="18" class-name="tb-field-ic" />
          <input id="username" v-model="login" type="text" name="username" autofocus placeholder="Your username" data-cy="username" />
        </label>
      </div>
      <div>
        <label for="password">Password</label>
        <label class="tb-field">
          <TbIcon name="settings" :size="18" class-name="tb-field-ic" />
          <input id="password" v-model="password" type="password" name="password" placeholder="Your password" data-cy="password" />
        </label>
      </div>
      <label class="tb-remember">
        <input id="rememberMe" v-model="rememberMe" type="checkbox" name="rememberMe" />
        <span>Remember me</span>
      </label>
      <TbButton kind="primary" size="lg" full type="submit" data-cy="submit">Sign in</TbButton>
    </form>

    <div class="tb-login-foot">
      <router-link to="/account/reset/request" class="tb-login-link" data-cy="forgetYourPasswordSelector">
        Forgot your password?
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" src="./login-form.component.ts"></script>
