<template>
  <div>
    <v-dialog max-width="800px" fullscreen v-model="dialog" transition="dialog-bottom-transition">
      <v-card>
        <v-card-actions color="primary">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>使い方</v-toolbar-title>
        </v-card-actions>
        <v-divider></v-divider>
        <v-card-text>
          <p>好きな言葉でルーレットを作成できるWebアプリです。</p>

          <div class="mt-5">
            <p>抽選したい言葉を入力して・・・</p>
            <v-img :src="`${$config.app.baseURL}images/tutorial-1.png`" max-width="500px"></v-img>
          </div>

          <div class="mt-5">
            <p>ルーレットを作成！</p>
            <v-img :src="`${$config.app.baseURL}images/tutorial-2.png`" max-width="400px"></v-img>
          </div>

          <div class="hidden-sm-and-up">
            ルーレットの編集画面は
            <v-icon size="30">mdi-chevron-up</v-icon>
            をタップすると表示されます。
          </div>

          <v-btn class="my-5" block @click="dialog = false">閉じる</v-btn>
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
  methods: {
    showDialog() {
      this.dialog = true;
      this.$audio.click();
    },
  },
  mounted() {
    if (localStorage.getItem("t") != "true") {
      localStorage.setItem("t", "true");
      this.dialog = true;
    }
  },
};
</script>
