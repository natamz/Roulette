import { createVuetify } from "vuetify";
import { darkModeFallbackStyles } from "~/utils/theme";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import {
  mdiCardPlusOutline,
  mdiCheck,
  mdiCheckOutline,
  mdiCogOutline,
  mdiContentCopy,
  mdiDatabase,
  mdiDragHorizontalVariant,
  mdiExportVariant,
  mdiGestureSwipeLeft,
  mdiGestureTap,
  mdiHelpCircleOutline,
  mdiTranslate,
  mdiTrashCanOutline,
  mdiVolumeHigh,
  mdiVolumeOff,
  mdiWeatherNight,
  mdiWeatherSunny,
} from "@mdi/js";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: "mdi",
      // アイコンは SVG（使う分だけバンドルに入る）。テンプレートでは "$help" のようにエイリアスで書く
      // 閉じるは Vuetify 組み込みの "$close" を使う
      aliases: {
        ...aliases,
        help: mdiHelpCircleOutline,
        translate: mdiTranslate,
        template: mdiDatabase,
        settings: mdiCogOutline,
        share: mdiExportVariant,
        copy: mdiContentCopy,
        copied: mdiCheckOutline,
        apply: mdiCheck,
        addItem: mdiCardPlusOutline,
        drag: mdiDragHorizontalVariant,
        // "$delete" は Vuetify 組み込み（チップの削除）なので別名にする
        deleteItem: mdiTrashCanOutline,
        swipeLeft: mdiGestureSwipeLeft,
        tap: mdiGestureTap,
        soundOn: mdiVolumeHigh,
        soundOff: mdiVolumeOff,
        themeLight: mdiWeatherSunny,
        themeDark: mdiWeatherNight,
      },
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
    // コンポーネントは nuxt.config.ts の vite-plugin-vuetify が、使った分だけ import する
  });
  nuxtApp.vueApp.use(vuetify);

  // 静的 HTML はライトのテーマで出力されるので、OS の設定がダークの人にはハイドレーションまで白い画面が出る（#158）
  // color-mode が html に dark-mode を付けたら、ライトのテーマの class にもダークの変数を当てる
  useHead({
    style: [{ id: "dark-mode-fallback", textContent: darkModeFallbackStyles(vuetify.theme.styles.value) }],
  });

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
