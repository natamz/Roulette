<template>
  <!-- 言語版どうしのリンク。ヘッダーの言語メニュー（LanguageSwitch）の中身は開くまで描かれないので、
       クローラーがたどれるよう、静的 HTML に <a href> を出しておく。共有の ?q= は引き継がない -->
  <nav :aria-label="$t('language')">
    <v-btn
      v-for="item in locales"
      :key="item.code"
      :to="localePath('/', item.code)"
      :active="item.code === locale"
      :lang="item.language"
      variant="text"
      size="small"
      style="text-transform: none"
    >
      {{ item.name }}
    </v-btn>
  </nav>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n();
const localePath = useLocalePath();
</script>
