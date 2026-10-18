import { describe, expect, it } from "vitest";
import { decayDistance, itemSectors, normalizeDeg, pickItemId, sumRates } from "~/utils/wheel";
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

describe("normalizeDeg", () => {
  it("[0, 360) に収める", () => {
    expect(normalizeDeg(0)).toBe(0);
    expect(normalizeDeg(359.9)).toBeCloseTo(359.9);
    expect(normalizeDeg(360)).toBe(0);
    expect(normalizeDeg(360.3)).toBeCloseTo(0.3);
    expect(normalizeDeg(720 + 45)).toBe(45);
  });

  it("負の角度も正の向きに直す", () => {
    expect(normalizeDeg(-90)).toBe(270);
    expect(normalizeDeg(-360)).toBe(0);
    expect(normalizeDeg(-720 - 45)).toBe(315);
  });

  it("どんな角度でも 0 以上 360 未満", () => {
    for (const deg of [-1e-14, -1e-9, 359.9999999999999, 1e9 + 0.1, -1e9 - 0.1]) {
      const d = normalizeDeg(deg);
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThan(360);
    }
  });
});

describe("itemSectors", () => {
  it("0° から 360° まで隙間なく並ぶ", () => {
    const sectors = itemSectors([item(1, 2), item(2, 5), item(3, 1), item(4, 10)]);
    expect(sectors[0]!.start).toBe(0);
    expect(sectors.at(-1)!.end).toBe(360);
    for (let i = 1; i < sectors.length; i++) {
      expect(sectors[i]!.start).toBe(sectors[i - 1]!.end);
    }
  });

  it("幅は rate に比例し、項目の順に並ぶ", () => {
    const items = [item(1, 1), item(2, 3), item(3, 2)];
    const sectors = itemSectors(items);
    expect(sectors.map(s => s.item.id)).toEqual([1, 2, 3]);
    expect(sectors.map(s => s.end - s.start)).toEqual([60, 180, 120]);
  });

  it("1項目なら全周", () => {
    expect(itemSectors([item(1, 7)])).toEqual([{ item: item(1, 7), start: 0, end: 360 }]);
  });

  it("空なら空", () => {
    expect(itemSectors([])).toEqual([]);
  });
});

describe("pickItemId", () => {
  // rate 1 : 3 → 0〜90° が id 1、90〜360° が id 2
  const items = [item(1, 1), item(2, 3)];

  // 割り切れない境界を含むパターン
  const patterns: Record<string, RouletteItem[]> = {
    "1項目": [item(1, 1)],
    "2項目": items,
    "rate がばらばら": [item(1, 3), item(2, 7), item(3, 1), item(4, 10), item(5, 2)],
    "rate が全部同じ（7項目）": [1, 2, 3, 4, 5, 6, 7].map(id => item(id, 1)),
    "10項目": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => item(id, id)),
  };

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

  it("360° を超えた角度でも項目を返す（#138）", () => {
    expect(pickItemId(items, 360)).toBe(1);
    expect(pickItemId(items, 360.3)).toBe(1);
    expect(pickItemId(items, 360 + 90)).toBe(2);
  });

  it("何周しても、負の角度でも同じ位置なら同じ項目", () => {
    for (let deg = 0; deg < 360; deg += 7.3) {
      const id = pickItemId(items, deg);
      for (const turn of [-3, -1, 1, 2, 10]) {
        expect(pickItemId(items, deg + 360 * turn)).toBe(id);
      }
    }
  });

  describe.each(Object.entries(patterns))("%s", (_, list) => {
    const sectors = itemSectors(list);

    it("境界ちょうどは次の項目、直前は前の項目", () => {
      sectors.forEach((s, i) => {
        expect(pickItemId(list, s.start)).toBe(s.item.id);
        const prev = sectors.at(i - 1)!;
        expect(pickItemId(list, s.start - 1e-9)).toBe(prev.item.id);
      });
    });

    // Wheel.vue は num（0〜360 の乱数）+ d（停止時の残り角度 0〜0.5）を渡す
    it("回転を止めたときの角度では必ず項目を返す", () => {
      const ids = new Set(list.map(i => i.id));
      for (let num = 0; num < 360; num += 0.01) {
        for (const d of [0, 0.1, 0.25, 0.4999]) {
          expect(ids.has(pickItemId(list, num + d))).toBe(true);
        }
      }
    });

    // 描画（Wheel.vue の draw）と判定が同じ扇形を使っていること
    it("返した項目の扇形に指針の角度が入っている", () => {
      for (let deg = -720; deg < 720; deg += 0.37) {
        const id = pickItemId(list, deg);
        const sector = sectors.find(s => s.item.id === id)!;
        const d = normalizeDeg(deg);
        expect(d).toBeGreaterThanOrEqual(sector.start);
        expect(d).toBeLessThan(sector.end);
      }
    });

    it("当選範囲の広さは rate に比例する", () => {
      const step = 0.01;
      const counts = new Map<number, number>();
      for (let i = 0; i < 360 / step; i++) {
        const id = pickItemId(list, i * step);
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
      const sum = sumRates(list);
      for (const it of list) {
        expect((counts.get(it.id) ?? 0) * step).toBeCloseTo((360 * it.rate) / sum, 1);
      }
    });
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
