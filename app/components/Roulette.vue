<template>
  <color-palette
    ref="colorPalette"
    @color-submit="changeColor"
  />
  <result-dialog ref="resultDialog" />

  <!-- 共有URLを開いたときの案内。今の項目を置き換えたら元に戻せるようにし、読めなかったらそう伝える -->
  <stacked-snackbar
    v-model="shareSnackbar"
    :timeout="-1"
  >
    {{ $t(itemsBeforeShare.length ? "share_replaced" : "share_invalid") }}
    <template #actions>
      <v-btn
        v-if="itemsBeforeShare.length"
        variant="text"
        :disabled="isRunning"
        @click="undoShare"
      >
        {{ $t("share_undo") }}
      </v-btn>
      <v-btn
        icon="$close"
        :aria-label="$t('close')"
        variant="text"
        @click="shareSnackbar = false"
      />
    </template>
  </stacked-snackbar>

  <!-- sm はリストが狭く、名前の入力欄が潰れるので、リストを広めにとる -->
  <v-row>
    <v-col
      cols="12"
      sm="5"
      md="6"
    >
      <div class="wheel-area">
        <!-- スマホは項目リストがダイアログの中にあるので、ルーレットを押すと開く -->
        <div
          :class="{ 'wheel-button': tapToEdit }"
          :role="tapToEdit ? 'button' : undefined"
          :tabindex="tapToEdit ? 0 : undefined"
          :aria-label="tapToEdit ? $t('edit_items') : undefined"
          :aria-disabled="tapToEdit ? isRunning : undefined"
          @click="editItems"
          @keydown.enter.space.prevent="editItems"
        >
          <wheel
            ref="wheel"
            :items="items"
            :placeholder="placeholder"
            @stopped="stopped"
          />
        </div>

        <!-- スマホでは、出していないときも場所を空けておく（出し入れで開始ボタンが動かないように） -->
        <!-- サーバーは画面の幅を知らないので、静的 HTML にも透明なまま描き、PC は CSS で隠す -->
        <!-- 0件のときは、ルーレットの円の中に案内があるので出さない -->
        <!-- canvas の下には円の外の余白（幅の 10%）があるので、上はしっぽの分（mt-2 = 8px）だけ空ける -->
        <hint-bubble
          class="hidden-sm-and-up mt-2 mb-4"
          :class="{ 'wheel-hint--hidden': !(tapToEdit && wheelHint && items.length) }"
          centered
          @close="wheelHint = false"
        >
          <li>
            <v-icon size="small">
              $tap
            </v-icon>
            {{ $t("tap_wheel_to_edit") }}
          </li>
        </hint-bubble>

        <!-- 読み込むまでは0件か分からないので、押せる見た目のままにする -->
        <v-btn
          block
          color="primary"
          elevation="2"
          size="large"
          :disabled="isRunning || isLoaded && !items.length"
          @click="start"
        >
          {{ $t("start") }}
        </v-btn>
      </div>
    </v-col>

    <v-col
      cols="12"
      sm="7"
      md="6"
    >
      <responsive
        ref="responsive"
        @template-click="$emit('templateClick')"
      >
        <template #content="{ swipeable }">
          <!-- 回転中はリスト全体を inert で操作できなくする（並び替えも止まる） -->
          <!-- VContainer の中で isRunning を読むと、開始・停止のたびに VContainer から全行まで描き直すので、外に置く（#202） -->
          <div
            class="item-list"
            :inert="isRunning"
          >
            <!-- PC は VCol の余白があるので、左右の余白を足さない（名前の入力欄を広くとる） -->
            <v-container :class="{ 'px-0': !swipeable }">
              <vue-draggable
                v-model="items"
                class="list-group"
                handle=".handle"
                :animation="200"
                @update="hideHint"
              >
                <roulette-item-row
                  v-for="(element, index) in items"
                  :key="element.id"
                  :item="element"
                  :swipeable="swipeable"
                  @update-name="element.name = $event"
                  @update-rate="element.rate = $event"
                  @color-click="onColorPaletteClick(element.id)"
                  @remove="remove(element.id)"
                  @enter="onKeypressEnter(index, $event)"
                  @swiped="hideHint"
                />
              </vue-draggable>
              <v-btn
                block
                elevation="2"
                class="mt-1"
                :aria-label="$t('add_item')"
                @click="add"
              >
                <v-icon>$addItem</v-icon>
              </v-btn>
              <!-- 並び替え（2件から）と、スマホのスライドでの削除の案内。操作するか閉じたら、ふわっと消す -->
              <transition name="hint">
                <hint-bubble
                  v-if="hint && (items.length > 1 || swipeable && items.length)"
                  @close="hideHint"
                >
                  <li v-if="items.length > 1">
                    <v-icon size="small">
                      $drag
                    </v-icon>
                    {{ $t("drag_to_reorder") }}
                  </li>
                  <li v-if="swipeable">
                    <v-icon size="small">
                      $swipeLeft
                    </v-icon>
                    {{ $t("swipe_to_delete") }}
                  </li>
                </hint-bubble>
              </transition>
            </v-container>
          </div>
        </template>
      </responsive>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { colors } from "~/consts/colors";
import type RouletteItem from "~/models/entities/RouletteItem";
import { isSameItems } from "~/utils/share";
import type ColorPalette from "~/components/ColorPalette.vue";
import type ResultDialog from "~/components/ResultDialog.vue";
import type Responsive from "~/components/Responsive.vue";
import type Wheel from "~/components/Wheel.vue";
import { VueDraggable } from "vue-draggable-plus";

const colorList: string[] = colors.flat();

export default {
  components: { VueDraggable },
  emits: ["stateChange", "templateClick"],
  data(): {
    items: RouletteItem[];
    isRunning: boolean;
    isLoaded: boolean;
    hint: boolean;
    wheelHint: boolean;
    shareSnackbar: boolean;
    itemsBeforeShare: RouletteItem[];
  } {
    return {
      items: [],
      isRunning: false,
      // DB から項目を読み終えたか。それまでは0件か分からない
      isLoaded: false,
      // 項目リストの操作の案内（HintBubble.vue）を出すか。保存しないので、リロードしたらまた出る
      hint: true,
      // スマホの「ルーレットをタップして項目を編集」の案内を出すか。これも保存しない
      wheelHint: true,
      // 共有URLを開いたときの案内（StackedSnackbar.vue）を出すか
      shareSnackbar: false,
      // 共有URLの項目で置き換える前の項目。元に戻すときに使う。空なら、案内は「読み込めませんでした」
      // 案内が消えるまで文言が変わらないよう、元に戻したあとも空にしない
      itemsBeforeShare: [],
    };
  },
  computed: {
    // ルーレットを押すと項目リストのダイアログを開くか（スマホだけ）
    // サーバーは画面の幅を知らないので、マウントしてから（読み終えてから）決める
    tapToEdit(): boolean {
      return this.isLoaded && this.$vuetify.display.xs;
    },
    // 項目が無いときにルーレットの円に出す案内。PC はリストが横にあるので、タップを促さない
    placeholder(): string {
      if (!this.isLoaded || this.items.length) return "";
      return this.$t(this.tapToEdit ? "wheel_empty_tap" : "wheel_empty");
    },
  },
  async mounted() {
    let items = await this.getSortedItems();
    const shared = this.$share.sharedItems();
    if (shared === null) {
      this.shareSnackbar = true;
    }
    else if (shared.length && !isSameItems(items, shared)) {
      // 開いただけで今の項目が消えるので、元に戻せるようにする。項目が無ければ消えるものも無い
      await this.$db.rouletteItem.replaceAll(shared);
      if (items.length) {
        this.itemsBeforeShare = items;
        this.shareSnackbar = true;
      }
      items = await this.getSortedItems();
    }
    this.items = items;
    this.isLoaded = true;

    // 画面の項目が変わったら、並び順を振り直して DB に保存する
    // DB から読んだ項目をそのまま書き戻さないよう、読んだあとに見始める
    // 全件を1つのトランザクションで書く。1件ずつ await で書くと、途中に削除が割り込み、消した項目を書き戻してしまう（#180）
    this.$watch("items", (newItems: RouletteItem[]) => {
      this.$db.rouletteItem.putRange(newItems.map((item, order) => ({ ...item, order })));
    }, { deep: true });
  },
  methods: {
    async getSortedItems(): Promise<RouletteItem[]> {
      const items = (await this.$db.rouletteItem.getAll()) ?? [];
      return items.sort((a: RouletteItem, b: RouletteItem) => a.order - b.order);
    },
    // 共有URLの項目で置き換える前に戻す。id ごと戻すので、このあと watch が書くのも同じ内容
    async undoShare() {
      this.shareSnackbar = false;
      await this.$db.rouletteItem.replaceAll(this.itemsBeforeShare);
      this.items = [...this.itemsBeforeShare];
    },
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
    // スマホでルーレットを押したら、項目リストのダイアログを開く。案内はもう出さない
    editItems() {
      if (!this.tapToEdit || this.isRunning) return;
      this.wheelHint = false;
      (this.$refs.responsive as typeof Responsive).showDialog();
    },
    onColorPaletteClick(elementid: number) {
      (this.$refs.colorPalette as typeof ColorPalette).showDialog(elementid);
    },
    // 行をスライドして削除ボタンを出したか、並び替えたか、案内を閉じたら、案内はもう出さない
    hideHint() {
      this.hint = false;
    },
  },
};
</script>

<style lang="scss">
// PC・タブレットでは、リストが伸びてスクロールしても、ルーレットとスタートボタンを app-bar の下に残す
// 列はリストの高さまで伸びるので、その中で止まる。スマホ（xs）はリストがダイアログの中にあり、列が伸びないので止まらない
// top はスクロール前の位置（VContainer の余白 16px）と同じなので、スクロールしてもルーレットは動かない
// 画面の高さに収まらないと、スタートボタンが画面の外に出たままになるので、収まる大きさまで縮める
// （上の余白 16px ＋ スタートボタン（size="large"）の 44px ＋ 下の余白 16px）
// フッターを置くと、一番下までスクロールしたときにフッターの分だけ押し上げられる（列がフッターの上で終わるため）
.wheel-area {
  position: sticky;
  top: calc(var(--v-layout-top) + 16px);
  // dvh だと、スクロールでブラウザのバーが出入りするたびに大きさが変わる
  max-width: calc(100svh - var(--v-layout-top) - 76px);
  margin: 0 auto;
}

.wheel-button {
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
  }
}

.item-list[inert] {
  opacity: var(--v-disabled-opacity);
}

// ルーレットの案内は、場所を空けたまま透明にする。消えるときだけフェードする
.wheel-hint--hidden {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s, visibility 0.3s;
}

// 操作の案内（HintBubble.vue）は、消えるときだけフェードする
.hint-leave-active {
  transition: opacity 0.3s;
}

.hint-leave-to {
  opacity: 0;
}
</style>
