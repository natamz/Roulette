<template>
  <color-palette
    ref="colorPalette"
    @color-submit="changeColor"
  />
  <result-dialog ref="resultDialog" />

  <v-row>
    <v-col
      cols="12"
      sm="6"
    >
      <wheel
        ref="wheel"
        :items="items"
        @stopped="stopped"
      />

      <v-btn
        block
        color="primary"
        elevation="2"
        size="large"
        :disabled="isRunning"
        @click="start"
      >
        {{ $t("start") }}
      </v-btn>
    </v-col>

    <v-col
      cols="12"
      sm="6"
    >
      <responsive :is-running="isRunning">
        <template #content>
          <v-container>
            <vue-draggable
              v-model="items"
              class="list-group"
              handle=".handle"
              :animation="200"
            >
              <v-row
                v-for="(element, index) in items"
                :key="element.id"
                class="my-1"
              >
                <v-col
                  cols="1"
                  class="px-1 d-flex flex-column justify-center"
                >
                  <v-icon class="handle">
                    $drag
                  </v-icon>
                </v-col>

                <v-col
                  cols="1"
                  class="px-1 d-flex flex-column justify-center"
                >
                  <v-btn
                    block
                    :style="'background-color:' + element.color"
                    :aria-label="$t('change_color')"
                    :disabled="isRunning"
                    class="my-3"
                    @click="onColorPaletteClick(element.id)"
                  />
                </v-col>

                <v-col
                  cols="5"
                  md="6"
                  class="px-1"
                >
                  <v-text-field
                    v-model="element.name"
                    :disabled="isRunning"
                    hide-details="auto"
                    clearable
                    @keypress.enter="onKeypressEnter(index, $event)"
                  />
                </v-col>

                <v-col
                  cols="3"
                  md="2"
                  class="px-1"
                >
                  <v-select
                    v-model="element.rate"
                    :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :disabled="isRunning"
                    density="compact"
                    hide-details="auto"
                  />
                </v-col>

                <v-col
                  cols="2"
                  class="px-1"
                >
                  <v-btn
                    size="x-small"
                    icon
                    color="error"
                    :aria-label="$t('delete_item')"
                    :disabled="isRunning"
                    @click="remove(element.id)"
                  >
                    <v-icon>$close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </vue-draggable>
            <v-btn
              block
              elevation="2"
              class="ma-1"
              :aria-label="$t('add_item')"
              :disabled="isRunning"
              @click="add"
            >
              <v-icon>$addItem</v-icon>
            </v-btn>
          </v-container>
        </template>
      </responsive>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { colors } from "~/consts/colors";
import type RouletteItem from "~/models/entities/RouletteItem";
import type ColorPalette from "~/components/ColorPalette.vue";
import type ResultDialog from "~/components/ResultDialog.vue";
import type Wheel from "~/components/Wheel.vue";
import { VueDraggable } from "vue-draggable-plus";

const colorList: string[] = colors.flat();

export default {
  components: { VueDraggable },
  emits: ["stateChange"],
  data(): { items: RouletteItem[]; isRunning: boolean } {
    return {
      items: [],
      isRunning: false,
    };
  },
  async mounted() {
    const rouletteItems = this.$share.sharedItems();
    if (rouletteItems.length) {
      await this.$db.rouletteItem.clear();
      await this.$db.rouletteItem.addRange(rouletteItems);
    }

    const item = (await this.$db.rouletteItem.getAll()) ?? [];
    this.items = item.sort((a: RouletteItem, b: RouletteItem) => a.order - b.order);

    // 画面の項目が変わったら、並び順を振り直して DB に保存する
    // DB から読んだ項目をそのまま書き戻さないよう、読んだあとに見始める
    // 全件を1つのトランザクションで書く。1件ずつ await で書くと、途中に削除が割り込み、消した項目を書き戻してしまう（#180）
    this.$watch("items", (newItems: RouletteItem[]) => {
      this.$db.rouletteItem.putRange(newItems.map((item, order) => ({ ...item, order })));
    }, { deep: true });
  },
  methods: {
    async add() {
      const _colors = colorList.filter(item => !this.items.some(i => i.color === item));
      if (_colors.length === 0) {
        _colors.push(...colorList);
      }

      const item = {
        name: "",
        color: _colors[Math.floor(Math.random() * _colors.length)],
        rate: 1,
        order: this.items.length,
      } as RouletteItem;
      await this.$db.rouletteItem.add(item);
      this.items.push(item);
    },
    async remove(id: number) {
      // add() と同じく、DB に反映してから画面を変える
      await this.$db.rouletteItem.remove(id);
      this.items = this.items.filter((item: RouletteItem) => item.id !== id);
    },
    async changeColor({ id, color }: { id: number; color: string }) {
      this.items = this.items.map((item: RouletteItem) => (item.id === id ? { ...item, color: color } : item));
    },
    start() {
      if (this.items.length < 1) {
        return;
      }
      this.isRunning = true;
      this.$emit("stateChange", true);
      this.$audio.start();
      (this.$refs.wheel as typeof Wheel).start();
    },
    stopped(id: number) {
      this.isRunning = false;
      this.$emit("stateChange", false);

      const result: RouletteItem | undefined = this.items.find((i: RouletteItem) => i.id == id);
      (this.$refs.resultDialog as typeof ResultDialog).showDialog(result?.name, result?.color);
      this.$audio.result();
    },
    async setItems(items: RouletteItem[]) {
      await this.$db.rouletteItem.clear();
      await this.$db.rouletteItem.addRange(items);
      const getItems = (await this.$db.rouletteItem.getAll()) ?? [];
      this.items = getItems;
    },
    // Enter で次の項目の名前に移る。最後の項目なら項目を足して、描画されてから移る
    // 項目リストは画面の幅で描く場所が変わる（Responsive.vue）ので、押した入力欄のリストの中で探す
    async onKeypressEnter(index: number, event: KeyboardEvent) {
      const list = (event.target as HTMLElement).closest(".list-group");
      if (index === this.items.length - 1) {
        await this.add();
        await this.$nextTick();
      }
      list?.querySelectorAll<HTMLInputElement>(".v-text-field:not(.v-select) input")[index + 1]?.focus();
    },
    onColorPaletteClick(elementid: number) {
      (this.$refs.colorPalette as typeof ColorPalette).showDialog(elementid);
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
</style>
