const baseURL = process.env.NUXT_APP_BASE_URL;

export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxtjs/color-mode", "@nuxtjs/i18n"],
  app: {
    head: {
      htmlAttrs: {
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
  css: ["vuetify/lib/styles/main.sass"],
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
  eslint: {
    config: {
      // 既存コードのスタイル（ダブルクォート・セミコロンあり）に合わせる
      stylistic: {
        indent: 2,
        quotes: "double",
        semi: true,
      },
    },
  },
  i18n: {
    // hreflang / canonical の絶対 URL に使う。app.baseURL（/Roulette/）は i18n が後ろに足すので、オリジンだけを書く
    baseUrl: "https://natamz.github.io",
    locales: [
      { code: "ja", language: "ja", file: "ja.json", name: "日本語" },
      { code: "en", language: "en", file: "en.json", name: "English" },
    ],
    defaultLocale: "ja",
    // / が日本語、/en/ が英語。GitHub Pages が返す URL に合わせて末尾に / を付ける
    strategy: "prefix_except_default",
    trailingSlash: true,
    // 言語は URL で決める。ブラウザの言語で飛ばすと、クローラーがどちらかの言語しか見られなくなる
    detectBrowserLanguage: false,
  },
});
