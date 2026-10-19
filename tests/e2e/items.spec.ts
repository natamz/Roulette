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

test("Enter で次の項目の名前に移り、最後の項目では項目を足してそこに移る（#82）", async ({ page }) => {
  await page.goto("/");
  await addItems(page, ["りんご", "みかん"]);

  await itemInputs(page).nth(0).press("Enter");
  await expect(itemInputs(page).nth(1)).toBeFocused();

  await itemInputs(page).nth(1).press("Enter");
  await expect(itemInputs(page)).toHaveCount(3);
  await expect(itemInputs(page).nth(2)).toBeFocused();
});

test("項目リストは1つだけ描く（#181）", async ({ page }) => {
  await page.goto("/");
  await addItems(page, ["りんご"]);
  await expect(page.locator(".list-group")).toHaveCount(1);
});

test.describe("スマホ幅", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("項目リストは、ダイアログを開いたときだけ描く（#181）", async ({ page }) => {
    await page.goto("/");
    // ハイドレーションまでは CSS で隠したリストもあるが、マウントしたら消す
    await expect(page.locator(".list-group")).toHaveCount(0);

    await page.getByRole("button", { name: "項目を編集" }).click();
    await expect(page.locator(".list-group")).toHaveCount(1);
    await expect(page.locator(".v-overlay--active .list-group")).toHaveCount(1);
  });

  test("項目リストのダイアログでも、Enter で次の項目の名前に移る（#82）", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "項目を編集" }).click();
    // スマホ幅では項目リストがダイアログの中に描かれる
    const dialog = page.locator(".v-overlay--active");
    const inputs = dialog.locator(".list-group .v-text-field:not(.v-select) input");
    await dialog.getByRole("button", { name: "項目を追加" }).click();
    await expect(inputs).toHaveCount(1);

    await inputs.nth(0).fill("りんご");
    await inputs.nth(0).press("Enter");
    await expect(inputs).toHaveCount(2);
    await expect(inputs.nth(1)).toBeFocused();

    await inputs.nth(1).fill("みかん");
    await inputs.nth(0).press("Enter");
    await expect(inputs.nth(1)).toBeFocused();
  });
});
