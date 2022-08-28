import { defineNuxtConfig } from "nuxt";

const baseURL = process.env.baseURL;

export default defineNuxtConfig({
  css: ["vuetify/lib/styles/main.sass", "@/assets/styles/theme.scss"],
  modules: ["@nuxtjs/color-mode"],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  app: {
    baseURL: baseURL,
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
        { hid: "og:site_name", property: "og:site_name", content: "webルーレット" },
        { hid: "og:type", property: "og:type", content: "website" },
        { hid: "og:url", property: "og:url", content: "https://natamz.github.io/Roulette" },
        { hid: "og:title", property: "og:title", content: "webルーレット" },
        { hid: "og:description", property: "og:description", content: "ルーレットのwebアプリケーションです" },
        { hid: "og:image", property: "og:image", content: "サイトイメージ" },
        { hid: "twitter:image", name: "twitter:image", content: "サイトイメージ" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: `${baseURL}/favicons/favicon.ico` },
        { rel: "icon", type: "image/png", href: `${baseURL}/favicons/icon-192x192.png` },
        { rel: "apple-touch-icon", type: "image/png", href: `${baseURL}/favicons/apple-touch-icon-180x180.png` },
      ],
    },
  },
  runtimeConfig: {
    public: {
      gaid: "",
    },
  },
});
