<template>
  <div class="tb-login">
    <div class="tb-login-card">
      <!-- Brand panel -->
      <div class="tb-login-brand">
        <div class="tb-login-logo">T</div>
        <h1>TbPos</h1>
        <p>Retail point of sale, built for speed at the counter.</p>
        <div class="tb-login-feats">
          <div class="tb-login-feat">
            <span><TbIcon name="scan" :size="18" /></span> Barcode-fast checkout
          </div>
          <div class="tb-login-feat">
            <span><TbIcon name="box" :size="18" /></span> Live inventory &amp; stock
          </div>
          <div class="tb-login-feat">
            <span><TbIcon name="chart" :size="18" /></span> Daily sales insights
          </div>
        </div>
      </div>

      <!-- Auth panel -->
      <div class="tb-login-auth">
        <h2>Welcome back</h2>
        <p class="lead">Downtown · Register 1</p>
        <login-form />
        <div class="tb-login-foot">
          <span style="color: var(--text-muted); font-size: 13.5px">Don't have an account? </span>
          <router-link to="/register" class="tb-login-link">Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginForm from './login-form.vue';
import TbIcon from '@/components/ui/TbIcon.vue';

export default defineComponent({
  components: { 'login-form': LoginForm, TbIcon },
});
</script>
