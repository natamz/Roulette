import vuetify from "vite-plugin-vuetify";

const baseURL = process.env.NUXT_APP_BASE_URL;

export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxtjs/color-mode", "@nuxtjs/i18n"],
  app: {
    head: {
      htmlAttrs: {
        prefix: "og: https://ogp.me/ns#",
      },
      // 言語で変わる title / description / OGP は app.vue で出す
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "google-site-verification", content: "p6tyJpuorBw-qfK70bDg9BSVnUU7i6zai-yiAwH-BG0" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      link: [
        // ブラウザが用途に合う大きさの方を選べるよう、sizes を書く（favicon.ico の中身は 32×32 の ICO）
        { rel: "icon", sizes: "32x32", href: `${baseURL}favicons/favicon.ico` },
        { rel: "icon", type: "image/png", sizes: "192x192", href: `${baseURL}favicons/icon-192x192.png` },
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
  features: {
    // コンポーネントの CSS を HTML にインラインで入れない。入れると、同じ CSS を <link> のファイルでも読むことになる
    inlineStyles: false,
  },
  vite: {
    // テンプレートで使った Vuetify のコンポーネント（とその CSS）だけを読み込む
    plugins: [vuetify({ autoImport: true })],
    define: {
      "process.env.DEBUG": false,
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
