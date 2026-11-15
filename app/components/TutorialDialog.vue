<template>
  <div>
    <!-- PC は中央のカード、スマホは全画面 -->
    <app-dialog
      v-model="dialog"
      :title="$t('tutorial_title')"
      mobile-fullscreen
    >
      <!-- ヘッダーの外では v-btn の既定が elevated（白い丸に影）になるので、閉じるボタンと同じ text にする -->
      <template #actions>
        <language-switch variant="text" />
      </template>

      <div class="tutorial">
        <p>{{ $t("tutorial_1") }}</p>

        <section class="tutorial__step">
          <p>{{ $t("tutorial_2") }}</p>
          <!-- 読み込む前から画像の高さを空けておく（比率は画像の実寸）。読み込んだときに下の文とボタンがずれないように -->
          <div class="tutorial__frame">
            <v-img
              :src="imageSrc('items')"
              :alt="$t('tutorial_image_1_alt')"
              :aspect-ratio="908 / 624"
            />
          </div>
        </section>

        <section class="tutorial__step">
          <p>{{ $t("tutorial_3") }}</p>
          <!-- ルーレットは縦に長いので、枠の中で小さめに出す。枠は画像と同じ背景の色にして、継ぎ目を見せない -->
          <div class="tutorial__frame">
            <v-img
              :src="imageSrc('wheel')"
              :alt="$t('tutorial_image_2_alt')"
              :aspect-ratio="908 / 980"
              class="tutorial__wheel"
            />
          </div>
        </section>

        <v-btn
          block
          size="large"
          color="primary"
          variant="flat"
          class="tutorial__close"
          @click="dialog = false"
        >
          {{ $t("close") }}
        </v-btn>
      </div>
    </app-dialog>

    <!-- 初回は全画面のダイアログを自動で開かず、使い方があることを小さく案内する（#172） -->
    <!-- 自動で開くと本文が隠れ（Googlebot も毎回初回訪問になる）、LCP もハイドレーションのあとに読む画像になる -->
    <stacked-snackbar
      v-model="guide"
      :timeout="-1"
    >
      {{ $t("tutorial_guide") }}
      <template #actions>
        <v-btn
          variant="text"
          @click="onGuideClick"
        >
          {{ $t("tutorial_title") }}
        </v-btn>
        <v-btn
          icon="$close"
          :aria-label="$t('close')"
          variant="text"
          @click="guide = false"
        />
      </template>
    </stacked-snackbar>
  </div>
</template>

<script lang="ts">
export default {
  data(): {
    dialog: boolean;
    guide: boolean;
  } {
    return {
      dialog: false,
      guide: false,
    };
  },
  mounted() {
    if (localStorage.getItem("t") == "true") return;
    // 日本語以外のブラウザで日本語版を開いたときは、同じ場所に English の案内（EnglishGuide.vue）を出すので、こちらは出さない
    if (this.$i18n.locale === "ja" && !navigator.language.toLowerCase().startsWith("ja")) return;
    localStorage.setItem("t", "true");
    this.guide = true;
  },
  methods: {
    showDialog() {
      this.dialog = true;
      this.$audio.click();
    },
    onGuideClick() {
      this.guide = false;
      this.showDialog();
    },
    // 画像は言語ごと（項目の名前がその言語）に撮っている。ダークのときはダークモードで撮った画像を出す
    // 撮り直すときは docs/tutorial/generate.mjs（ローカル専用）。大きさが変わったら aspect-ratio も直す
    imageSrc(name: "items" | "wheel"): string {
      const suffix = this.$vuetify.theme.current.dark ? "-dark" : "";
      return `${this.$config.app.baseURL}images/tutorial-${name}-${this.$i18n.locale}${suffix}.png`;
    },
  },
};
</script>

<style lang="scss" scoped>
.tutorial {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px 24px 24px;
}

.tutorial__step {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 画像は画面の一部を切り取ったものなので、枠で囲む
.tutorial__frame {
  overflow: hidden;
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-background));
}

.tutorial__wheel {
  max-width: 280px;
  margin: 0 auto;
}

.tutorial__close.v-btn {
  border-radius: 10px;
  letter-spacing: normal;
  text-transform: none;
}
</style>
