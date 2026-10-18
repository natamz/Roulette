// OGP の og:locale は ll_CC の形式
const ogLocales: Record<string, string> = { ja: "ja_JP", en: "en_US" };

// GitHub Pages は末尾に / がない URL を / 付きへ 301 で飛ばすので、/ 付きに揃える
export function withTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

// useLocaleHead() の link（hreflang / canonical）を直す
// - ja（/）の URL だけは i18n の trailingSlash を設定しても末尾の / が落ちる
// - x-default は i18n が defaultLocale（ja）に固定するので、英語版に向ける
export function localeHeadLinks<T extends { href?: string; hreflang?: string }>(links: T[]): T[] {
  const fixed = links.map(link => (link.href ? { ...link, href: withTrailingSlash(link.href) } : link));
  const en = fixed.find(link => link.hreflang === "en")?.href;
  return fixed.map(link => (link.hreflang === "x-default" && en ? { ...link, href: en } : link));
}

// 構造化データ（JSON-LD）。評価やレビューが無いのでリッチリザルトの対象にはならないが、何のページかを伝える
// https://developers.google.com/search/docs/appearance/structured-data/software-app
export function webApplicationJsonLd(page: { name: string; description: string; url: string; inLanguage: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    ...page,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": 0 },
  };
}

// useLocaleHead() の meta（og:url / og:locale）を直す
export function localeHeadMeta<T extends { property?: string; content?: unknown }>(meta: T[]): T[] {
  return meta.map((m) => {
    if (typeof m.content !== "string") return m;
    if (m.property === "og:url") return { ...m, content: withTrailingSlash(m.content) };
    if (m.property === "og:locale" || m.property === "og:locale:alternate") {
      return { ...m, content: ogLocales[m.content] ?? m.content };
    }
    return m;
  });
}
