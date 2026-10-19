import { expect, test } from "./fixtures";
import type { Page } from "@playwright/test";

test("使い方の画像は読み込む前から高さがあり、alt が付いている（#170）", async ({ page }) => {
  // 画像を読み込ませない。読み込んだときに下の文やボタンがずれないよう、読み込む前から場所を取っていること
  await page.route(/\/images\/tutorial-/, route => route.abort());
  await page.goto("/");
  await page.locator("header").getByRole("button", { name: "使い方", exact: true }).click();

  const images = page.locator(".v-overlay--active .v-img");
  await expect(images).toHaveCount(2);
  for (const image of await images.all()) {
    expect((await image.boundingBox())!.height).toBeGreaterThan(100);
    await expect(image.locator("img")).toHaveAttribute("alt", /.+/);
  }
});

test.describe("初回訪問", () => {
  const guide = (page: Page, text: string) => page.locator(".v-snackbar", { hasText: text });
  const dialog = (page: Page) => page.locator(".v-overlay--active .v-card");

  test.beforeEach(async ({ page }) => {
    // fixtures はチュートリアルを見たことにしているので、最初に開いたときだけ見ていない状態に戻す
    await page.addInitScript(() => {
      if (sessionStorage.getItem("firstVisit") !== null) return;
      sessionStorage.setItem("firstVisit", "done");
      localStorage.removeItem("t");
    });
  });

  test("使い方は自動で開かず、案内から開ける（#172）", async ({ page }) => {
    await page.goto("/");
    await expect(guide(page, "はじめての方は")).toBeVisible();
    await expect(dialog(page)).toHaveCount(0);

    await guide(page, "はじめての方は").getByRole("button", { name: "使い方" }).click();
    await expect(dialog(page)).toBeVisible();
    await expect(dialog(page).locator(".v-toolbar-title")).toHaveText("使い方");
    await expect(guide(page, "はじめての方は")).toBeHidden();

    // 2回目からは案内しない
    await page.reload();
    await expect(page.getByRole("button", { name: "開始" })).toBeVisible();
    await expect(guide(page, "はじめての方は")).toBeHidden();
  });

  test.describe("ブラウザの言語が英語", () => {
    test.use({ locale: "en-US" });

    test("日本語版では English の案内と重ねない", async ({ page }) => {
      await page.goto("/");
      await expect(guide(page, "English version")).toBeVisible();
      await expect(guide(page, "はじめての方は")).toBeHidden();
    });

    test("英語版では案内する", async ({ page }) => {
      await page.goto("/en/");
      await expect(guide(page, "New here?")).toBeVisible();
      await expect(dialog(page)).toHaveCount(0);
    });
  });
});
