import type { AudioUtil } from "./audio.client";
import type { Db } from "./db";
import type { RouletteShareUtil } from "./rouletteShare.client";

export default defineNuxtPlugin(() => {});

declare module "#app" {
  interface NuxtApp {
    $audio: AudioUtil;
    $db: Db;
    $share: RouletteShareUtil;
  }
}
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $audio: AudioUtil;
    $db: Db;
    $share: RouletteShareUtil;
  }
}
