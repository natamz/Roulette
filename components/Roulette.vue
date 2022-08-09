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
        >開始
      </v-btn>
    </v-col>

    <v-col cols="12" sm="6">
      <responsive :isRunning="isRunning">
        <template v-slot:content>
          <v-container>
            <v-row v-for="item in items" :key="item.id" class="my-1">
              <v-col cols="2" class="px-1 d-flex flex-column justify-center">
                <v-btn
                  block
                  @click="$refs.colorPalette.showDialog(item.id)"
                  :style="'background-color:' + item.color"
                  :disabled="isRunning"
                  class="my-3"
                ></v-btn>
              </v-col>

              <v-col cols="6" class="px-1">
                <v-text-field
                  ref="textFields"
                  v-model="item.name"
                  :disabled="isRunning"
                  hide-details="auto"
                  clearable
                  @keypress.enter="onKeypressEnter(item.id)"
                ></v-text-field>
              </v-col>

              <v-col cols="2" class="px-1">
                <v-select
                  :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                  v-model="item.rate"
                  :disabled="isRunning"
                  density="compact"
                  hide-details="auto"
                ></v-select>
              </v-col>

              <v-col cols="2" class="px-1">
                <v-btn
                  size="x-small"
                  icon
                  @click="remove(item.id)"
                  :disabled="isRunning"
                  class="remove-btn"
                >
                  <v-icon> mdi-close </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-btn
              @click="add"
              block
              elevation="2"
              class="ma-1"
              :disabled="isRunning"
            >
              <v-icon>mdi-card-plus-outline</v-icon>
            </v-btn>
          </v-container>
        </template>
      </responsive>
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
      const _colors = colors.flat();
      this.$db.rouletteItem.add({
        name: "",
        color: _colors[Math.floor(Math.random() * _colors.length)],
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
      this.$emit("stateChange", true);
      this.$audio.start();
      this.$refs.wheel.start();
    },
    stopped(id: number) {
      this.isRunning = false;
      this.$emit("stateChange", false);

      const result: RouletteItem = this.items.find(
        (i: RouletteItem) => i.id == id
      );
      this.$refs.resultDialog.showDialog(result.name, result.color);
      this.$audio.result();
    },
    async setItems(items) {
      this.$db.rouletteItem.clear();
      for (const item of items) {
        await this.$db.rouletteItem.add(item);
      }
      this.items = items;
    },
    async onKeypressEnter(id: number) {
      const maxId = Math.max(...this.items.map((i: RouletteItem) => i.id));
      if (id === maxId) {
        await this.add();
        this.$refs.textFields[this.$refs.textFields.length - 1].focus();
      }
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

<style lang="scss">
.v-select {
  * :not(.v-field__append-inner *) {
    height: 56px;
  }
}

.remove-btn {
  background-color: #e34c26;
  color: rgba(255, 255, 255, 0.85);
}
</style>
