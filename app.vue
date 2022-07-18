<template>
  <settings-dialog ref="settingsDialog"></settings-dialog>
  <template-dialog
    ref="templateDialog"
    @selectTemplate="selectTemplate"
  ></template-dialog>
  <tutorial-dialog ref="tutorialDialog"></tutorial-dialog>

  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-title>ルーレット</v-app-bar-title>
      <v-btn
        @click="$refs.tutorialDialog.showDialog()"
        icon
        :disabled="isRunning"
      >
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
      <v-btn
        @click="$refs.templateDialog.showDialog()"
        icon
        :disabled="isRunning"
      >
        <v-icon>mdi-database</v-icon>
      </v-btn>
      <v-btn
        @click="$refs.settingsDialog.showDialog()"
        icon
        :disabled="isRunning"
      >
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <roulette ref="roulette" @stateChange="stateChange"></roulette>
      </v-container>
    </v-main>

    <v-footer>
      <v-card elevation="0" rounded="0" width="100%" class="text-center">
        <v-divider></v-divider>

        <v-card-text>
          <v-btn href="https://github.com/natamz/Roulette" variant="flat">
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isRunning: false,
    };
  },
  methods: {
    selectTemplate(items) {
      this.$refs.roulette.setItems(items);
    },
    stateChange(isRunning: boolean) {
      this.isRunning = isRunning;
    },
  },
};
</script>

<script setup lang="ts">
useHead({
  title: "ルーレット",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [{ name: "description", content: "roulette web application" }],
  link: [
    { rel: "icon", href: "../favicons/favicon.ico" },
    { rel: "icon", type: "image/png", href: "../favicons/icon-192x192.png" },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      href: "../favicons/apple-touch-icon-180x180.png",
    },
  ],
});
</script>
