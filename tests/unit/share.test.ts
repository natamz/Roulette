import { describe, expect, it, vi } from "vitest";
import { decodeItems, encodeItems } from "~~/utils/share";
import type RouletteItem from "~~/models/entities/RouletteItem";
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

  it("壊れた文字列は空配列になる", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    expect(decodeItems("invalid")).toEqual([]);
    expect(decodeItems("")).toEqual([]);
  });
});
