<template>
  <v-btn
    variant="text"
    @click="shareRoulette"
  >
    <v-icon>mdi-export-variant</v-icon>
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
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
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

      <v-btn @click="copyUrl">
        <span v-if="copied">
          <v-icon>mdi-check-outline</v-icon>
          {{ $t("share_clicked") }}
        </span>
        <span v-if="!copied">
          <v-icon>mdi-content-copy</v-icon>
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
