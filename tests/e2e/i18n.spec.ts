import { expect, test } from "./fixtures";

test("言語を英語に切り替えると表示が変わり、リロード後も残る", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "開始" })).toBeVisible();

  await page.locator("header button:has(.mdi-translate)").click();
  await page.locator(".v-overlay--active .v-list-item", { hasText: "English" }).click();
  await expect(page.getByRole("button", { name: "start" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "start" })).toBeVisible();
});
