<template>
  <!-- 項目リストを、PC は画面に、スマホ（xs）はダイアログの中に描く -->
  <!-- サーバーは画面の幅を知らないので、ハイドレーションまでは両方を描いて CSS で出し分け、マウントしたら片方だけにする（#181） -->
  <div
    v-if="!isMounted || !$vuetify.display.xs"
    class="hidden-xs"
  >
    <slot name="content" />
  </div>

  <div
    v-if="!isMounted || $vuetify.display.xs"
    class="hidden-sm-and-up"
  >
    <v-row
      justify="center"
      class="mt-2"
    >
      <v-btn
        :aria-label="$t('edit_items')"
        :disabled="isRunning"
        @click="showDialog"
      >
        <v-icon size="30">
          $editItems
        </v-icon>
      </v-btn>
    </v-row>

    <v-dialog
      v-model="dialog"
      width="100%"
      fullscreen
    >
      <v-card>
        <v-card-actions>
          <v-btn
            icon
            :aria-label="$t('close')"
            @click="dialog = false"
          >
            <v-icon>$close</v-icon>
          </v-btn>
        </v-card-actions>

        <slot name="content" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    isRunning: { type: Boolean, default: false },
  },
  data(): {
    dialog: boolean;
    isMounted: boolean;
  } {
    return {
      dialog: false,
      isMounted: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    showDialog() {
      this.dialog = true;
      this.$audio.click_B();
    },
  },
};
</script>
