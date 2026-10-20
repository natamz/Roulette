import { legacyShareQuery } from "../fixtures/share";
import { expect, test } from "./fixtures";
import type { Page } from "@playwright/test";

// gtag で GA に送る page_view（window.dataLayer に積まれた呼び出し）の page_location
// E2E のビルドは GA の ID が空なので gtag.js は読まないが、gtag の呼び出しは dataLayer に積まれる
async function pageViews(page: Page) {
  return page.evaluate(() => {
    const dataLayer = (window as unknown as { dataLayer?: IArguments[] }).dataLayer ?? [];
    return dataLayer
      .map(args => [...args])
      .filter(([command, name]) => command === "event" && name === "page_view")
      .map(([, , params]) => (params as { page_location: string }).page_location);
  });
}

test("開いたときに page_view を1回送り、共有の ?q= は送らない（#184）", async ({ page }) => {
  await page.goto(`/?q=${legacyShareQuery}&utm_source=e2e`);

  await expect.poll(() => pageViews(page)).toHaveLength(1);
  const [location] = await pageViews(page);
  expect(new URL(location!).pathname).toBe("/");
  expect(new URL(location!).search).toBe("?utm_source=e2e");

  // 言語の切り替え（ページ内の遷移）では送らない。GA の拡張計測が送る
  await page.locator("header").getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/en/");
  expect(await pageViews(page)).toHaveLength(1);
});
