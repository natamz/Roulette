<template>
  <color-palette ref="colorPalette" @colorSubmit="changeColor"></color-palette>
  <result-dialog ref="resultDialog"></result-dialog>

  <v-row>
    <v-col cols="12" sm="6">
      <wheel :items="items" ref="wheel" @stopped="stopped"></wheel>

      <v-btn
        @click="start"
        block
        color="primary"
        elevation="2"
        size="large"
        :disabled="isRunning"
        >start
      </v-btn>
    </v-col>

    <v-col cols="12" sm="6">
      <v-row v-for="item in items" :key="item.id">
        <v-btn
          class="ma-1"
          @click="$refs.colorPalette.showDialog(item.id)"
          :style="'background-color:' + item.color"
          :disabled="isRunning"
        ></v-btn>

        <v-text-field
          v-model="item.value"
          @blur="changeValue(item.id, item.value)"
          :disabled="isRunning"
        ></v-text-field>

        <v-btn
          size="x-small"
          color="error"
          @click="remove(item.id)"
          :disabled="isRunning"
          >x</v-btn
        >
      </v-row>

      <v-btn @click="add" block elevation="2" class="ma-1" :disabled="isRunning"
        >add</v-btn
      >
    </v-col>
  </v-row>
</template>

<script lang="ts">
import WheelItem from "@/types/WheelItem";
import { colors } from "@/consts/colors";

export default {
  data(): { items: WheelItem[]; isRunning: boolean } {
    return {
      items: [],
      isRunning: false,
    };
  },
  methods: {
    async add() {
      this.$db.rouletteItem.add({
        value: "",
        color: colors[Math.floor(Math.random() * colors.length)],
        rate: 1,
      });
      this.items = await this.$db.rouletteItem.getAll();
    },
    async remove(id: number) {
      this.$db.rouletteItem.remove(id);
      this.items = await this.$db.rouletteItem.getAll();
    },
    async changeColor({ id, color }) {
      const item = await this.$db.rouletteItem.get(id);
      item.color = color;
      this.$db.rouletteItem.update(item);
      this.items = await this.$db.rouletteItem.getAll();
    },
    async changeValue(id: number, value: string) {
      const item = await this.$db.rouletteItem.get(id);
      item.value = value;
      this.$db.rouletteItem.update(item);
    },
    start() {
      if (this.items.length < 1) {
        return;
      }
      this.isRunning = true;
      this.$refs.wheel.start();
    },
    stopped(id: number) {
      this.isRunning = false;

      const result: WheelItem = this.items.find((i: WheelItem) => i.id == id);
      this.$refs.resultDialog.showDialog(result.value, result.color);
    },
  },
  async mounted() {
    this.items = await this.$db.rouletteItem.getAll();
  },
};
</script>
