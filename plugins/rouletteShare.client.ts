import { RouletteItem } from "~~/models/entities/RouletteItem";
import LZString from "lz-string";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("share", new RouletteShareUtil());
});

class ExportRouletteItem {
  n: string = "";
  c: string = "";
  r: number = 0;
}

class RouletteShareUtil {
  export(items: RouletteItem[]): string {
    const array = items
      .sort((a: RouletteItem, b: RouletteItem) => a.order - b.order)
      .map((x: RouletteItem) => ({ n: x.name, c: x.color, r: x.rate })) as ExportRouletteItem[];
    const str = LZString.compressToEncodedURIComponent(JSON.stringify(array));

    return location.protocol + "//" + location.host + location.pathname + "?q=" + str;
  }
  import(data: string): RouletteItem[] {
    try {
      const dec = LZString.decompressFromEncodedURIComponent(data);
      const parsed = JSON.parse(dec) as ExportRouletteItem[];
      return parsed.map((x: ExportRouletteItem) => ({ name: x.n, color: x.c, rate: x.r })) as RouletteItem[];
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
