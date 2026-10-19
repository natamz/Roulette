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
            <v-img
              :src="`${$config.app.baseURL}images/tutorial-1${imageSuffix}.png`"
              max-width="500px"
            />
          </div>

          <div class="mt-5">
            <p>{{ $t("tutorial_3") }}</p>
            <v-img
              :src="`${$config.app.baseURL}images/tutorial-2${imageSuffix}.png`"
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
  </div>
</template>

<script lang="ts">
export default {
  data(): {
    dialog: boolean;
  } {
    return {
      dialog: false,
    };
  },
  computed: {
    // ダークのときはダークモードで撮った画像を出す
    imageSuffix(): string {
      return this.$vuetify.theme.current.dark ? "-dark" : "";
    },
  },
  mounted() {
    if (localStorage.getItem("t") != "true") {
      localStorage.setItem("t", "true");
      this.dialog = true;
    }
  },
  methods: {
    showDialog() {
      this.dialog = true;
      this.$audio.click();
    },
  },
};
</script>
