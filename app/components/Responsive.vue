<template>
  <!-- 項目リストを、PC は画面に、スマホ（xs）はダイアログの中に描く -->
  <!-- サーバーは画面の幅を知らないので、ハイドレーションまでは両方を描いて CSS で出し分け、マウントしたら片方だけにする（#181） -->
  <div
    v-if="!isMounted || !$vuetify.display.xs"
    class="hidden-xs"
  >
    <slot name="content" />
  </div>

  <!-- ダイアログは、ルーレットを押すと Roulette.vue が showDialog() で開く -->
  <div
    v-if="!isMounted || $vuetify.display.xs"
    class="hidden-sm-and-up"
  >
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
          <v-spacer />
          <!-- スマホではヘッダーのアイコンを減らすため、テンプレートはここから開く（ダイアログは index.vue） -->
          <v-btn
            prepend-icon="$template"
            @click="$emit('templateClick')"
          >
            {{ $t("template_title") }}
          </v-btn>
        </v-card-actions>

        <!-- ダイアログの中の行は、削除ボタンを常に出さず、左にスライドすると出す -->
        <slot
          name="content"
          :swipeable="true"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export default {
  emits: ["templateClick"],
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
