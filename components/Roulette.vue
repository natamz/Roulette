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
            <draggable
              class="list-group"
              :list="items"
              v-bind="dragOptions"
              item-key="id"
              handle=".handle"
              @start="drag = true"
              @end="drag = false"
              :component-data="{
                tag: 'div',
                type: 'transition-group',
                name: !drag ? 'flip-list' : null,
              }"
            >
              <template #item="{ element, index }">
                <v-row :key="element.id" class="my-1">
                  <v-col
                    cols="1"
                    class="px-1 d-flex flex-column justify-center"
                  >
                    <v-icon class="handle">mdi-drag-horizontal-variant</v-icon>
                  </v-col>

                  <v-col
                    cols="1"
                    class="px-1 d-flex flex-column justify-center"
                  >
                    <v-btn
                      block
                      @click="$refs.colorPalette.showDialog(element.id)"
                      :style="'background-color:' + element.color"
                      :disabled="isRunning"
                      class="my-3"
                    ></v-btn>
                  </v-col>

                  <v-col cols="6" class="px-1">
                    <v-text-field
                      ref="textFields"
                      v-model="element.name"
                      :disabled="isRunning"
                      hide-details="auto"
                      clearable
                      @keypress.enter="onKeypressEnter(index)"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="2" class="px-1">
                    <v-select
                      :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      v-model="element.rate"
                      :disabled="isRunning"
                      density="compact"
                      hide-details="auto"
                    ></v-select>
                  </v-col>

                  <v-col cols="2" class="px-1">
                    <v-btn
                      size="x-small"
                      icon
                      @click="remove(element.id)"
                      :disabled="isRunning"
                      class="remove-btn"
                    >
                      <v-icon> mdi-close </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
            </draggable>
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

const colorList: string[] = colors.flat();

export default {
  data(): { items: RouletteItem[]; isRunning: boolean; drag: boolean } {
    return {
      items: [],
      isRunning: false,
      drag: false,
    };
  },
  methods: {
    async add() {
      const _colors = colorList.filter((item) => !this.items.some((i) => i.color === item));
      if (_colors.length === 0) {
        _colors.push(...colorList);
      }

      let item = {
        name: "",
        color: _colors[Math.floor(Math.random() * _colors.length)],
        rate: 1,
        order: this.items.length,
      };
      await this.$db.rouletteItem.add(item);
      this.items.push(item);
    },
    async remove(id: number) {
      this.items = this.items.filter((item: RouletteItem) => item.id !== id);
      this.$db.rouletteItem.remove(id);
    },
    async changeColor({ id, color }) {
      this.items = this.items.map((item: RouletteItem) =>
        item.id === id ? { ...item, color: color } : item
      );
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
    async setItems(items: RouletteItem[]) {
      this.$db.rouletteItem.clear();
      this.items = items;
    },
    async onKeypressEnter(index: number) {
      if (index === this.items.length - 1) {
        await this.add();
      }
      this.$refs.textFields[index].focus();
    },
  },
  async mounted() {
    const query = this.$route.query.q;
    if (query) {
      const rouletteItems = this.$share.import(query);
      history.replaceState("", "", location.protocol + "//" + location.host + location.pathname);
      if (rouletteItems.length) {
        await this.$db.rouletteItem.clear();
        await this.$db.rouletteItem.addRange(rouletteItems);
      }
    }

    const item = await this.$db.rouletteItem.getAll();
    this.items = item.sort((a: RouletteItem, b: RouletteItem) => a.order - b.order);
  },
  watch: {
    items: {
      async handler(newItems: RouletteItem[]) {
        let order = 0;
        for (const item of newItems) {
          await this.$db.rouletteItem.put({ ...item, order: order++ });
        }
      },
      deep: true,
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
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
