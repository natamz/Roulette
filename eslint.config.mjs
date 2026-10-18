// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    // 既存のコンポーネント名（Roulette / Wheel / Responsive）を維持する
    "vue/multi-word-component-names": "off",
  },
}, {
  ignores: ["dist/**", ".output/**", ".nuxt/**"],
});
