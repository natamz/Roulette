import { addItems, expect, itemInputs, test } from "./fixtures";

test("回転すると結果ダイアログに当選した項目が出る", async ({ page }) => {
  const names = ["A案", "B案", "C案"];
  await page.goto("/");
  await addItems(page, names);

  await page.getByRole("button", { name: "開始" }).click();

  const dialog = page.locator(".v-overlay--active");
  await expect(dialog.getByText("結果は・・・")).toBeVisible();
  const result = await dialog.locator("h1").textContent();
  expect(names).toContain(result?.trim());
});

test("回転中は項目リストを操作できない", async ({ page }) => {
  // 回転時間を約 3 秒にする（fixtures の初期化スクリプトのあとに上書きする）
  await page.addInitScript(() => localStorage.setItem("rotationTime", "3000"));
  await page.goto("/");
  await addItems(page, ["A案", "B案", "C案"]);

  await page.getByRole("button", { name: "開始" }).click();

  // 名前の入力欄にフォーカスできない
  // not.toBeFocused() だと、止まって結果ダイアログにフォーカスが移るまで待って通ってしまうので、その場で見る
  const focused = await itemInputs(page).first().evaluate((input) => {
    input.focus();
    return document.activeElement === input;
  });
  expect(focused).toBe(false);
  // 削除ボタンを押しても消えない
  await page.locator(".list-group button[aria-label='項目を削除']").first().click({ force: true });

  await expect(page.locator(".v-overlay--active").getByText("結果は・・・")).toBeVisible();
  await expect(itemInputs(page)).toHaveCount(3);
});

test("止まったあとにテーマや項目の名前を変えても、円の角度が変わらない（#204）", async ({ page }) => {
  // 扇形の canvas。指針とラベルは別の canvas なので、テーマの色や名前では変わらない
  const wheel = () => page.locator("#canvas").evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  await page.goto("/");
  await addItems(page, ["A案", "B案", "C案"]);
  const initial = await wheel();

  await page.getByRole("button", { name: "開始" }).click();
  await expect(page.locator(".v-overlay--active").getByText("結果は・・・")).toBeVisible();
  const stopped = await wheel();
  expect(stopped).not.toBe(initial);
  await page.keyboard.press("Escape");
  await expect(page.locator(".v-overlay--active")).toHaveCount(0);

  await page.getByRole("button", { name: "設定", exact: true }).click();
  await page.locator(".settintgs-dialog .v-switch input").check();
  await expect(page.locator(".v-application")).toHaveClass(/v-theme--dark/);
  expect(await wheel()).toBe(stopped);
  await page.keyboard.press("Escape");
  await expect(page.locator(".v-overlay--active")).toHaveCount(0);

  await itemInputs(page).first().fill("D案");
  expect(await wheel()).toBe(stopped);
});
