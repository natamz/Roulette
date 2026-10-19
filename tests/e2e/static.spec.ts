import { expect, test } from "./fixtures";
import type { APIRequestContext } from "@playwright/test";

// JS 実行前の HTML（クローラーや SNS が読む内容）を確認する
async function getHtml(request: APIRequestContext, path: string) {
  const res = await request.get(path);
  expect(res.ok()).toBeTruthy();
  return res.text();
}

// <link> / <meta> の属性を、並び順によらず取り出す
function tags(html: string, name: "link" | "meta") {
  return [...html.matchAll(new RegExp(`<${name}\\s[^>]*>`, "g"))].map(tag =>
    Object.fromEntries([...tag[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
  );
}

const pages = [
  { path: "/", lang: "ja", ogLocale: "ja_JP", title: "webルーレット｜無料で作れる抽選ルーレット", body: "開始" },
  { path: "/en/", lang: "en", ogLocale: "en_US", title: "Wheel Spinner – Free Random Picker Wheel", body: "Spin" },
];

for (const { path, lang, ogLocale, title, body } of pages) {
  test(`${path} の title / description / OGP と本文`, async ({ request }) => {
    const html = await getHtml(request, path);
    const meta = tags(html, "meta");
    const content = (key: string) => meta.find(m => m.name === key || m.property === key)?.content;

    expect(html).toContain(`<title>${title}</title>`);
    expect(content("description")).toBeTruthy();
    // 検索結果で途中で切れないよう、160 文字以内にする（#183）
    expect(content("description")!.length).toBeLessThanOrEqual(160);
    expect(content("og:title")).toBe(title);
    expect(content("og:description")).toBe(content("description"));
    expect(content("og:site_name")).toBeTruthy();
    expect(html).toContain(`>${body}<`);

    // og:image は絶対 URL で、その画像が返る
    const image = content("og:image")!;
    expect(image).toMatch(new RegExp(`^https://.+/images/ogp-${lang}\\.png$`));
    expect(content("twitter:image")).toBe(image);
    expect(content("og:image:alt")).toBeTruthy();
    expect((await request.get(new URL(image).pathname)).ok()).toBeTruthy();
  });

  test(`${path} の lang / canonical / hreflang / og:url`, async ({ request }) => {
    const html = await getHtml(request, path);
    const links = tags(html, "link");
    const meta = tags(html, "meta");
    const pathOf = (url?: string) => new URL(url!).pathname;

    expect(html).toMatch(new RegExp(`<html[^>]* lang="${lang}"`));

    // canonical は自分自身。GitHub Pages が返す URL と同じく末尾は /
    const canonical = links.find(link => link.rel === "canonical")?.href;
    expect(pathOf(canonical)).toBe(path);
    expect(meta.find(m => m.property === "og:url")?.content).toBe(canonical);
    expect(meta.find(m => m.property === "og:locale")?.content).toBe(ogLocale);

    // 両方の言語を指し、x-default は英語版
    const hreflang = (code: string) => links.find(link => link.rel === "alternate" && link.hreflang === code)?.href;
    expect(pathOf(hreflang("ja"))).toBe("/");
    expect(pathOf(hreflang("en"))).toBe("/en/");
    expect(hreflang("x-default")).toBe(hreflang("en"));
  });

  test(`${path} はコンポーネントの CSS をインラインで入れない（#175）`, async ({ request }) => {
    const html = await getHtml(request, path);
    // インラインの <style> は Vuetify のテーマの変数だけ。コンポーネントの CSS は <link> のファイルで読む
    expect([...html.matchAll(/<style[^>]*>/g)].map(([tag]) => tag)).toEqual([`<style id="vuetify-theme-stylesheet">`]);
    expect(tags(html, "link").filter(link => link.rel === "stylesheet")).not.toHaveLength(0);
  });

  test(`${path} の構造化データ`, async ({ request }) => {
    const html = await getHtml(request, path);
    const json = html.match(/<script type="application\/ld\+json"[^>]*>([^<]+)<\/script>/)?.[1];
    const data = JSON.parse(json!);
    const canonical = tags(html, "link").find(link => link.rel === "canonical")?.href;

    expect(data["@type"]).toBe("WebApplication");
    expect(data.url).toBe(canonical);
    expect(data.inLanguage).toBe(lang);
    expect(data.offers.price).toBe(0);
  });

  test(`${path} に、両方の言語版への <a href> がある（#173）`, async ({ request }) => {
    const html = await getHtml(request, path);
    // クローラーがたどるのは <a href>。ヘッダーの言語メニューの中身は開くまで描かれないので、フッターのリンクで出す
    const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]*)"/g)].map(([, href]) => href);
    expect(hrefs).toEqual(expect.arrayContaining(["/", "/en/"]));
  });
}

test("sitemap.xml に両方の言語の URL が入っている", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.ok()).toBeTruthy();
  const xml = await res.text();
  expect(xml).toContain("<loc>https://natamz.github.io/Roulette/</loc>");
  expect(xml).toContain("<loc>https://natamz.github.io/Roulette/en/</loc>");
  expect(xml).toContain(`hreflang="x-default" href="https://natamz.github.io/Roulette/en/"`);
});
