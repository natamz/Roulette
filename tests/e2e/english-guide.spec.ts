import { expect, test } from "./fixtures";
import type { Page } from "@playwright/test";

const guide = (page: Page) => page.locator(".v-snackbar", { hasText: "English version" });

test.describe("ブラウザの言語が英語", () => {
  test.use({ locale: "en-US" });

  test("日本語版を開くと初回だけ英語版を案内する", async ({ page }) => {
    await page.goto("/");
    await expect(guide(page)).toBeVisible();

    await guide(page).getByRole("link", { name: "English version" }).click();
    await expect(page).toHaveURL("/en/");
    await expect(page.getByRole("button", { name: "Spin" })).toBeVisible();
    await expect(guide(page)).toBeHidden();

    await page.goto("/");
    await expect(page.getByRole("button", { name: "開始" })).toBeVisible();
    await expect(guide(page)).toBeHidden();
  });

  test("英語版では案内しない", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.getByRole("button", { name: "Spin" })).toBeVisible();
    await expect(guide(page)).toBeHidden();
  });
});

test("ブラウザの言語が日本語なら案内しない", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "開始" })).toBeVisible();
  await expect(guide(page)).toBeHidden();
});
