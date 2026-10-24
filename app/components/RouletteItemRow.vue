<template>
  <div
    class="item-row"
    :class="{ 'item-row--swipeable': swipeable }"
  >
    <!-- スマホのダイアログでは、ここを左にずらして右の削除ボタンを出す -->
    <!-- Sortable の並び替えのアニメーションはルートの transform を使うので、ずらすのは内側 -->
    <div
      class="item-row__track"
      :class="{ 'item-row__track--sliding': sliding, 'item-row__track--open': offset }"
      :style="{ transform: offset ? `translateX(${offset}px)` : undefined }"
      @pointerdown="onPointerdown"
      @pointermove="onPointermove"
      @pointerup="onPointerup"
      @pointercancel="close"
      @click.capture="onClickCapture"
    >
      <div class="item-row__content">
        <v-icon class="handle">
          $drag
        </v-icon>

        <v-btn
          variant="flat"
          width="40"
          height="40"
          min-width="0"
          :style="'background-color:' + item.color"
          :aria-label="$t('change_color')"
          @click="$emit('colorClick')"
        />

        <v-text-field
          class="item-row__name"
          :model-value="item.name"
          density="compact"
          hide-details="auto"
          @update:model-value="$emit('updateName', $event)"
          @keypress.enter="$emit('enter', $event)"
        />

        <v-select
          class="item-row__rate"
          :model-value="item.rate"
          :items="rates"
          :menu-props="menuProps"
          menu-icon=""
          density="compact"
          hide-details="auto"
          @update:model-value="$emit('updateRate', $event)"
        />

        <v-btn
          v-if="!swipeable"
          class="item-row__remove"
          icon="$close"
          variant="text"
          density="comfortable"
          :aria-label="$t('delete_item')"
          @click="$emit('remove')"
        />
      </div>

      <!-- キーボードで隠れたボタンにフォーカスが来たら出す -->
      <v-btn
        v-if="swipeable"
        class="item-row__swipe-remove"
        color="error"
        variant="flat"
        height="40"
        min-width="0"
        :aria-label="$t('delete_item')"
        @focus="open"
        @click="$emit('remove')"
      >
        <v-icon>$deleteItem</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import type RouletteItem from "~/models/entities/RouletteItem";

const rates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// 当選割合のメニューを select と同じ幅にする（class は下の :global のスタイル用）
const menuProps = { width: 40, contentClass: "item-row__rate-menu" };

// スライドで出す幅（削除ボタンの幅 72px + 間 8px。CSS の $remove-width / $gap と揃える）
const SLIDE_WIDTH = 80;
// これだけ動くまでは、タップかスライドかスクロールか決めない
const SLOP = 8;

// 項目リストの1行。親（Roulette.vue）が描き直しても、item が変わらない行は描き直さない（#202）
// - 親の v-for のハンドラは毎回新しい関数になるが、emits に書いたイベントのハンドラは props の比較から外れる
// - 回転中の無効化は親が inert でまとめるので、disabled は受け取らない
// - ルートの要素は1つ（Sortable は .list-group の直下の要素を行として扱う）
// - swipeable は、リストがスマホのダイアログの中にあるか（Responsive.vue）。開始・停止や並び替えでは変わらない
//   スマホでは削除ボタンを常に出さず、行を左にスライドすると出す
export default {
  props: {
    item: { type: Object as () => RouletteItem, required: true },
    swipeable: { type: Boolean, default: false },
  },
  emits: ["updateName", "updateRate", "colorClick", "remove", "enter", "swiped"],
  data(): {
    rates: number[];
    menuProps: typeof menuProps;
    offset: number;
    sliding: boolean;
    start: { x: number; y: number; offset: number } | null;
    slid: boolean;
  } {
    return { rates, menuProps, offset: 0, sliding: false, start: null, slid: false };
  },
  methods: {
    onPointerdown(event: PointerEvent) {
      this.slid = false;
      // ハンドルは並び替え（Sortable）に任せる
      if (!this.swipeable || event.button !== 0 || (event.target as HTMLElement).closest(".handle")) {
        return;
      }
      this.start = { x: event.clientX, y: event.clientY, offset: this.offset };
    },
    onPointermove(event: PointerEvent) {
      if (!this.start) {
        return;
      }
      const dx = event.clientX - this.start.x;
      const dy = event.clientY - this.start.y;
      if (!this.sliding) {
        if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) {
          return;
        }
        // 縦はスクロール（touch-action: pan-y でブラウザが受け持つ）
        if (Math.abs(dy) > Math.abs(dx)) {
          this.start = null;
          return;
        }
        // 押した時点で capture すると、タップが入力欄や色のボタンに届かないので、スライドと決まってからにする
        this.sliding = true;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      }
      this.offset = Math.min(0, Math.max(-SLIDE_WIDTH, this.start.offset + dx));
    },
    onPointerup() {
      if (this.sliding) {
        this.offset = this.offset < -SLIDE_WIDTH / 2 ? -SLIDE_WIDTH : 0;
        this.slid = true;
        // 親はこれで、操作の案内を消す
        if (this.offset) {
          this.$emit("swiped");
        }
      }
      this.start = null;
      this.sliding = false;
    },
    // スライドした直後の click と、開いているときに本体を押した click は、閉じるだけにする（色のパレットなどを開かない）
    // スライドのあとに click が来ないこともあるので、slid は次の pointerdown で戻す
    onClickCapture(event: MouseEvent) {
      if (this.slid) {
        this.slid = false;
      }
      else if (this.offset && !(event.target as HTMLElement).closest(".item-row__swipe-remove")) {
        this.close();
      }
      else {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
    },
    open() {
      this.offset = -SLIDE_WIDTH;
    },
    close() {
      this.start = null;
      this.sliding = false;
      this.offset = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
$gap: 8px;
$remove-width: 72px;

.item-row {
  padding-block: 4px;
}

.item-row__track {
  display: flex;
}

.item-row__content {
  display: flex;
  flex: 0 0 100%;
  gap: $gap;
  align-items: center;
}

.item-row__name {
  flex: 1 1 0;
  min-width: 0;
}

// ▼は出さず（menu-icon=""）、数字だけを真ん中に出す。色のボタンと同じ 40px 四方
.item-row__rate {
  flex: 0 0 40px;

  :deep(.v-field) {
    padding-inline-end: 0;
  }

  :deep(.v-field__input) {
    justify-content: center;
    padding-inline: 0;
  }
}

// メニューは body の下に描かれるので :global で当てる。数字を真ん中に出す
// Vuetify の .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line の padding より強くするため、class を重ねる
:global(.item-row__rate-menu .v-list-item.v-list-item--one-line.v-list-item--density-default) {
  padding-inline: 0;
  text-align: center;
}

.item-row__remove {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));

  &:hover,
  &:focus-visible {
    color: rgb(var(--v-theme-error));
  }
}

// スマホ: 削除ボタンは行の右の外にあり、普段は見えない
.item-row--swipeable {
  overflow: clip;

  .item-row__track {
    touch-action: pan-y;
    transition: transform 0.2s;
  }

  .item-row__track--sliding {
    transition: none;
    user-select: none;
  }

  // 開いているあいだは、本体を押しても閉じるだけ（select のメニューなどを開かない）
  .item-row__track--open .item-row__content {
    pointer-events: none;
  }
}

.item-row__swipe-remove {
  flex: 0 0 $remove-width;
  margin-inline-start: $gap;
}
</style>
