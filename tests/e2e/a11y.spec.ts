import { addItems, expect, test } from "./fixtures";
import type { Locator, Page } from "@playwright/test";

// 名前（aria-label か文字）のない、表示されているボタンとリンク
// アイコンだけのボタンは、aria-label がないとスクリーンリーダーで「ボタン」としか読まれない
async function unnamed(scope: Page | Locator) {
  return scope.locator("button:visible, a:visible").evaluateAll(elements => elements
    .filter(el => !(el.getAttribute("aria-label") || el.textContent?.trim()))
    .map(el => el.outerHTML.slice(0, 150)));
}

for (const [device, viewport] of [["PC", { width: 1280, height: 800 }], ["スマホ", { width: 390, height: 844 }]] as const) {
  test(`${device}: ボタンとリンクに名前がある`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    if (device === "PC") await addItems(page, ["a"]);
    expect(await unnamed(page)).toEqual([]);

    // スマホのテンプレートは、項目リストのダイアログから開く
    for (const name of device === "PC" ? ["使い方", "テンプレート", "設定"] : ["使い方", "設定"]) {
      await page.locator("header").getByRole("button", { name, exact: true }).click();
      const dialog = page.locator(".v-overlay--active").last();
      await expect(dialog).toBeVisible();
      expect(await unnamed(dialog)).toEqual([]);
      await dialog.getByRole("button", { name: "閉じる" }).first().click();
      await expect(page.locator(".v-overlay--active")).toHaveCount(0);
    }

    await page.locator("header").getByRole("button", { name: "共有" }).click();
    const share = page.locator(".v-overlay--active").last();
    await expect(share).toBeVisible();
    expect(await unnamed(share)).toEqual([]);
  });
}

test("画面を拡大できる（viewport で maximum-scale を指定しない）", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toMatch(/<meta name="viewport" content="width=device-width, initial-scale=1">/);
});
