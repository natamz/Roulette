import type RouletteItem from "~/models/entities/RouletteItem";

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

// 角度を [0, 360) に正規化する。0〜360 の角度は誤差なくそのまま返す
export function normalizeDeg(deg: number): number {
  const d = deg % 360;
  if (d === 0) return 0; // -0 を 0 にする
  if (d > 0) return d;
  // -1e-14 のような値は +360 で丸められて 360 になるので 0 に寄せる
  return d + 360 < 360 ? d + 360 : 0;
}

export interface ItemSector {
  item: RouletteItem;
  start: number;
  end: number;
}

// 各項目の扇形の範囲（度）。0° から rate に比例した幅で隙間なく並び、360° で終わる
export function itemSectors(items: RouletteItem[]): ItemSector[] {
  const sum = sumRates(items);
  let rate = 0;
  return items.map((item: RouletteItem) => {
    const start = (rate * 360) / sum;
    rate += item.rate;
    return { item, start, end: (rate * 360) / sum };
  });
}

// 指針の位置（ホイール上の角度）から当選した項目の id を返す
export function pickItemId(items: RouletteItem[], deg: number): number {
  const d = normalizeDeg(deg);
  const sector = itemSectors(items).find(s => s.start <= d && d < s.end);
  return sector?.item.id ?? 0;
}
