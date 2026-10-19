import { legacyShareItems, legacyShareQuery } from "../fixtures/share";
import { addItems, expect, itemInputs, test } from "./fixtures";

test("既存の共有URLを開くと項目が取り込まれ、クエリが消える", async ({ page }) => {
  await page.goto("/");
  await addItems(page, ["上書きされる項目"]);

  await page.goto(`/?q=${legacyShareQuery}`);

  await expect(itemInputs(page)).toHaveCount(legacyShareItems.length);
  for (const [i, item] of legacyShareItems.entries()) {
    await expect(itemInputs(page).nth(i)).toHaveValue(item.name);
  }
  await expect(page).toHaveURL(url => !url.search.includes("q="));

  // 取り込んだ項目は IndexedDB に保存されている
  await page.reload();
  await expect(itemInputs(page)).toHaveCount(legacyShareItems.length);
});

test("共有ダイアログのURLを開くと同じ項目が復元される", async ({ page, browser }) => {
  await page.goto("/");
  await addItems(page, ["共有1", "共有2"]);

  await page.getByRole("button", { name: "共有", exact: true }).click();
  const url = await page.locator(".v-overlay--active input").inputValue();
  expect(url).toContain("?q=");

  // 別のコンテキスト（空の IndexedDB）で開く
  const other = await browser.newPage();
  await other.goto(url);
  await expect(itemInputs(other)).toHaveCount(2);
  await expect(itemInputs(other).nth(0)).toHaveValue("共有1");
  await expect(itemInputs(other).nth(1)).toHaveValue("共有2");
  await other.close();
});
