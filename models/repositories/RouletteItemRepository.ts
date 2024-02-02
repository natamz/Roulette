import Dexie from "dexie";
import db from "~~/data/dexie";
import type RouletteItem from "~~/models/entities/RouletteItem";

export class RouletteItemRepository {
  async add(item: RouletteItem) {
    await db.RouletteItems.add(item)
      .then(async (num: number | undefined) => {
        return num;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }
  async addRange(items: RouletteItem[]) {
    await db.RouletteItems.bulkAdd(items)
      .then(async (num: number | undefined) => {
        return num;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  async update(item: RouletteItem): Promise<RouletteItem | undefined> {
    await db.RouletteItems.update(item.id, item);
    return await this.get(item.id);
  }

  async put(item: RouletteItem) {
    await db.RouletteItems.put(Dexie.deepClone(item));
  }

  async remove(id: number) {
    await db.RouletteItems.delete(id);
  }

  async get(id: number): Promise<RouletteItem | undefined> {
    return db.RouletteItems.get(id)
      .then(async (item: RouletteItem | undefined) => {
        return item;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  async getAll(): Promise<RouletteItem[] | undefined> {
    return db.RouletteItems.toArray()
      .then(async (items: RouletteItem[] | undefined) => {
        return items;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  async clear() {
    await db.RouletteItems.clear();
  }
}
