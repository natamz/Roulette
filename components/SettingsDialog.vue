<template>
  <div>
    <v-dialog
      max-width="800px"
      fullscreen
      v-model="dialog"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>設定</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="dialog = false"> 保存 </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            回転時間
            <v-btn @click="rotationTime(1000)">短い</v-btn>
            <v-btn @click="rotationTime(8000)">普通</v-btn>
            <v-btn @click="rotationTime(10000)">長い</v-btn>
          </v-list-item>
        </v-list>
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
    },
    rotationTime(num: number) {
      this.$params.rotationTime = num;
      localStorage.setItem("rotationTime", `${num}`);
    },
  },
  mounted() {
    const rotationTime = localStorage.getItem("rotationTime");
    if (rotationTime) {
      this.$params.rotationTime = rotationTime;
    }
  },
};
</script>
