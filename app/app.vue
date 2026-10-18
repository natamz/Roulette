<template>
  <!-- 言語の切り替え（/ と /en/）でページを作り直さない。開いているダイアログや回転中の状態を残す -->
  <nuxt-page page-key="index" />
</template>

<script setup lang="ts">
import { localeHeadLinks, localeHeadMeta, webApplicationJsonLd, withTrailingSlash } from "~/utils/seo";

const { t, locale, baseUrl } = useI18n();

// lang / canonical / hreflang / og:url / og:locale
const localeHead = useLocaleHead();
const links = computed(() => localeHeadLinks(localeHead.value.link));
const canonical = computed(() => links.value.find(link => link.rel === "canonical")?.href ?? "");
useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: links.value,
  meta: localeHeadMeta(localeHead.value.meta),
  script: [{
    type: "application/ld+json",
    innerHTML: JSON.stringify(webApplicationJsonLd({
      name: t("site_name"),
      description: t("seo_description"),
      url: canonical.value,
      inLanguage: locale.value,
    })),
  }],
}));

// og:image は絶対 URL にする（baseUrl は /Roulette/ まで入っている）
const ogImage = computed(() => `${withTrailingSlash(baseUrl.value)}images/ogp-${locale.value}.png`);
useSeoMeta({
  title: () => t("seo_title"),
  description: () => t("seo_description"),
  ogSiteName: () => t("site_name"),
  ogTitle: () => t("seo_title"),
  ogDescription: () => t("seo_description"),
  ogImage: () => ogImage.value,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: "image/png",
  ogImageAlt: () => t("ogp_image_alt"),
  twitterImage: () => ogImage.value,
  twitterImageAlt: () => t("ogp_image_alt"),
});
</script>
