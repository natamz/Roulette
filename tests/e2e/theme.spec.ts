import { addItems, expect, itemInputs, test } from "./fixtures";
import type { Locator, Page } from "@playwright/test";

// 色の RGBA と輝度（0〜255）を返す
async function color(locator: Locator, property: "backgroundColor" | "color" = "backgroundColor") {
  const value = await locator.evaluate((el, p) => getComputedStyle(el)[p], property);
  const [r = 0, g = 0, b = 0, a = 1] = value.match(/[\d.]+/g)!.map(Number);
  return { alpha: a, luminance: 0.299 * r + 0.587 * g + 0.114 * b };
}

// ダークテーマで背景が暗いこと。テーマの上書き漏れでライトの色が残ると白っぽくなる
// テーマはマウントしてからダークに切り替わり、ボタンは背景色に transition（0.28s）があるので、暗くなるまで待つ（#166）
async function expectDark(locator: Locator) {
  await expect(locator).toBeVisible();
  await expect.poll(async () => (await color(locator)).luminance).toBeLessThan(80);
  expect((await color(locator)).alpha).toBeGreaterThan(0);
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

  test("画面の背景が暗い", async ({ page }) => {
    await page.goto("/");
    await addItems(page, ["a"]);

    await expectDark(page.locator("header"));
    await expectDark(page.getByRole("button", { name: "項目を追加" }));
    // 入力欄自体には背景を付けない（付くとクリアボタンの領域だけ色が違って見える）
    expect((await color(itemInputs(page).first())).alpha).toBe(0);
  });

  test("ダイアログとボタンの背景が暗い", async ({ page }) => {
    await page.goto("/");

    const settings = await openDialog(page, "設定");
    await expectDark(settings);
    await expectDark(settings.getByRole("button", { name: "2", exact: true }));
    // 見出しの文字が背景と同化しない
    expect((await color(settings.getByText("回転時間", { exact: true }), "color")).luminance).toBeGreaterThan(120);
    await page.keyboard.press("Escape");

    const template = await openDialog(page, "テンプレート");
    await expectDark(template);
    await expectDark(template.getByRole("button", { name: /を使う$/ }).first());
    await page.keyboard.press("Escape");

    const tutorial = await openDialog(page, "使い方");
    await expectDark(tutorial);
    await expect(tutorial.locator("img").first()).toHaveAttribute("src", /-dark\.png$/);
    await page.keyboard.press("Escape");

    await page.locator("header").getByRole("button", { name: "共有" }).click();
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
  });

  test("設定のダークモードのスイッチがオンになっていて、オフにするとライトになる", async ({ page }) => {
    await page.goto("/");
    const settings = await openDialog(page, "設定");
    const toggle = settings.getByRole("switch", { name: "ダークモード" });

    await expect(toggle).toBeChecked();
    await toggle.uncheck();
    await expect(page.locator("html")).toHaveClass(/light-mode/);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/light-mode/);
  });

  test("ハイドレーションの前から画面の背景が暗い（#158）", async ({ page }) => {
    // アプリの JS を止める。color-mode が html の class を決めるインラインのスクリプトは動く
    await page.route(/\/_nuxt\/.*\.js$/, route => route.abort());
    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(/dark-mode/);
    await expect(page.locator(".v-application")).toHaveClass(/v-theme--light/);
    await expectDark(page.locator(".v-application"));
    await expectDark(page.locator("header"));
    await expectDark(page.getByRole("button", { name: "開始" }));
  });
});

test.describe("OS の設定がライト", () => {
  test.use({ colorScheme: "light" });

  test("ハイドレーションの前の画面はライトのまま", async ({ page }) => {
    await page.route(/\/_nuxt\/.*\.js$/, route => route.abort());
    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(/light-mode/);
    await expect.poll(async () => (await color(page.locator(".v-application"))).luminance).toBeGreaterThan(200);
  });
});

// 設定は PC では中央のカード（settings.spec.ts）
test("全画面のダイアログが画面幅いっぱいに広がる", async ({ page }) => {
  await page.goto("/");
  const width = page.viewportSize()!.width;

  for (const name of ["テンプレート", "使い方"]) {
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
