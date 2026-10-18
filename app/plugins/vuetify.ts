import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      themes: {
        light: {
          colors: {
            error: "#e34c26",
          },
        },
        dark: {
          colors: {
            "background": "#0e2436",
            "surface": "#173049",
            "on-background": "#c5ccca",
            "on-surface": "#c5ccca",
            "primary": "#4d2c99",
            "error": "#ad3a1d",
          },
        },
      },
    },
    components,
    directives,
  });
  nuxtApp.vueApp.use(vuetify);

  // ダークモードの切り替えは @nuxtjs/color-mode が持つので、Vuetify のテーマをそれに合わせる
  const colorMode = useColorMode();
  const syncTheme = () => {
    watch(
      () => colorMode.value,
      value => vuetify.theme.change(value === "dark" ? "dark" : "light"),
      { immediate: true },
    );
  };
  // 静的 HTML はライトのテーマで出力される。ハイドレーション中にテーマを変えると、
  // 食い違った class が本番では直されずライトのまま残るので、マウント後に合わせる
  if (nuxtApp.isHydrating) {
    nuxtApp.hook("app:mounted", syncTheme);
  }
  else {
    syncTheme();
  }
});
