<template>
  <!-- 言語の切り替え（/ と /en/）でページを作り直さない。開いているダイアログや回転中の状態を残す -->
  <nuxt-page page-key="index" />
</template>

<script setup lang="ts">
import { localeHeadLinks, localeHeadMeta } from "~/utils/seo";

// lang / canonical / hreflang / og:url / og:locale
const localeHead = useLocaleHead();
useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHeadLinks(localeHead.value.link),
  meta: localeHeadMeta(localeHead.value.meta),
}));
</script>
