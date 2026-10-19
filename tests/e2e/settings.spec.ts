import { expect, test } from "./fixtures";

async function openSettings(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "設定", exact: true }).click();
  const dialog = page.locator(".settintgs-dialog .v-card");
  await expect(dialog).toBeVisible();
  return dialog;
}

test("回転時間と効果音の設定がリロード後も残る", async ({ page }) => {
  await page.goto("/");
  let dialog = await openSettings(page);

  await dialog.getByRole("button", { name: "普通" }).click();
  await dialog.getByRole("button", { name: "効果音" }).click();
  await dialog.getByRole("button", { name: "3", exact: true }).click();

  expect(await page.evaluate(() => ({ ...localStorage }))).toMatchObject({
    rotationTime: "8000",
    audio: "true",
    audioResultType: "3",
  });

  await page.reload();
  dialog = await openSettings(page);
  await expect(dialog.getByRole("button", { name: "普通" })).toHaveClass(/bg-primary/);
  await expect(dialog.getByRole("button", { name: "効果音" })).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByRole("button", { name: "3", exact: true })).toHaveClass(/bg-primary/);
});

test("ダークテーマへの切り替えがリロード後も残る", async ({ page }) => {
  await page.goto("/");
  const dialog = await openSettings(page);

  await dialog.locator(".v-switch input").check();
  await expect(page.locator("html")).toHaveClass(/dark-mode/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark-mode/);
});

test("効果音の種類が未設定のときは 1 になる（#137）", async ({ page }) => {
  await page.goto("/");
  const dialog = await openSettings(page);

  await expect(dialog.getByRole("button", { name: "1", exact: true })).toHaveClass(/bg-primary/);
  expect(await page.evaluate(() => localStorage.getItem("audioResultType"))).toBe("1");
});
