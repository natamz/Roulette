import { addItems, expect, test } from "./fixtures";
import type { Page } from "@playwright/test";

// 音声ファイルへのリクエストと、鳴らした回数（AudioBufferSourceNode.start の呼び出し）を記録する
async function recordAudio(page: Page) {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/audio/")) requests.push(new URL(request.url()).pathname);
  });
  await page.addInitScript(() => {
    const start = AudioBufferSourceNode.prototype.start;
    (window as unknown as { played: number }).played = 0;
    AudioBufferSourceNode.prototype.start = function (...args) {
      (window as unknown as { played: number }).played++;
      return start.apply(this, args);
    };
  });
  return {
    requests,
    played: () => page.evaluate(() => (window as unknown as { played: number }).played),
  };
}

test("効果音がオフなら音声を読み込まない。オンにすると読み込んで鳴らす（#161）", async ({ page }) => {
  const audio = await recordAudio(page);
  await page.goto("/");
  // ハイドレーションと onNuxtReady（requestIdleCallback）が終わるのを待つ
  await addItems(page, ["a"]);
  await page.evaluate(() => new Promise(resolve => requestIdleCallback(resolve)));
  expect(audio.requests).toEqual([]);

  await page.getByRole("button", { name: "設定", exact: true }).click();
  await page.locator(".settintgs-dialog .v-card").getByRole("button", { name: "効果音" }).click();
  // オンにしたときのクリック音は、読み込みが終わってから鳴る
  await expect.poll(audio.played).toBe(1);
  await expect.poll(() => audio.requests.length).toBe(8);
});

test("効果音がオンなら、開いたあとに音声を読み込んでおく（#161）", async ({ page }) => {
  const audio = await recordAudio(page);
  await page.addInitScript(() => localStorage.setItem("audio", "true"));
  await page.goto("/");
  await expect.poll(() => audio.requests.length).toBe(8);
  expect(await audio.played()).toBe(0);
});
