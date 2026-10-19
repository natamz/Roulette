import { beforeEach, describe, expect, it } from "vitest";
import { RouletteItemRepository } from "~/models/repositories/RouletteItemRepository";
import type RouletteItem from "~/models/entities/RouletteItem";

const repo = new RouletteItemRepository();

function newItem(name: string, order: number): RouletteItem {
  // id は IndexedDB の自動採番に任せる
  return { name, color: "#000000", rate: 1, order } as RouletteItem;
}

describe("RouletteItemRepository", () => {
  beforeEach(async () => {
    await repo.clear();
  });

  it("add すると自動採番された id が元のオブジェクトに入る", async () => {
    const item = newItem("A", 0);
    await repo.add(item);
    expect(item.id).toEqual(expect.any(Number));
    expect(await repo.get(item.id)).toEqual(item);
  });

  it("addRange / getAll", async () => {
    await repo.addRange([newItem("A", 0), newItem("B", 1)]);
    const all = await repo.getAll();
    expect(all?.map(x => x.name)).toEqual(["A", "B"]);
  });

  it("put で上書きできる", async () => {
    const item = newItem("A", 0);
    await repo.add(item);
    await repo.put({ ...item, name: "A2", order: 5 });
    expect(await repo.get(item.id)).toMatchObject({ name: "A2", order: 5 });
  });

  it("putRange でまとめて上書きできる", async () => {
    const a = newItem("A", 0);
    const b = newItem("B", 1);
    await repo.addRange([a, b]);
    const [storedA, storedB] = (await repo.getAll())!;
    await repo.putRange([{ ...storedB!, order: 0 }, { ...storedA!, name: "A2", order: 1 }]);
    const all = (await repo.getAll())!.sort((x, y) => x.order - y.order);
    expect(all.map(x => x.name)).toEqual(["B", "A2"]);
  });

  it("update は更新後の項目を返す", async () => {
    const item = newItem("A", 0);
    await repo.add(item);
    expect(await repo.update({ ...item, rate: 7 })).toMatchObject({ id: item.id, rate: 7 });
  });

  it("remove / clear", async () => {
    const a = newItem("A", 0);
    const b = newItem("B", 1);
    await repo.add(a);
    await repo.add(b);
    await repo.remove(a.id);
    expect((await repo.getAll())?.map(x => x.name)).toEqual(["B"]);
    await repo.clear();
    expect(await repo.getAll()).toEqual([]);
  });
});
