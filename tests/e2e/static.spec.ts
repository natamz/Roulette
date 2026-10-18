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

test("生成された HTML に title / meta / OGP と本文が入っている", async ({ request }) => {
  const html = await getHtml(request, "/");

  expect(html).toContain("<title>webルーレット</title>");
  expect(html).toMatch(/<meta name="description" content="[^"]+"/);
  expect(html).toMatch(/<meta property="og:title" content="[^"]+"/);
  expect(html).toContain("開始");
});

for (const { path, lang, ogLocale } of [
  { path: "/", lang: "ja", ogLocale: "ja_JP" },
  { path: "/en/", lang: "en", ogLocale: "en_US" },
]) {
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
}
