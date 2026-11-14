<template>
  <v-btn
    icon
    :aria-label="$t('share_title')"
    @click="shareRoulette"
  >
    <v-icon>$share</v-icon>
  </v-btn>

  <!-- PC は中央のカード、スマホは全画面 -->
  <app-dialog
    v-model="dialog"
    :title="$t('share_title')"
    mobile-fullscreen
  >
    <div class="share">
      <p class="share__message">
        {{ $t("share_message") }}
      </p>
      <v-text-field
        v-model="url"
        readonly
        variant="outlined"
        hide-details
      />
      <v-btn
        block
        size="large"
        color="primary"
        variant="flat"
        :prepend-icon="copied ? '$copied' : '$copy'"
        class="share__copy"
        @click="copyUrl"
      >
        {{ copied ? $t("share_clicked") : $t("copy_url") }}
      </v-btn>
    </div>
  </app-dialog>
</template>

<script lang="ts">
export default {
  data(): {
    dialog: boolean;
    copied: boolean;
    url: string;
  } {
    return {
      dialog: false,
      copied: false,
      url: "",
    };
  },
  methods: {
    async shareRoulette() {
      const item = (await this.$db.rouletteItem.getAll()) ?? [];
      this.url = this.$share.export(item);
      this.dialog = true;
      this.copied = false;
    },
    async copyUrl() {
      navigator.clipboard.writeText(this.url);
      this.copied = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.share {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 24px 24px;
}

.share__message {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.875rem;
}

.share__copy.v-btn {
  border-radius: 10px;
  letter-spacing: normal;
  text-transform: none;
}
</style>
