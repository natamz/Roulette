import Dexie from "dexie";
import { RouletteItem } from "~~/models/entities/RouletteItem";

const SCHEMA_VERSION = 2;
const DB_NAME = "roulette-db";

interface DexieDatabase extends Dexie {
  RouletteItems: Dexie.Table<RouletteItem, number>;
}

const db = new Dexie(DB_NAME) as DexieDatabase;
db.version(SCHEMA_VERSION).stores({
  RouletteItems: "++id,name,color,rate",
});

export default db;
