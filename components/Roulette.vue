<template>
  <color-palette ref="colorPalette" @colorSubmit="changeColor"></color-palette>

  <v-row>
    <v-col cols="12" sm="6">
      <wheel :items="items" ref="wheel"></wheel>

      <v-btn @click="$refs.wheel.start()">start</v-btn>
    </v-col>

    <v-col cols="12" sm="6">
      <v-row v-for="item in items" :key="item.id">
        <v-btn
          class="ma-1"
          @click="$refs.colorPalette.showDialog(item.id)"
          :style="'background-color:' + item.color"
        ></v-btn>

        <v-text-field v-model="item.value"></v-text-field>

        <v-btn size="x-small" color="error" @click="remove(item.id)">x</v-btn>
      </v-row>

      <v-btn @click="add" block elevation="2" class="ma-1">add</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import WheelItem from "@/types/WheelItem";
import { colors } from "@/consts/colors";

export default {
  data(): { items: WheelItem[]; count: number } {
    return {
      items: [
        {
          id: 1,
          value: "hoge",
          color: colors[0],
        },
        {
          id: 2,
          value: "fuga",
          color: colors[1],
        },
      ],
      count: 2,
    };
  },
  methods: {
    add() {
      this.count++;
      this.items.push({
        id: this.count,
        value: "",
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    },
    remove(id: number) {
      this.items = this.items.filter((i: WheelItem) => i.id !== id);
    },
    changeColor({ id, color }) {
      const index: number = this.items.findIndex((x: WheelItem) => x.id === id);
      if (index < -1) {
        return;
      }
      this.items[index].color = color;
    },
  },
};
</script>
