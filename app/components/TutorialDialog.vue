<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="primary">
          <v-btn
            icon
            :aria-label="$t('close')"
            @click="dialog = false"
          >
            <v-icon>$close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t("tutorial_title") }}</v-toolbar-title>
          <language-switch />
        </v-toolbar>
        <v-divider />
        <v-card-text>
          <p>{{ $t("tutorial_1") }}</p>

          <div class="mt-5">
            <p>{{ $t("tutorial_2") }}</p>
            <!-- 読み込む前から画像の高さを空けておく（比率は画像の実寸）。読み込んだときに下の文とボタンがずれないように -->
            <v-img
              :src="`${$config.app.baseURL}images/tutorial-1${imageSuffix}.png`"
              :alt="$t('tutorial_image_1_alt')"
              :aspect-ratio="564 / 268"
              max-width="500px"
            />
          </div>

          <div class="mt-5">
            <p>{{ $t("tutorial_3") }}</p>
            <v-img
              :src="`${$config.app.baseURL}images/tutorial-2${imageSuffix}.png`"
              :alt="$t('tutorial_image_2_alt')"
              :aspect-ratio="1"
              max-width="400px"
            />
          </div>
          <v-btn
            class="my-5"
            block
            @click="dialog = false"
          >
            {{ $t("close") }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 初回は全画面のダイアログを自動で開かず、使い方があることを小さく案内する（#172） -->
    <!-- 自動で開くと本文が隠れ（Googlebot も毎回初回訪問になる）、LCP もハイドレーションのあとに読む画像になる -->
    <v-snackbar
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
    </v-snackbar>
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
  computed: {
    // ダークのときはダークモードで撮った画像を出す
    imageSuffix(): string {
      return this.$vuetify.theme.current.dark ? "-dark" : "";
    },
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
  },
};
</script>
