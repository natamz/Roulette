import { describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";
import { darkModeFallbackStyles } from "~/utils/theme";

describe("darkModeFallbackStyles", () => {
  // Vuetify が実際に出す CSS で確かめる（Vuetify を上げて形式が変わったら落ちる）
  const vuetify = createVuetify({
    theme: { themes: { dark: { colors: { background: "#0e2436" } } } },
  });
  const css = darkModeFallbackStyles(vuetify.theme.styles.value);

  it("html が dark-mode のとき、ライトのテーマの class にダークの変数を当てる", () => {
    expect(css.startsWith("html.dark-mode, html.dark-mode .v-theme--light {")).toBe(true);
    expect(css).toContain("color-scheme: dark;");
    expect(css).toContain("--v-theme-background: 14,36,54;");
  });

  it("ライトのテーマの変数は入れない", () => {
    expect(css).not.toContain("color-scheme: normal");
    expect(css).not.toContain("--v-theme-background: 255,255,255;");
  });

  it(".v-theme--dark がなければ空", () => {
    expect(darkModeFallbackStyles(":root { --v-theme-background: 255,255,255; }")).toBe("");
  });
});
