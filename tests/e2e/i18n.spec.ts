import { addItems, expect, itemInputs, storedNames, test } from "./fixtures";
import type { Page } from "@playwright/test";

async function switchLanguage(page: Page, name: string) {
  await page.locator("header").getByRole("link", { name }).click();
}

test("言語を切り替えると URL と表示が変わり、項目はそのまま残る", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "開始" })).toBeVisible();
  await addItems(page, ["カレー"]);
  await expect.poll(() => storedNames(page)).toEqual(["カレー"]);

  await switchLanguage(page, "English");
  await expect(page).toHaveURL("/en/");
  await expect(page.getByRole("button", { name: "Spin" })).toBeVisible();
  await expect(itemInputs(page).first()).toHaveValue("カレー");

  await page.reload();
  await expect(page.getByRole("button", { name: "Spin" })).toBeVisible();
  await expect(itemInputs(page).first()).toHaveValue("カレー");

  await switchLanguage(page, "日本語");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "開始" })).toBeVisible();
});

test("/en/ を直接開くと英語で表示される", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("button", { name: "Spin" })).toBeVisible();
});
