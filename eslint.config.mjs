// @ts-check
import { createConfigForNuxt } from "@nuxt/eslint-config";

export default createConfigForNuxt({
  features: {
    // 既存コードのスタイル（ダブルクォート・セミコロンあり）に合わせる
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
  },
}).append({
  rules: {
    // 既存のコンポーネント名（Roulette / Wheel / Responsive）を維持する
    "vue/multi-word-component-names": "off",
  },
}, {
  ignores: ["dist/**", ".output/**", ".nuxt/**"],
});
