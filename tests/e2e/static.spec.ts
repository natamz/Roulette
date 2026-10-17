import { expect, test } from "./fixtures";

// JS 実行前の HTML（クローラーや SNS が読む内容）を確認する
test("生成された HTML に title / meta / OGP と本文が入っている", async ({ request }) => {
  const res = await request.get("/");
  expect(res.ok()).toBeTruthy();
  const html = await res.text();

  expect(html).toContain("<title>webルーレット</title>");
  expect(html).toMatch(/<meta name="description" content="[^"]+"/);
  expect(html).toMatch(/<meta property="og:title" content="[^"]+"/);
  expect(html).toMatch(/<meta property="og:url" content="[^"]+"/);
  expect(html).toContain("開始");
});
