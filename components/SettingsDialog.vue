<template>
  <div>
    <v-dialog max-width="800px" fullscreen v-model="dialog" transition="dialog-bottom-transition" class="settintgs-dialog">
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>設定</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-divider></v-divider>
        <v-list>
          <v-list-subheader>回転時間</v-list-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-btn v-for="item in rotationTimes" @click="setRotationTime(item.value)" :color="item.value == rotationTimeValue ? 'primary' : ''" class="ma-1">{{ item.name }} </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>
          <v-list-subheader> 音 </v-list-subheader>

          <v-list-item>
            <v-btn class="ma-1" @click="toggleAudio" v-model="audio"> <v-icon :icon="audio ? 'mdi-volume-high' : 'mdi-volume-off'"></v-icon></v-btn>
          </v-list-item>

          <v-list-subheader> 結果発表の効果音 </v-list-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-btn v-for="item in audioResultTypes" @click="setAudioResult(item)" class="ma-1" :color="item == audioResultType ? 'primary' : ''">
                {{ item }}
              </v-btn>
              <v-btn @click="setAudioResult(99)" class="ma-1" :color="99 == audioResultType ? 'primary' : ''"> ？ </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>
          <v-list-item>
            <theme-switch></theme-switch>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
interface rotationTime {
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
    audio: boolean;
    audioResultType: number;
    audioResultTypes: number[];
  } {
    return {
      dialog: false,
      rotationTimes: rotationTimes,
      rotationTimeValue: 0,
      audio: false,
      audioResultType: 1,
      audioResultTypes: [1, 2, 3],
    };
  },
  methods: {
    showDialog() {
      this.dialog = true;
      this.$audio.click();
    },
    setRotationTime(num: number) {
      this.rotationTimeValue = num;
      this.$audio.click();
      localStorage.setItem("rotationTime", `${num}`);
    },
    toggleAudio() {
      this.audio = !this.audio;
      localStorage.setItem("audio", `${this.audio}`);
      this.$audio.click();
    },
    setAudioResult(num: number) {
      this.audioResultType = num;
      localStorage.setItem("audioResultType", `${num}`);
      this.$audio.result();
    },
  },
  mounted() {
    this.rotationTimeValue = Number(localStorage.getItem("rotationTime")) ?? 8000;
    localStorage.setItem("rotationTime", String(this.rotationTimeValue));

    this.audio = localStorage.getItem("audio") == "true";

    this.audioResultType = Number(localStorage.getItem("audioResultType")) ?? 1;
    localStorage.setItem("audioResultType", String(this.audioResultType));
  },
};
</script>
