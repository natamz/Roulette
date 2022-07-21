import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";
import { RouletteItemRepository } from "~~/models/repositories/RouletteItemRepository";

export interface Db {
  rouletteItem: RouletteItemRepository;
}

export default defineNuxtPlugin((nuxtApp) => {
  const db: Db = {
    rouletteItem: new RouletteItemRepository(),
  };
  nuxtApp.provide("db", db);
});
