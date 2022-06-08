<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-title>roulette</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <roulette></roulette>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
useHead({
  title: "ルーレット",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [
    { name: "description", content: "roulette web application" },
    { rel: "icon", type: "image/png", href: "/favicons/icon-192x192.png" },
    { rel: "apple-touch-icon", type: "image/png", href: "/favicons/apple-touch-icon-180x180.png" },
  ],
});
</script>
