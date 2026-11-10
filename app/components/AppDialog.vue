<template>
  <!-- PC は中央のカード。mobile-fullscreen を付けると、スマホ（xs）は全画面で下から出す -->
  <v-dialog
    v-model="model"
    :fullscreen="fullscreen"
    :max-width="fullscreen ? undefined : maxWidth"
    :transition="fullscreen ? 'dialog-bottom-transition' : undefined"
    class="app-dialog"
  >
    <v-card class="app-dialog__card">
      <div
        v-if="title"
        class="app-dialog__header"
      >
        <h2 class="app-dialog__title">
          {{ title }}
        </h2>
        <slot name="actions" />
        <v-btn
          icon="$close"
          variant="text"
          :aria-label="$t('close')"
          @click="model = false"
        />
      </div>

      <slot />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

// ダイアログの共通の枠。見出し（title）を渡すと、左に見出し、右に閉じるボタンのヘッダーを出す
// 呼ぶ側の class は v-dialog に付く
const props = withDefaults(defineProps<{
  title?: string;
  maxWidth?: number | string;
  mobileFullscreen?: boolean;
}>(), {
  title: undefined,
  maxWidth: 480,
  mobileFullscreen: false,
});

const model = defineModel<boolean>({ required: true });
const { xs } = useDisplay();

// ダイアログの中身はサーバーで描かないので、画面の幅を見てよい
const fullscreen = computed(() => props.mobileFullscreen && xs.value);
</script>

<style lang="scss" scoped>
// Vuetify のダイアログは角丸が 4px。全画面のときは角を付けない
.v-dialog:not(.v-dialog--fullscreen) > .v-overlay__content > .app-dialog__card {
  border-radius: 16px;
}

.app-dialog__header {
  display: flex;
  align-items: center;
  padding: 12px 12px 4px 24px;
}

.app-dialog__title {
  flex: 1 1 auto;
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.3;
}
</style>
