import type RouletteItem from "~~/models/entities/RouletteItem";

// 当選確率の重み（rate）の合計
export function sumRates(items: RouletteItem[]): number {
  return items.reduce((num: number, item: RouletteItem) => {
    return num + item.rate;
  }, 0);
}

// 回転開始から t ミリ秒後の残り角度。time ミリ秒で 10000° から 1° まで減衰する
export function decayDistance(t: number, time: number): number {
  const a = 1e-4 ** (1 / time);
  return 10000 * a ** t;
}

// 指針の位置（ホイール上の角度）から当選した項目の id を返す
export function pickItemId(items: RouletteItem[], deg: number): number {
  const i = Math.floor(deg / (360 / sumRates(items)));
  let a = 0;
  for (const item of items) {
    a += item.rate;
    if (a > i) {
      return item.id;
    }
  }
  return 0;
}
