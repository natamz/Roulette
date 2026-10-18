import type RouletteItem from "~/models/entities/RouletteItem";
import { encodeItems, decodeItems } from "~/utils/share";

export default defineNuxtPlugin((nuxtApp) => {
  // prerender したページは、ハイドレーションが終わるまでルートと URL が描画済みのパス（?q= なし）に置き換わる。
  // なので、開いた URL の ?q= は置き換わる前のここで読み、URL から消すのはハイドレーションのあとにする
  const query = new URLSearchParams(location.search).get("q");
  if (query) {
    const router = useRouter();
    onNuxtReady(() => router.replace({ query: {} }));
  }
  nuxtApp.provide("share", new RouletteShareUtil(query));
});

export class RouletteShareUtil {
  private readonly query: string | null;

  constructor(query: string | null) {
    this.query = query;
  }

  export(items: RouletteItem[]): string {
    return location.protocol + "//" + location.host + location.pathname + "?q=" + encodeItems(items);
  }

  // 開いた URL の ?q= に入っていた項目
  sharedItems(): RouletteItem[] {
    return this.query ? decodeItems(this.query) : [];
  }
}
