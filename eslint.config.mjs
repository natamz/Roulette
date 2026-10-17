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
  ignores: ["dist/**", ".output/**", ".nuxt/**"],
});
