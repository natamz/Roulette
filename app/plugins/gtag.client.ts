import { createGtag, event } from "vue-gtag";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  nuxtApp.vueApp.use(createGtag({
    tagId: config.public.gaid,
  }));

  // 開いたときの page_view を送る。createGtag の config は send_page_view: false で、
  // ページ内の遷移（/ ⇄ /en/）の分は GA の拡張計測が送るので、ここで送るのは1回だけ
  // 共有の ?q=（項目の名前）は GA に送らない。ハイドレーションが終わるまで URL から消えて見えるので、そのあとに読んで外す
  onNuxtReady(() => {
    const url = new URL(location.href);
    url.searchParams.delete("q");
    // pageview() は page_location に utm_* があると history.replaceState で vue-router の state を消すので、event で送る
    event("page_view", { page_location: url.href });
  });
});
