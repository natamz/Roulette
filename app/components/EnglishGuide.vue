<template>
  <v-snackbar
    v-model="show"
    :timeout="-1"
  >
    <!-- 読むのは日本語が読めない人なので、どの言語のページでも英語で出す -->
    This page is in Japanese.
    <template #actions>
      <v-btn
        :to="localePath('/', 'en')"
        variant="text"
        @click="show = false"
      >
        English version →
      </v-btn>
      <v-btn
        icon="$close"
        aria-label="Close"
        variant="text"
        @click="show = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
// ブラウザの言語が日本語以外の人が日本語版（/）を開いたとき、初回だけ英語版を案内する
// 自動で /en/ に飛ばすと、クローラーが日本語版を見られなくなる
const { locale } = useI18n();
const localePath = useLocalePath();
const show = ref(false);

onMounted(() => {
  if (locale.value !== "ja" || navigator.language.toLowerCase().startsWith("ja")) return;
  if (localStorage.getItem("englishGuide") == "true") return;
  localStorage.setItem("englishGuide", "true");
  show.value = true;
});
</script>
