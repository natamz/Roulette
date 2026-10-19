import { addItems, expect, itemInputs, storedNames, test } from "./fixtures";

test("項目の追加・削除がリロード後も残る", async ({ page }) => {
  await page.goto("/");
  await addItems(page, ["りんご", "みかん", "ぶどう"]);
  await expect(itemInputs(page)).toHaveCount(3);
  await expect.poll(() => storedNames(page)).toEqual(["りんご", "みかん", "ぶどう"]);

  await page.reload();
  await expect(itemInputs(page)).toHaveCount(3);
  await expect(itemInputs(page).nth(1)).toHaveValue("みかん");

  await page.locator(".list-group").getByRole("button", { name: "項目を削除" }).nth(1).click();
  await expect(itemInputs(page)).toHaveCount(2);
  await expect.poll(() => storedNames(page)).toEqual(["りんご", "ぶどう"]);

  await page.reload();
  await expect(itemInputs(page)).toHaveCount(2);
  await expect(itemInputs(page).nth(0)).toHaveValue("りんご");
  await expect(itemInputs(page).nth(1)).toHaveValue("ぶどう");
});

test("テンプレートを選ぶと項目が置き換わる", async ({ page }) => {
  await page.goto("/");
  await addItems(page, ["消える項目"]);

  await page.getByRole("button", { name: "テンプレート", exact: true }).click();
  const dialog = page.locator(".v-overlay--active");
  const firstTemplate = dialog.locator(".v-list-item").first();
  await firstTemplate.locator("button").click();

  await expect(itemInputs(page).first()).not.toHaveValue("消える項目");
  expect(await itemInputs(page).count()).toBeGreaterThan(0);
});
