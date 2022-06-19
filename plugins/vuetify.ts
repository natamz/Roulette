import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    createVuetify({
      icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
          mdi,
        },
      },
      components,
      directives,
    })
  );
});
