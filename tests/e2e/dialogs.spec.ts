import { addItems, expect, test } from "./fixtures";
import type { Page } from "@playwright/test";

// 一番上に開いているダイアログのカード
function topCard(page: Page) {
  return page.locator(".v-overlay--active .v-card").last();
}

test("テンプレートは PC では中央のカード、スマホでは全画面で開く", async ({ page }) => {
  await page.goto("/");
  await page.locator("header").getByRole("button", { name: "テンプレート", exact: true }).click();
  // 開くときは拡大のアニメーションがあるので、収まるまで待つ
  await expect.poll(async () => (await topCard(page).boundingBox())?.width).toBe(480);
  await page.keyboard.press("Escape");
  await expect(page.locator(".v-overlay--active")).toHaveCount(0);

  // スマホのテンプレートは、項目リストのダイアログから開く
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "項目を編集" }).click();
  await page.locator(".v-overlay--active").getByRole("button", { name: "テンプレート", exact: true }).click();
  await expect(page.locator(".v-overlay--active")).toHaveCount(2);
  await expect.poll(() => topCard(page).boundingBox()).toEqual({ x: 0, y: 0, width: 390, height: 844 });
});

test.describe("スマホ幅", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("色の選択は全画面にせず、色を押すと項目の色が変わる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "項目を編集" }).click();
    await addItems(page, ["りんご"]);
    const color = page.locator(".list-group > .item-row").first().getByRole("button", { name: "色を変更" });

    await color.click();
    await expect(page.locator(".v-overlay--active")).toHaveCount(2);
    // 画面の幅から左右の余白（24px ずつ）を引いた幅
    await expect.poll(async () => (await topCard(page).boundingBox())?.width).toBe(342);

    await topCard(page).getByRole("button", { name: "#ff1e1e" }).click();
    await expect(page.locator(".v-overlay--active")).toHaveCount(1);
    await expect(color).toHaveCSS("background-color", "rgb(255, 30, 30)");
  });

  test("結果は全画面にせず、閉じるボタンで閉じる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "項目を編集" }).click();
    await addItems(page, ["A案", "B案"]);
    await page.locator(".v-overlay--active").getByRole("button", { name: "閉じる", exact: true }).click();
    await expect(page.locator(".v-overlay--active")).toHaveCount(0);

    await page.getByRole("button", { name: "開始" }).click();
    const result = topCard(page);
    await expect(result.getByText("結果は・・・")).toBeVisible();
    await expect.poll(async () => (await result.boundingBox())?.width).toBe(342);

    await result.getByRole("button", { name: "閉じる" }).click();
    await expect(page.locator(".v-overlay--active")).toHaveCount(0);
  });
});
