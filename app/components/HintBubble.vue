<template>
  <!-- 上にあるもの（項目リストやルーレット）を、しっぽ（::before）で指す -->
  <div
    class="hint-bubble"
    :class="{ 'hint-bubble--centered': centered }"
    role="note"
  >
    <ul class="hint-bubble__list">
      <slot />
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
// 操作の案内のフキダシ。中身は1行ずつ <li>（アイコンと文）で渡す
// - centered: しっぽを真ん中に置く。既定は左（項目リストの行のハンドルの列）
// 出すかどうかは親（Roulette.vue）がメモリに持つ。リロードしたらまた出す
export default {
  props: {
    centered: { type: Boolean, default: false },
  },
  emits: ["close"],
};
</script>

<style lang="scss" scoped>
$tail: 8px;
$radius: 8px;

// 色は Vuetify のツールチップと同じ、テーマの surface-variant
.hint-bubble {
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

.hint-bubble--centered::before {
  left: calc(50% - #{$tail});
}

.hint-bubble__list {
  flex: 1 1 0;
  margin: 0;
  padding: 0;
  list-style: none;

  :slotted(li) {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>
