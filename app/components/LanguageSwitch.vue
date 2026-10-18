<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn
        icon="mdi-translate"
        v-bind="props"
      />
    </template>

    <v-list>
      <!-- 言語ごとに URL が違う（/ と /en/）ので、切り替えはリンクにする。共有の ?q= は引き継がない -->
      <v-list-item
        v-for="item in locales"
        :key="item.code"
        :to="localePath('/', item.code)"
        :active="item.code === locale"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n();
const localePath = useLocalePath();
</script>
