import { addItems, expect, itemInputs, test } from "./fixtures";
import type { Locator, Page } from "@playwright/test";

// 色の RGBA と輝度（0〜255）を返す
async function color(locator: Locator, property: "backgroundColor" | "color" = "backgroundColor") {
  const value = await locator.evaluate((el, p) => getComputedStyle(el)[p], property);
  const [r = 0, g = 0, b = 0, a = 1] = value.match(/[\d.]+/g)!.map(Number);
  return { alpha: a, luminance: 0.299 * r + 0.587 * g + 0.114 * b };
}

// ダークテーマで背景が暗いこと。テーマの上書き漏れでライトの色が残ると白っぽくなる
async function expectDark(locator: Locator) {
  await expect(locator).toBeVisible();
  const { alpha, luminance } = await color(locator);
  expect(alpha).toBeGreaterThan(0);
  expect(luminance).toBeLessThan(80);
}

async function openDialog(page: Page, name: string) {
  await page.locator("header").getByRole("button", { name, exact: true }).click();
  const card = page.locator(".v-overlay--active .v-card").last();
  await expect(card).toBeVisible();
  return card;
}

test.describe("ダークテーマ", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("nuxt-color-mode", "dark"));
  });

  test("画面とメニューの背景が暗い", async ({ page }) => {
    await page.goto("/");
    await addItems(page, ["a"]);

    await expectDark(page.locator("header"));
    await expectDark(page.locator("footer"));
    await expectDark(page.getByRole("button", { name: "項目を追加" }));
    // 入力欄自体には背景を付けない（付くとクリアボタンの領域だけ色が違って見える）
    expect((await color(itemInputs(page).first())).alpha).toBe(0);

    await page.locator("header").getByRole("button", { name: "言語" }).click();
    await expectDark(page.locator(".v-overlay--active .v-list"));
  });

  test("ダイアログとボタンの背景が暗い", async ({ page }) => {
    await page.goto("/");

    const settings = await openDialog(page, "設定");
    await expectDark(settings);
    await expectDark(settings.getByRole("button", { name: "短い" }));
    await expectDark(settings.getByRole("button", { name: "効果音" }));
    // 見出しの文字が背景と同化しない
    expect((await color(settings.locator(".v-list-subheader").first(), "color")).luminance).toBeGreaterThan(120);
    await page.keyboard.press("Escape");

    const template = await openDialog(page, "テンプレート");
    await expectDark(template);
    await expectDark(template.getByRole("button", { name: /を使う$/ }).first());
    await page.keyboard.press("Escape");

    const tutorial = await openDialog(page, "使い方");
    await expectDark(tutorial);
    await expect(tutorial.locator("img").first()).toHaveAttribute("src", /-dark\.png$/);
    await page.keyboard.press("Escape");

    await page.locator("footer").getByRole("button", { name: "共有" }).click();
    const share = page.locator(".v-overlay--active .v-card").last();
    await expectDark(share);
    await expectDark(share.getByRole("button", { name: "URLをコピー" }));
  });
});

test.describe("OS の設定がダーク", () => {
  // 設定を保存していない初回訪問。color-mode はハイドレーション前に dark を決める
  test.use({ colorScheme: "dark" });

  test("画面の背景が暗い", async ({ page }) => {
    await page.goto("/");

    await expectDark(page.locator(".v-application"));
    await expectDark(page.locator("header"));
    await expectDark(page.locator("footer"));
  });
});

test("全画面のダイアログが画面幅いっぱいに広がる", async ({ page }) => {
  await page.goto("/");
  const width = page.viewportSize()!.width;

  for (const name of ["設定", "テンプレート", "使い方"]) {
    const card = await openDialog(page, name);
    expect((await card.boundingBox())!.width).toBe(width);
    await card.getByRole("button", { name: "閉じる" }).first().click();
    await expect(page.locator(".v-overlay--active")).toHaveCount(0);
  }
});

test.describe("スマホ幅", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("項目リストのダイアログの背景が透けない", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "項目を編集" }).click();
    const card = page.locator(".v-overlay--active .v-card").last();
    await expect(card).toBeVisible();
    expect((await color(card)).alpha).toBe(1);
  });
});
