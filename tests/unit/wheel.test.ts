import { describe, expect, it } from "vitest";
import { decayDistance, pickItemId, sumRates } from "~/utils/wheel";
import type RouletteItem from "~/models/entities/RouletteItem";

function item(id: number, rate: number): RouletteItem {
  return { id, name: `item${id}`, color: "#000000", rate, order: id };
}

describe("sumRates", () => {
  it("rate の合計を返す", () => {
    expect(sumRates([item(1, 1), item(2, 3), item(3, 10)])).toBe(14);
  });

  it("空なら 0", () => {
    expect(sumRates([])).toBe(0);
  });
});

describe("pickItemId", () => {
  // rate 1 : 3 → 0〜90° が id 1、90〜360° が id 2
  const items = [item(1, 1), item(2, 3)];

  it("角度に対応する項目を返す", () => {
    expect(pickItemId(items, 0)).toBe(1);
    expect(pickItemId(items, 89.9)).toBe(1);
    expect(pickItemId(items, 90)).toBe(2);
    expect(pickItemId(items, 359.9)).toBe(2);
  });

  it("当選範囲の広さは rate に比例する", () => {
    const counts = new Map<number, number>();
    for (let deg = 0; deg < 360; deg += 0.5) {
      const id = pickItemId(items, deg);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    expect(counts.get(1)).toBe(180);
    expect(counts.get(2)).toBe(540);
  });

  it("項目が無ければ 0", () => {
    expect(pickItemId([], 10)).toBe(0);
  });

  // 既知のバグ #138: 360° を超える角度を扱えず 0 を返す。修正したら it.fails を外す
  it.fails("360° を超えた角度でも項目を返す（#138）", () => {
    expect(pickItemId(items, 360.3)).not.toBe(0);
  });
});

describe("decayDistance", () => {
  it("開始時は 10000°、time ミリ秒後に 1° まで減衰する", () => {
    expect(decayDistance(0, 8000)).toBeCloseTo(10000);
    expect(decayDistance(8000, 8000)).toBeCloseTo(1);
  });

  it("単調に減少する", () => {
    expect(decayDistance(1000, 8000)).toBeLessThan(decayDistance(500, 8000));
  });

  it("time が 0（一瞬）なら t > 0 で即 0 になる", () => {
    expect(decayDistance(30, 0)).toBe(0);
  });
});
