<template>
  <v-btn @click="shareRoulette" variant="flat">
    <v-icon>mdi-export-variant</v-icon>
  </v-btn>

  <v-dialog max-width="800px" v-model="dialog" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="primary">
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>共有</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text> URLでルーレットを共有できます </v-card-text>

      <v-text-field readonly hide-details="auto" v-model="url"></v-text-field>

      <v-btn @click="copyUrl">
        <span v-if="copied">
          <v-icon>mdi-check-outline</v-icon>
          コピーしました！
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
