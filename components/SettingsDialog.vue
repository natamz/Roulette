<template>
  <div>
    <v-dialog max-width="800px" fullscreen v-model="dialog" transition="dialog-bottom-transition" class="settintgs-dialog">
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t("setting_title") }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-divider></v-divider>
        <v-list>
          <v-list-subheader>{{ $t("setting_rotation_time") }}</v-list-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-btn v-for="item in rotationTimes" @click="setRotationTime(item.value)" :color="item.value == rotationTimeValue ? 'primary' : ''" :slim="true" class="ma-1" style="text-transform: none"
                >{{ item.name[$i18n.locale] }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-btn class="ma-1" @click="toggleAudio" v-model="audio"> <v-icon :icon="audio ? 'mdi-volume-high' : 'mdi-volume-off'"></v-icon></v-btn>
          </v-list-item>

          <v-list-subheader> {{ $t("setting_sound_type") }} </v-list-subheader>
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
  name: { [key: string]: string };
  value: number;
}
const rotationTimes: rotationTime[] = [
  { name: { ja: "一瞬", en: "Moment" }, value: 0 },
  { name: { ja: "短い", en: "Short" }, value: 1000 },
  { name: { ja: "普通", en: "Normal" }, value: 8000 },
  { name: { ja: "長い", en: "Long" }, value: 10000 },
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
