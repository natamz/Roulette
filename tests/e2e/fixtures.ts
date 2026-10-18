import { test as base, expect, type Page } from "@playwright/test";

// 全テスト共通の前処理
// - 初回のチュートリアルを出さない
// - 回転時間を 0（一瞬）にする
// - GA への通信を止める
// リロード後の永続化を確かめるテストがあるので、未設定のときだけ値を入れる
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      if (localStorage.getItem("t") === null) localStorage.setItem("t", "true");
      if (localStorage.getItem("rotationTime") === null) localStorage.setItem("rotationTime", "0");
    });
    await page.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
    await use(page);
  },
});

export { expect };

export function itemInputs(page: Page) {
  // v-select も input を持つので、名前の v-text-field だけに絞る
  return page.locator(".list-group .v-text-field:not(.v-select) input");
}

// IndexedDB に保存されている項目の名前（order 順）
// 名前の変更は非同期で保存されるので、リロードの前はこれが期待どおりになるのを待つ
export async function storedNames(page: Page) {
  return page.evaluate(() => new Promise<string[]>((resolve, reject) => {
    const open = indexedDB.open("roulette-db");
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const request = db.transaction("RouletteItems").objectStore("RouletteItems").getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db.close();
        const items = request.result as { name: string; order: number }[];
        resolve(items.sort((a, b) => a.order - b.order).map(item => item.name));
      };
    };
  }));
}

// 項目を追加して名前を入力する
export async function addItems(page: Page, names: string[]) {
  for (const name of names) {
    // 追加は IndexedDB への保存後に描画されるので、行が増えるのを待ってから入力する
    const count = await itemInputs(page).count();
    await page.locator("button:has(.mdi-card-plus-outline)").click();
    await expect(itemInputs(page)).toHaveCount(count + 1);
    await itemInputs(page).nth(count).fill(name);
  }
}
