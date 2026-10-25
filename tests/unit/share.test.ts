import LZString from "lz-string";
import { describe, expect, it } from "vitest";
import { decodeItems, encodeItems, isSameItems } from "~/utils/share";
import type RouletteItem from "~/models/entities/RouletteItem";
import { legacyShareItems, legacyShareQuery } from "../fixtures/share";

const items: RouletteItem[] = [
  { id: 1, name: "B", color: "#000000", rate: 2, order: 1 },
  { id: 2, name: "A", color: "#FFFFFF", rate: 5, order: 0 },
];

describe("encodeItems / decodeItems", () => {
  it("既存の共有URLを同じ内容に復元できる", () => {
    expect(decodeItems(legacyShareQuery)).toEqual(legacyShareItems);
  });

  it("既存の共有URLと同じ文字列を生成する", () => {
    const source = legacyShareItems.map((x, i) => ({ ...x, id: i + 1, order: i }));
    expect(encodeItems(source)).toBe(legacyShareQuery);
  });

  it("order 順に並べて name / color / rate だけを往復させる", () => {
    expect(decodeItems(encodeItems(items))).toEqual([
      { name: "A", color: "#FFFFFF", rate: 5 },
      { name: "B", color: "#000000", rate: 2 },
    ]);
  });

  it("引数の配列を並べ替えない", () => {
    const input = [...items];
    encodeItems(input);
    expect(input).toEqual(items);
  });

  it("壊れた文字列は null になる", () => {
    expect(decodeItems("invalid")).toBeNull();
    expect(decodeItems("")).toBeNull();
    // 途中で切れた共有URL
    expect(decodeItems(legacyShareQuery.slice(0, 40))).toBeNull();
  });

  it("0件の共有URLは空配列になる", () => {
    expect(decodeItems(encodeItems([]))).toEqual([]);
  });

  it.each([
    ["配列でない", { n: "A", c: "#ffffff", r: 1 }],
    ["要素がオブジェクトでない", ["A"]],
    ["名前が文字列でない", [{ n: 1, c: "#ffffff", r: 1 }]],
    ["色に CSS が入っている", [{ n: "A", c: "#fff;background-image:url(https://example.com/)", r: 1 }]],
    ["色が #rrggbb でない", [{ n: "A", c: "#fff", r: 1 }]],
    ["色が無い", [{ n: "A", r: 1 }]],
    ["rate が文字列", [{ n: "A", c: "#ffffff", r: "5" }]],
    ["rate が 0", [{ n: "A", c: "#ffffff", r: 0 }]],
    ["rate が 11", [{ n: "A", c: "#ffffff", r: 11 }]],
    ["rate が整数でない", [{ n: "A", c: "#ffffff", r: 1.5 }]],
    ["一部の要素だけ形式が違う", [{ n: "A", c: "#ffffff", r: 1 }, { n: "B", c: "red", r: 1 }]],
  ])("形式が違うと null になる（%s）", (_, value) => {
    expect(decodeItems(LZString.compressToEncodedURIComponent(JSON.stringify(value)))).toBeNull();
  });

  it("名前は空でもよい", () => {
    const query = LZString.compressToEncodedURIComponent(JSON.stringify([{ n: "", c: "#ffffff", r: 10 }]));
    expect(decodeItems(query)).toEqual([{ name: "", color: "#ffffff", rate: 10 }]);
  });
});

describe("isSameItems", () => {
  const a = { id: 1, name: "A", color: "#ffffff", rate: 1, order: 0 };
  const b = { id: 2, name: "B", color: "#000000", rate: 2, order: 1 };

  it("名前・色・rate が順番どおりに同じなら true（id と order は見ない）", () => {
    expect(isSameItems([a, b], [{ ...a, id: 3, order: 5 }, { ...b, id: 4, order: 6 }])).toBe(true);
    expect(isSameItems([], [])).toBe(true);
  });

  it("順番・件数・中身が違えば false", () => {
    expect(isSameItems([a, b], [b, a])).toBe(false);
    expect(isSameItems([a, b], [a])).toBe(false);
    expect(isSameItems([a], [{ ...a, name: "A2" }])).toBe(false);
    expect(isSameItems([a], [{ ...a, color: "#000000" }])).toBe(false);
    expect(isSameItems([a], [{ ...a, rate: 2 }])).toBe(false);
  });
});
