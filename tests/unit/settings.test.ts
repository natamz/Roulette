import { describe, expect, it } from "vitest";
import { parseNumberSetting } from "~/utils/settings";

describe("parseNumberSetting", () => {
  it("未設定のときは fallback を返す（#137）", () => {
    expect(parseNumberSetting(null, 8000)).toBe(8000);
  });

  it("空文字や数値でない値のときは fallback を返す", () => {
    expect(parseNumberSetting("", 1)).toBe(1);
    expect(parseNumberSetting("abc", 1)).toBe(1);
  });

  it("保存された数値を返す", () => {
    expect(parseNumberSetting("0", 8000)).toBe(0);
    expect(parseNumberSetting("10000", 8000)).toBe(10000);
    expect(parseNumberSetting("99", 1)).toBe(99);
  });
});
