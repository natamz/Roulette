import type RouletteItem from "~~/models/entities/RouletteItem";
import { encodeItems, decodeItems } from "~~/utils/share";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("share", new RouletteShareUtil());
});

export class RouletteShareUtil {
  export(items: RouletteItem[]): string {
    return location.protocol + "//" + location.host + location.pathname + "?q=" + encodeItems(items);
  }

  import(data: string): RouletteItem[] {
    return decodeItems(data);
  }
}
