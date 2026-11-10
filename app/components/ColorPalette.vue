<template>
  <div>
    <!-- 中身が小さいので、スマホでも全画面にしない -->
    <app-dialog
      v-model="dialog"
      :title="$t('change_color')"
      max-width="360"
    >
      <div class="palette">
        <div
          v-for="(colors, i) in colorGroups"
          :key="i"
          class="palette__group"
        >
          <!-- 名前は色のコード（アイコンだけのボタンと同じく、読み上げる名前を付ける） -->
          <v-btn
            v-for="color in colors"
            :key="color"
            variant="flat"
            min-width="0"
            class="palette__swatch"
            :style="{ backgroundColor: color }"
            :aria-label="color"
            @click="colorSubmit(color)"
          />
        </div>
      </div>
    </app-dialog>
  </div>
</template>

<script lang="ts">
import { colors } from "~/consts/colors";

export default {
  emits: ["colorSubmit"],
  data(): {
    id: number;
    dialog: boolean;
    colorGroups: ReadonlyArray<ReadonlyArray<string>>;
  } {
    return {
      id: 0,
      dialog: false,
      colorGroups: colors,
    };
  },
  methods: {
    showDialog(id: number) {
      this.id = id;
      this.dialog = true;
    },
    colorSubmit(color: string) {
      this.$emit("colorSubmit", { id: this.id, color: color });
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.palette {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 24px 24px;
}

// 12色ずつのグループを、6列の2行に並べる
.palette__group {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

// 薄い色（白に近い色など）が背景に埋もれないよう、内側に細い枠を付ける
.palette__swatch.v-btn {
  height: auto;
  aspect-ratio: 1;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
