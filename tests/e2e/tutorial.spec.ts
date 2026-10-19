import { expect, test } from "./fixtures";

test("使い方の画像は読み込む前から高さがあり、alt が付いている（#170）", async ({ page }) => {
  // 画像を読み込ませない。読み込んだときに下の文やボタンがずれないよう、読み込む前から場所を取っていること
  await page.route(/\/images\/tutorial-/, route => route.abort());
  await page.goto("/");
  await page.locator("header").getByRole("button", { name: "使い方", exact: true }).click();

  const images = page.locator(".v-overlay--active .v-img");
  await expect(images).toHaveCount(2);
  for (const image of await images.all()) {
    expect((await image.boundingBox())!.height).toBeGreaterThan(100);
    await expect(image.locator("img")).toHaveAttribute("alt", /.+/);
  }
});
