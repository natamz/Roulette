import { expect, test } from "./fixtures";

async function openSettings(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "設定", exact: true }).click();
  const dialog = page.locator(".settintgs-dialog .v-card");
  await expect(dialog).toBeVisible();
  return dialog;
}

test("回転時間をスライダーで 0.5 秒刻みに変えられ、リロード後も残る", async ({ page }) => {
  await page.goto("/");
  let dialog = await openSettings(page);
  const slider = dialog.getByRole("slider", { name: "回転時間" });

  // fixtures で 0 にしている
  await expect(slider).toHaveAttribute("aria-valuetext", "一瞬");
  await slider.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuetext", "0.5秒");
  expect(await page.evaluate(() => localStorage.getItem("rotationTime"))).toBe("500");
  await slider.press("End");
  await expect(slider).toHaveAttribute("aria-valuetext", "10秒");
  expect(await page.evaluate(() => localStorage.getItem("rotationTime"))).toBe("10000");

  await page.reload();
  dialog = await openSettings(page);
  await expect(dialog.getByRole("slider", { name: "回転時間" })).toHaveAttribute("aria-valuenow", "10000");
});

test("スライダーを右端まで動かすと 10 秒、左端まで動かすと一瞬", async ({ page }) => {
  await page.goto("/");
  const dialog = await openSettings(page);
  const slider = dialog.getByRole("slider", { name: "回転時間" });

  // つまみを掴んで、バーの外まで動かす
  const drag = async (dx: number) => {
    const box = (await slider.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx, y, { steps: 5 });
    await page.mouse.up();
  };

  await drag(1000);
  await expect(slider).toHaveAttribute("aria-valuetext", "10秒");
  expect(await page.evaluate(() => localStorage.getItem("rotationTime"))).toBe("10000");

  await drag(-1000);
  await expect(slider).toHaveAttribute("aria-valuetext", "一瞬");
  expect(await page.evaluate(() => localStorage.getItem("rotationTime"))).toBe("0");
});

test("効果音の設定がリロード後も残る", async ({ page }) => {
  await page.goto("/");
  let dialog = await openSettings(page);

  await dialog.getByRole("switch", { name: "効果音" }).check();
  await dialog.getByRole("button", { name: "3", exact: true }).click();

  expect(await page.evaluate(() => ({ ...localStorage }))).toMatchObject({
    audio: "true",
    audioResultType: "3",
  });

  await page.reload();
  dialog = await openSettings(page);
  await expect(dialog.getByRole("switch", { name: "効果音" })).toBeChecked();
  await expect(dialog.getByRole("button", { name: "3", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByRole("button", { name: "1", exact: true })).toHaveAttribute("aria-pressed", "false");
});

test("効果音がオフのときは、効果音の種類を選べない", async ({ page }) => {
  await page.goto("/");
  const dialog = await openSettings(page);

  for (const name of ["1", "2", "3", "ランダム"]) {
    await expect(dialog.getByRole("button", { name, exact: true })).toBeDisabled();
  }

  await dialog.getByRole("switch", { name: "効果音" }).check();
  await dialog.getByRole("button", { name: "ランダム", exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem("audioResultType"))).toBe("99");
});

test("ダークテーマへの切り替えがリロード後も残る", async ({ page }) => {
  await page.goto("/");
  const dialog = await openSettings(page);

  await dialog.getByRole("switch", { name: "ダークモード" }).check();
  await expect(page.locator("html")).toHaveClass(/dark-mode/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark-mode/);
});

test("効果音の種類が未設定のときは 1 になる（#137）", async ({ page }) => {
  await page.goto("/");
  const dialog = await openSettings(page);

  await expect(dialog.getByRole("button", { name: "1", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => localStorage.getItem("audioResultType"))).toBe("1");
});

test("PC では中央のカード、スマホでは全画面で開く", async ({ page }) => {
  await page.goto("/");
  let dialog = await openSettings(page);
  // 開くときは拡大のアニメーションがあるので、収まるまで待つ
  await expect.poll(async () => (await dialog.boundingBox())?.width).toBe(480);
  await page.keyboard.press("Escape");
  await expect(page.locator(".v-overlay--active")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  dialog = await openSettings(page);
  await expect.poll(() => dialog.boundingBox()).toEqual({ x: 0, y: 0, width: 390, height: 844 });
});
