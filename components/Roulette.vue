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
        <v-col cols="2">
          <v-btn
            class="ma-1"
            block
            @click="$refs.colorPalette.showDialog(item.id)"
            :style="'background-color:' + item.color"
            :disabled="isRunning"
          ></v-btn>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="item.name"
            :disabled="isRunning"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-select
            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            v-model="item.rate"
            :disabled="isRunning"
            density="compact"
          ></v-select>
        </v-col>

        <v-col cols="2">
          <v-btn
            size="x-small"
            block
            color="error"
            @click="remove(item.id)"
            :disabled="isRunning"
            >x</v-btn
          >
        </v-col>
      </v-row>

      <v-btn @click="add" block elevation="2" class="ma-1" :disabled="isRunning"
        >add</v-btn
      >
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { colors } from "@/consts/colors";
import { RouletteItem } from "~~/models/entities/RouletteItem";

export default {
  data(): { items: RouletteItem[]; isRunning: boolean } {
    return {
      items: [],
      isRunning: false,
    };
  },
  methods: {
    async add() {
      this.$db.rouletteItem.add({
        name: "",
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
    start() {
      if (this.items.length < 1) {
        return;
      }
      this.isRunning = true;
      this.$refs.wheel.start();
    },
    stopped(id: number) {
      this.isRunning = false;

      const result: RouletteItem = this.items.find(
        (i: RouletteItem) => i.id == id
      );
      this.$refs.resultDialog.showDialog(result.name, result.color);
    },
    async setItems(items) {
      this.$db.rouletteItem.clear();
      for (const item of items) {
        await this.$db.rouletteItem.add(item);
      }
      this.items = items;
    },
  },
  async mounted() {
    this.items = await this.$db.rouletteItem.getAll();
  },
  watch: {
    items: {
      async handler(newItems: RouletteItem[]) {
        for (const item of newItems) {
          await this.$db.rouletteItem.put(item);
        }
      },
      deep: true,
    },
  },
};
</script>
