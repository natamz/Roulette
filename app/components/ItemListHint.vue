<template>
  <!-- 上の項目リストを、しっぽ（::before）で指す -->
  <div
    class="item-list-hint"
    role="note"
  >
    <ul class="item-list-hint__list">
      <li v-if="reorder">
        <v-icon size="small">
          $drag
        </v-icon>
        {{ $t("drag_to_reorder") }}
      </li>
      <li v-if="swipe">
        <v-icon size="small">
          $swipeLeft
        </v-icon>
        {{ $t("swipe_to_delete") }}
      </li>
    </ul>

    <v-btn
      icon="$close"
      variant="text"
      size="small"
      :aria-label="$t('close_hint')"
      @click="$emit('close')"
    />
  </div>
</template>

<script lang="ts">
// 項目リストの下に出す、操作の案内のフキダシ
// - reorder: ハンドルのドラッグで並び替えられること
// - swipe: 行を左にスライドすると削除ボタンが出ること（スマホのダイアログだけ）
// 出すかどうかは親（Roulette.vue）がメモリに持つ。リロードしたらまた出す
export default {
  props: {
    reorder: { type: Boolean, default: false },
    swipe: { type: Boolean, default: false },
  },
  emits: ["close"],
};
</script>

<style lang="scss" scoped>
$tail: 8px;
$radius: 8px;

// 色は Vuetify のツールチップと同じ、テーマの surface-variant
.item-list-hint {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 16px + $tail;
  padding: 4px 4px 4px 12px;
  border-radius: $radius;
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.875rem;

  // しっぽは行のハンドル（24px）の列の上に置く
  // 角丸にかかると、三角の底が角の丸みの外にはみ出して段になるので、まっすぐなところから始める
  &::before {
    content: "";
    position: absolute;
    top: -$tail;
    left: $radius;
    border: $tail solid transparent;
    border-top: 0;
    border-bottom-color: rgb(var(--v-theme-surface-variant));
  }
}

.item-list-hint__list {
  flex: 1 1 0;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>
