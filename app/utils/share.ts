import LZString from "lz-string";
import type RouletteItem from "~/models/entities/RouletteItem";

// 共有URL（?q=）の形式。既存の共有URLを壊さないよう、キー名と構造は変えない
type ExportRouletteItem = {
  n: string;
  c: string;
  r: number;
};

export function encodeItems(items: RouletteItem[]): string {
  const array: ExportRouletteItem[] = [...items]
    .sort((a: RouletteItem, b: RouletteItem) => a.order - b.order)
    .map((x: RouletteItem) => ({ n: x.name, c: x.color, r: x.rate }));
  return LZString.compressToEncodedURIComponent(JSON.stringify(array));
}

export function decodeItems(data: string): RouletteItem[] {
  try {
    const dec = LZString.decompressFromEncodedURIComponent(data);
    const parsed = JSON.parse(dec) as ExportRouletteItem[];
    return parsed.map((x: ExportRouletteItem) => ({ name: x.n, color: x.c, rate: x.r })) as RouletteItem[];
  }
  catch (e) {
    console.log(e);
    return [];
  }
}
