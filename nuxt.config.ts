import { defineNuxtConfig } from "nuxt";

const baseURL = process.env.baseURL;

// https://v3.nuxtjs.org/api/configuration/nuxt.config
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
      title: "ルーレット",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
        { name: "description", content: "roulette web application" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: `${baseURL}/favicons/favicon.ico`,
        },
        {
          rel: "icon",
          type: "image/png",
          href: `${baseURL}/favicons/icon-192x192.png`,
        },
        {
          rel: "apple-touch-icon",
          type: "image/png",
          href: `${baseURL}/favicons/apple-touch-icon-180x180.png`,
        },
      ],
    },
  },
});
