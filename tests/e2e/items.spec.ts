import { addItems, expect, itemInputs, storedNames, test } from "./fixtures";
import type { Locator, Page } from "@playwright/test";

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

test("名前を入力した直後に項目を削除しても、リロード後に戻らない（#180）", async ({ page }) => {
  await page.goto("/");
  await addItems(page, ["りんご", "みかん", "ぶどう"]);
  await expect.poll(() => storedNames(page)).toEqual(["りんご", "みかん", "ぶどう"]);

  // 入力で始まった保存が終わる前に、別のタスクで削除を押す
  await page.evaluate(() => {
    const input = document.querySelector<HTMLInputElement>(".list-group .v-text-field:not(.v-select) input")!;
    input.value = "りんご2";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    setTimeout(() => document.querySelectorAll<HTMLButtonElement>(".list-group button[aria-label='項目を削除']")[2]!.click());
  });
  await expect(itemInputs(page)).toHaveCount(2);
  await expect.poll(() => storedNames(page)).toEqual(["りんご2", "みかん"]);

  await page.reload();
  await expect(itemInputs(page)).toHaveCount(2);
});

test("ハンドルをドラッグすると並びが変わり、リロード後も残る", async ({ page }) => {
  await page.goto("/");
  await addItems(page, ["りんご", "みかん", "ぶどう"]);
  await expect.poll(() => storedNames(page)).toEqual(["りんご", "みかん", "ぶどう"]);

  // 3番目の行を、1番目の行の上の端に落とす
  const rows = page.locator(".list-group > .item-row");
  await rows.nth(2).locator(".handle").dragTo(rows.nth(0), { targetPosition: { x: 20, y: 5 } });

  await expect(itemInputs(page).nth(0)).toHaveValue("ぶどう");
  await expect.poll(() => storedNames(page)).toEqual(["ぶどう", "りんご", "みかん"]);

  await page.reload();
  await expect(itemInputs(page)).toHaveCount(3);
  await expect(itemInputs(page).nth(0)).toHaveValue("ぶどう");
  await expect(itemInputs(page).nth(1)).toHaveValue("りんご");
  await expect(itemInputs(page).nth(2)).toHaveValue("みかん");
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

  // スライドは pointer イベントで見ているので、マウスで動かしてもタッチと同じ処理を通る
  async function slide(page: Page, target: Locator, dx: number) {
    const box = (await target.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx, y, { steps: 10 });
    await page.mouse.up();
  }

  test("行を左にスライドすると削除ボタンが出て、押すと消える", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "項目を編集" }).click();
    await addItems(page, ["りんご", "みかん", "ぶどう"]);
    const row = page.locator(".list-group > .item-row").nth(1);
    const remove = row.getByRole("button", { name: "項目を削除" });
    await expect(remove).not.toBeInViewport();

    // 色のボタンの上から動かしても、パレットは開かない（開いているのは項目リストのダイアログだけ）
    await slide(page, row.getByRole("button", { name: "色を変更" }), -60);
    await expect(remove).toBeInViewport();
    await expect(page.locator(".v-overlay--active")).toHaveCount(1);

    await remove.click();
    await expect(itemInputs(page)).toHaveCount(2);
    await expect.poll(() => storedNames(page)).toEqual(["りんご", "ぶどう"]);
  });

  test("少しだけスライドしたときと、開いた行の本体を押したときは、削除ボタンを閉じる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "項目を編集" }).click();
    await addItems(page, ["りんご"]);
    const row = page.locator(".list-group > .item-row").first();
    const remove = row.getByRole("button", { name: "項目を削除" });
    const name = row.locator(".v-text-field:not(.v-select)");

    await slide(page, name, -20);
    await expect(remove).not.toBeInViewport();

    await slide(page, name, -60);
    await expect(remove).toBeInViewport();
    // 行の真ん中（名前の入力欄の上）を押す。開いているあいだ本体は押せないので、行が受け取る
    await row.click();
    await expect(remove).not.toBeInViewport();
    await expect(itemInputs(page)).toHaveCount(1);
  });

  test("操作の案内は、行をスライドすると消え、リロードするとまた出る", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "項目を編集" }).click();
    const hint = page.getByRole("note");
    // 行が無いときは出さない
    await expect(page.getByRole("button", { name: "項目を追加" })).toBeVisible();
    await expect(hint).toBeHidden();

    await addItems(page, ["りんご", "みかん"]);
    await expect(hint).toContainText("ドラッグで並び替え");
    await expect(hint).toContainText("左にスライドで削除");
    const color = page.locator(".list-group > .item-row").first().getByRole("button", { name: "色を変更" });

    // 少しだけ動かして閉じたときは、まだ出す
    await slide(page, color, -20);
    await expect(hint).toBeVisible();

    await slide(page, color, -60);
    await expect(hint).toBeHidden();

    // ダイアログを開き直しても出さない
    await page.locator(".v-overlay--active").getByRole("button", { name: "閉じる", exact: true }).click();
    await page.getByRole("button", { name: "項目を編集" }).click();
    await expect(itemInputs(page)).toHaveCount(2);
    await expect(hint).toBeHidden();

    await page.reload();
    await page.getByRole("button", { name: "項目を編集" }).click();
    await expect(hint).toBeVisible();
  });

  test("操作の案内は、閉じるボタンで消せる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "項目を編集" }).click();
    await addItems(page, ["りんご"]);
    const hint = page.getByRole("note");
    // 1件では並び替えの案内は出さない
    await expect(hint).toContainText("左にスライドで削除");
    await expect(hint).not.toContainText("ドラッグで並び替え");

    await hint.getByRole("button", { name: "案内を閉じる" }).click();
    await expect(hint).toBeHidden();
  });
});

test("PC の操作の案内は並び替えだけで、並び替えると消える", async ({ page }) => {
  await page.goto("/");
  const hint = page.getByRole("note");
  await addItems(page, ["りんご"]);
  // 1件では出さない
  await expect(hint).toBeHidden();

  await addItems(page, ["みかん"]);
  await expect(hint).toContainText("ドラッグで並び替え");
  await expect(hint).not.toContainText("左にスライドで削除");

  const rows = page.locator(".list-group > .item-row");
  await rows.nth(1).locator(".handle").dragTo(rows.nth(0), { targetPosition: { x: 20, y: 5 } });
  await expect(itemInputs(page).nth(0)).toHaveValue("みかん");
  await expect(hint).toBeHidden();
});
