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
            <v-list-item-title class="mr-3"> 回転時間 </v-list-item-title>
            <v-list-item-action v-for="item in rotationTimes">
              <v-btn
                @click="setRotationTime(item.value)"
                :color="item.value == rotationTimeValue ? 'primary' : ''"
                class="ma-1"
                >{{ item.name }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
class rotationTime {
  name: string;
  value: number;
}
const rotationTimes: rotationTime[] = [
  { name: "一瞬", value: 0 },
  { name: "短い", value: 1000 },
  { name: "普通", value: 8000 },
  { name: "長い", value: 10000 },
];

export default {
  data(): {
    dialog: boolean;
    rotationTimes: rotationTime[];
    rotationTimeValue: number;
  } {
    return {
      dialog: false,
      rotationTimes: rotationTimes,
      rotationTimeValue: 0,
    };
  },
  methods: {
    showDialog() {
      this.dialog = true;
    },
    setRotationTime(num: number) {
      this.$params.rotationTime = this.rotationTimeValue = num;
      localStorage.setItem("rotationTime", `${num}`);
    },
  },
  mounted() {
    this.$params.rotationTime = this.rotationTimeValue =
      localStorage.getItem("rotationTime") ?? 8000;
  },
};
</script>
