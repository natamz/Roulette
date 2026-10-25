import type { Page } from "@playwright/test";
import { legacyShareItems, legacyShareQuery } from "../fixtures/share";
import { addItems, expect, itemInputs, storedNames, test } from "./fixtures";

const snackbar = (page: Page, text: string) => page.locator(".v-snackbar__wrapper", { hasText: text });

// 途中で切れた共有URL
const brokenShareQuery = legacyShareQuery.slice(0, 40);

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

test("項目があるときに共有URLを開くと置き換わり、元に戻せる", async ({ page }) => {
  await page.goto("/");
  await addItems(page, ["今の項目"]);
  await expect.poll(() => storedNames(page)).toEqual(["今の項目"]);

  await page.goto(`/?q=${legacyShareQuery}`);
  await expect(itemInputs(page)).toHaveCount(legacyShareItems.length);
  const replaced = snackbar(page, "共有されたルーレットに置き換えました");
  await replaced.getByRole("button", { name: "元に戻す" }).click();

  await expect(replaced).toBeHidden();
  await expect(itemInputs(page)).toHaveCount(1);
  await expect(itemInputs(page).first()).toHaveValue("今の項目");
  await expect.poll(() => storedNames(page)).toEqual(["今の項目"]);
  await page.reload();
  await expect(itemInputs(page)).toHaveCount(1);
  await expect(itemInputs(page).first()).toHaveValue("今の項目");
});

test("項目が無いときは、案内を出さずに取り込む", async ({ page }) => {
  await page.goto(`/?q=${legacyShareQuery}`);
  await expect(itemInputs(page)).toHaveCount(legacyShareItems.length);
  await expect(snackbar(page, "共有されたルーレットに置き換えました")).toBeHidden();
});

test("読めない共有URLを開くと、今の項目を残して案内を出す", async ({ page }) => {
  await page.goto("/");
  await addItems(page, ["今の項目"]);
  await expect.poll(() => storedNames(page)).toEqual(["今の項目"]);

  await page.goto(`/?q=${brokenShareQuery}`);
  await expect(snackbar(page, "共有URLを読み込めませんでした")).toBeVisible();
  await expect(itemInputs(page)).toHaveCount(1);
  await expect(itemInputs(page).first()).toHaveValue("今の項目");
  await expect(page).toHaveURL(url => !url.search.includes("q="));
});

test("初回の案内と共有の案内は重ならず、下の案内を閉じると上の案内が下りる", async ({ page }) => {
  // fixtures はチュートリアルを見たことにしているので、見ていない状態に戻す
  await page.addInitScript(() => localStorage.removeItem("t"));
  await page.goto(`/?q=${brokenShareQuery}`);

  const guide = snackbar(page, "はじめての方は");
  const invalid = snackbar(page, "共有URLを読み込めませんでした");
  await expect(guide).toBeVisible();
  await expect(invalid).toBeVisible();
  // あとから出た共有の案内が、初回の案内の上にある
  await expect.poll(async () => {
    const lower = (await guide.boundingBox())!;
    const upper = (await invalid.boundingBox())!;
    return upper.y + upper.height <= lower.y;
  }).toBe(true);

  const top = (await invalid.boundingBox())!.y;
  await guide.getByRole("button", { name: "閉じる" }).click();
  await expect(guide).toBeHidden();
  await expect.poll(async () => (await invalid.boundingBox())!.y).toBeGreaterThan(top);
});
