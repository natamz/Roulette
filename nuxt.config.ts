const baseURL = process.env.NUXT_APP_BASE_URL;

export default defineNuxtConfig({
  modules: ["@nuxtjs/color-mode", "@nuxtjs/i18n"],
  app: {
    head: {
      htmlAttrs: {
        lang: "ja",
        prefix: "og:http://ogp.me/ns#",
      },
      title: "webルーレット",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
        { name: "description", content: "ルーレットのwebアプリケーションです" },
        { name: "google-site-verification", content: "p6tyJpuorBw-qfK70bDg9BSVnUU7i6zai-yiAwH-BG0" },
        { property: "og:site_name", content: "webルーレット" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://natamz.github.io/Roulette" },
        { property: "og:title", content: "webルーレット" },
        { property: "og:description", content: "ルーレットのwebアプリケーションです" },
        { property: "og:image", content: "サイトイメージ" },
        { name: "twitter:image", content: "サイトイメージ" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: `${baseURL}favicons/favicon.ico` },
        { rel: "icon", type: "image/png", href: `${baseURL}favicons/icon-192x192.png` },
        { rel: "apple-touch-icon", type: "image/png", href: `${baseURL}favicons/apple-touch-icon-180x180.png` },
      ],
    },
  },
  css: ["vuetify/lib/styles/main.sass", "~/assets/styles/theme.scss"],
  colorMode: {
    classSuffix: "-mode",
  },
  runtimeConfig: {
    public: {
      gaid: "",
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },
  typescript: {
    tsConfig: {
      include: ["../tests/unit/**/*"],
    },
    nodeTsConfig: {
      include: ["../tests/e2e/**/*", "../tests/fixtures/**/*", "../vitest.config.mts", "../playwright.config.ts"],
    },
  },
  i18n: {
    locales: [
      { code: "ja", language: "ja", file: "ja.json", name: "日本語" },
      { code: "en", language: "en", file: "en.json", name: "English" },
    ],
    defaultLocale: "ja",
    strategy: "no_prefix",
    detectBrowserLanguage: { useCookie: true, cookieKey: "i18n_redirected", redirectOn: "root", alwaysRedirect: true },
  },
});
