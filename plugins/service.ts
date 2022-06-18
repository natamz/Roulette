import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";
import { RouletteItemRepository } from "~~/models/repositories/RouletteItemRepository";

export interface Db {
  rouletteItem: RouletteItemRepository;
}

export default function (context: Context, inject: Inject): void {
  const db: Db = {
    rouletteItem: new RouletteItemRepository(),
  };
  inject("db", db);
}
