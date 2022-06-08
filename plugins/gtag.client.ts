import { defineNuxtPlugin } from "#app";
import VueGtag from "vue-gtag";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    VueGtag,
    {
      appName: "roulette",
      pageTrackerScreenviewEnabled: true,
      config: { id: "G-5C5ZTVTD0H" },
    },
    useRouter()
  );
});
