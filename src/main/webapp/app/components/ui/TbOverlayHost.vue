<template>
  <div class="tb-toaster">
    <div v-for="t in toasts" :key="t.id" :class="['tb-toast', `intent-${t.intent}`, t.leaving ? 'is-leaving' : '']" role="status">
      <span class="tb-toast-ic">
        <TbIcon :name="t.icon || INTENT_ICON[t.intent] || 'info'" :size="19" :stroke="2.2" />
      </span>
      <div class="tb-toast-main">
        <div class="tb-toast-title">{{ t.title }}</div>
        <div v-if="t.msg" class="tb-toast-msg">{{ t.msg }}</div>
        <button
          v-if="t.action"
          class="tb-toast-action"
          @click="
            t.action!.onClick?.();
            dismissToast(t.id);
          "
        >
          {{ t.action.label }}
        </button>
      </div>
      <button class="tb-toast-x" @click="dismissToast(t.id)" aria-label="Dismiss">
        <TbIcon name="x" :size="15" />
      </button>
    </div>
  </div>

  <div v-if="dialog" class="tb-overlay" @click="settleConfirm(false)">
    <div class="tb-modal tb-dialog" @click.stop role="alertdialog">
      <div class="tb-dialog-body">
        <div :class="['tb-dialog-ic', dialog.intent ?? 'info']">
          <TbIcon :name="dialog.icon || INTENT_ICON[dialog.intent ?? 'info']" :size="30" :stroke="2.1" />
        </div>
        <h3>{{ dialog.title }}</h3>
        <p v-if="dialog.message">{{ dialog.message }}</p>
      </div>
      <div class="tb-dialog-foot">
        <TbButton v-if="!dialog.hideCancel" kind="default" @click="settleConfirm(false)">
          {{ dialog.cancelText ?? 'Cancel' }}
        </TbButton>
        <TbButton :kind="dialog.intent === 'danger' ? 'danger' : 'primary'" :icon="dialog.confirmIcon" @click="settleConfirm(true)">
          {{ dialog.confirmText ?? 'Confirm' }}
        </TbButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useOverlay, settleConfirm } from '@/composables/useOverlay';
import TbIcon from './TbIcon.vue';
import TbButton from './TbButton.vue';

const INTENT_ICON: Record<string, string> = {
  info: 'info',
  success: 'check',
  warning: 'warn',
  danger: 'warn',
};

const { toasts, dialog, dismissToast } = useOverlay();

function onKey(e: KeyboardEvent) {
  if (!dialog.value) return;
  if (e.key === 'Escape') settleConfirm(false);
  if (e.key === 'Enter') settleConfirm(true);
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>
