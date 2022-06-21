<template>
  <settings-dialog ref="settingsDialog"></settings-dialog>

  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-title>roulette</v-app-bar-title>
      <v-btn @click="$refs.settingsDialog.showDialog()">設定</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <roulette></roulette>
      </v-container>
    </v-main>

    <v-footer>
      <v-card elevation="0" rounded="0" width="100%" class="text-center">
        <v-divider></v-divider>

        <v-card-text>
          {{ new Date().getFullYear() }} — <strong>nata</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script setup>
useHead({
  title: "ルーレット",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [{ name: "description", content: "roulette web application" }],
  link: [
    { rel: "icon", href: "/favicons/favicon.ico" },
    { rel: "icon", type: "image/png", href: "/favicons/icon-192x192.png" },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      href: "/favicons/apple-touch-icon-180x180.png",
    },
  ],
});
</script>
