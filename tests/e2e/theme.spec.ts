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

async function openDialog(page: Page, icon: string) {
  await page.locator(`header button:has(.${icon})`).click();
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
    await expectDark(page.locator("button:has(.mdi-card-plus-outline)"));
    // 入力欄自体には背景を付けない（付くとクリアボタンの領域だけ色が違って見える）
    expect((await color(itemInputs(page).first())).alpha).toBe(0);

    await page.locator("header button:has(.mdi-translate)").click();
    await expectDark(page.locator(".v-overlay--active .v-list"));
  });

  test("ダイアログとボタンの背景が暗い", async ({ page }) => {
    await page.goto("/");

    const settings = await openDialog(page, "mdi-cog-outline");
    await expectDark(settings);
    await expectDark(settings.getByRole("button", { name: "短い" }));
    await expectDark(settings.locator("button:has(.mdi-volume-off)"));
    // 見出しの文字が背景と同化しない
    expect((await color(settings.locator(".v-list-subheader").first(), "color")).luminance).toBeGreaterThan(120);
    await page.keyboard.press("Escape");

    const template = await openDialog(page, "mdi-database");
    await expectDark(template);
    await expectDark(template.locator("button:has(.mdi-check)").first());
    await page.keyboard.press("Escape");

    const tutorial = await openDialog(page, "mdi-help-circle-outline");
    await expectDark(tutorial);
    await expect(tutorial.locator("img").first()).toHaveAttribute("src", /-dark\.png$/);
    await page.keyboard.press("Escape");

    await page.locator("footer button:has(.mdi-export-variant)").click();
    const share = page.locator(".v-overlay--active .v-card").last();
    await expectDark(share);
    await expectDark(share.locator("button:has(.mdi-content-copy)"));
  });
});

test("全画面のダイアログが画面幅いっぱいに広がる", async ({ page }) => {
  await page.goto("/");
  const width = page.viewportSize()!.width;

  for (const icon of ["mdi-cog-outline", "mdi-database", "mdi-help-circle-outline"]) {
    const card = await openDialog(page, icon);
    expect((await card.boundingBox())!.width).toBe(width);
    await card.locator("button:has(.mdi-close)").first().click();
    await expect(page.locator(".v-overlay--active")).toHaveCount(0);
  }
});

test.describe("スマホ幅", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("項目リストのダイアログの背景が透けない", async ({ page }) => {
    await page.goto("/");
    await page.locator("button:has(.mdi-chevron-up)").click();
    const card = page.locator(".v-overlay--active .v-card").last();
    await expect(card).toBeVisible();
    expect((await color(card)).alpha).toBe(1);
  });
});
