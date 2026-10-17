import { addItems, expect, test } from "./fixtures";

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
