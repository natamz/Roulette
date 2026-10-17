<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="800px"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-actions color="primary">
          <v-btn
            icon
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t("tutorial_title") }}</v-toolbar-title>
          <language-switch />
        </v-card-actions>
        <v-divider />
        <v-card-text>
          <p>{{ $t("tutorial_1") }}</p>

          <div class="mt-5">
            <p>{{ $t("tutorial_2") }}</p>
            <v-img
              :src="`${$config.app.baseURL}images/tutorial-1.png`"
              max-width="500px"
            />
          </div>

          <div class="mt-5">
            <p>{{ $t("tutorial_3") }}</p>
            <v-img
              :src="`${$config.app.baseURL}images/tutorial-2.png`"
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
