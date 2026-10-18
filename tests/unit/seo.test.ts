import { describe, expect, it } from "vitest";
import { localeHeadLinks, localeHeadMeta, withTrailingSlash } from "~/utils/seo";

const ja = "https://natamz.github.io/Roulette/";
const en = "https://natamz.github.io/Roulette/en/";

describe("withTrailingSlash", () => {
  it("末尾に / がなければ付ける", () => {
    expect(withTrailingSlash("https://natamz.github.io/Roulette")).toBe(ja);
    expect(withTrailingSlash(en)).toBe(en);
  });
});

describe("localeHeadLinks", () => {
  // /Roulette/en/ を開いたときの useLocaleHead() の出力
  const links = [
    { id: "i18n-xd", rel: "alternate", href: "https://natamz.github.io/Roulette", hreflang: "x-default" },
    { id: "i18n-alt-ja", rel: "alternate", href: "https://natamz.github.io/Roulette", hreflang: "ja" },
    { id: "i18n-alt-en", rel: "alternate", href: en, hreflang: "en" },
    { id: "i18n-can", rel: "canonical", href: en },
  ];

  it("ja の URL の末尾に / を付ける", () => {
    expect(localeHeadLinks(links).find(link => link.hreflang === "ja")?.href).toBe(ja);
  });

  it("x-default を英語版に向ける", () => {
    expect(localeHeadLinks(links).find(link => link.hreflang === "x-default")?.href).toBe(en);
  });

  it("canonical と他の属性はそのまま", () => {
    const fixed = localeHeadLinks(links);
    expect(fixed.find(link => link.rel === "canonical")).toEqual(links[3]);
    expect(fixed.map(link => link.id)).toEqual(links.map(link => link.id));
  });
});

describe("localeHeadMeta", () => {
  it("og:url の末尾に / を付け、og:locale を ll_CC にする", () => {
    const meta = [
      { id: "i18n-og-url", property: "og:url", content: "https://natamz.github.io/Roulette" },
      { id: "i18n-og", property: "og:locale", content: "ja" },
      { id: "i18n-og-alt-en", property: "og:locale:alternate", content: "en" },
    ];
    expect(localeHeadMeta(meta)).toEqual([
      { id: "i18n-og-url", property: "og:url", content: ja },
      { id: "i18n-og", property: "og:locale", content: "ja_JP" },
      { id: "i18n-og-alt-en", property: "og:locale:alternate", content: "en_US" },
    ]);
  });
});
