import { createGtag } from "vue-gtag";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  nuxtApp.vueApp.use(createGtag({
    tagId: config.public.gaid,
  }));
});
