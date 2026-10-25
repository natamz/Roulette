<template>
  <v-btn
    icon
    :aria-label="$t('share_title')"
    @click="shareRoulette"
  >
    <v-icon>$share</v-icon>
  </v-btn>

  <v-dialog
    v-model="dialog"
    max-width="800px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary">
        <v-btn
          icon
          :aria-label="$t('close')"
          @click="dialog = false"
        >
          <v-icon>$close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t("share_title") }}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>

      <v-card-text>{{ $t("share_message") }}</v-card-text>

      <v-text-field
        v-model="url"
        readonly
        hide-details="auto"
      />

      <!-- 「コピーしました！」が出ている間は、見えている文字をそのまま名前にする -->
      <v-btn
        :aria-label="copied ? undefined : $t('copy_url')"
        @click="copyUrl"
      >
        <span v-if="copied">
          <v-icon>$copied</v-icon>
          {{ $t("share_clicked") }}
        </span>
        <span v-if="!copied">
          <v-icon>$copy</v-icon>
        </span>
      </v-btn>
    </v-card>
  </v-dialog>
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
