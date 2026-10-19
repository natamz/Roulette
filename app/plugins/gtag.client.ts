import { addGtag, createGtag, event } from "vue-gtag";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  // gtag.js（約 170KB）は、起動が終わってから読む（下の onNuxtReady）。起動時に読むと、初回の画像などと帯域を取り合う（#179）
  nuxtApp.vueApp.use(createGtag({
    tagId: config.public.gaid,
    initMode: "manual",
  }));

  // 開いたときの page_view を送る。createGtag の config は send_page_view: false で、
  // ページ内の遷移（/ ⇄ /en/）の分は GA の拡張計測が送るので、ここで送るのは1回だけ
  // 共有の ?q=（項目の名前）は GA に送らない。ハイドレーションが終わるまで URL から消えて見えるので、そのあとに読んで外す
  onNuxtReady(() => {
    // js と config を dataLayer に積んでから gtag.js を読み込む。page_view はそのあとに積む
    addGtag();

    const url = new URL(location.href);
    url.searchParams.delete("q");
    // pageview() は page_location に utm_* があると history.replaceState で vue-router の state を消すので、event で送る
    event("page_view", { page_location: url.href });
  });
});
