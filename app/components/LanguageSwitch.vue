<template>
  <!-- 言語ごとに URL が違う（/ と /en/）ので、もう一方の言語版への <a href> にする。
       静的 HTML にも出るので、クローラーもたどれる。共有の ?q= は引き継がない -->
  <v-btn
    icon="$translate"
    :to="localePath('/', other.code)"
    :aria-label="other.name"
    :lang="other.language"
  />
</template>

<script setup lang="ts">
const { locale, locales } = useI18n();
const localePath = useLocalePath();
const other = computed(() => locales.value.find(item => item.code !== locale.value)!);
</script>
