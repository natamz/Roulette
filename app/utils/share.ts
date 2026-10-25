import LZString from "lz-string";
import type RouletteItem from "~/models/entities/RouletteItem";

// 共有URL（?q=）の形式。既存の共有URLを壊さないよう、キー名と構造は変えない
type ExportRouletteItem = {
  n: string;
  c: string;
  r: number;
};

// パレット（consts/colors.ts）の色は、共有URLを入れたときからずっと #rrggbb
const COLOR = /^#[0-9a-f]{6}$/i;

// 色は style に入るので、形式の違うものは通さない。rate は項目の行（RouletteItemRow.vue）で選べる 1〜10
function isExportItem(x: unknown): x is ExportRouletteItem {
  if (typeof x !== "object" || x === null) return false;
  const { n, c, r } = x as Record<string, unknown>;
  return typeof n === "string"
    && typeof c === "string" && COLOR.test(c)
    && Number.isInteger(r) && (r as number) >= 1 && (r as number) <= 10;
}

export function encodeItems(items: RouletteItem[]): string {
  const array: ExportRouletteItem[] = [...items]
    .sort((a: RouletteItem, b: RouletteItem) => a.order - b.order)
    .map((x: RouletteItem) => ({ n: x.name, c: x.color, r: x.rate }));
  return LZString.compressToEncodedURIComponent(JSON.stringify(array));
}

// 読めない（途中で切れている、形式が違う）ときは null
// 形式の違う項目は作られたURLにしかないので、一部だけ取り込まず、URL ごと読めないものにする
export function decodeItems(data: string): RouletteItem[] | null {
  try {
    const parsed: unknown = JSON.parse(LZString.decompressFromEncodedURIComponent(data));
    if (!Array.isArray(parsed) || !parsed.every(isExportItem)) return null;
    return parsed.map((x: ExportRouletteItem) => ({ name: x.n, color: x.c, rate: x.r })) as RouletteItem[];
  }
  catch {
    return null;
  }
}

// 名前・色・rate が順番どおりに同じか
export function isSameItems(a: RouletteItem[], b: RouletteItem[]): boolean {
  return a.length === b.length
    && a.every((x, i) => x.name === b[i]!.name && x.color === b[i]!.color && x.rate === b[i]!.rate);
}
