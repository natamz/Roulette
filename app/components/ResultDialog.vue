<template>
  <div>
    <!-- 見出しは付けず、当選した項目の色と名前を大きく見せる。スマホでも全画面にしない -->
    <app-dialog
      v-model="dialog"
      max-width="400"
    >
      <div
        v-if="color"
        class="result__color"
        :style="{ backgroundColor: color }"
      />
      <div class="result__body">
        <v-btn
          icon="$close"
          variant="text"
          class="result__close"
          :aria-label="$t('close')"
          @click="dialog = false"
        />
        <p class="result__label">
          {{ $t("result") }}
        </p>
        <h1 class="result__name">
          {{ result }}
        </h1>
      </div>
    </app-dialog>
  </div>
</template>

<script lang="ts">
export default {
  data(): {
    dialog: boolean;
    color: string;
    result: string;
  } {
    return {
      dialog: false,
      color: "",
      result: "",
    };
  },
  methods: {
    showDialog(result: string, color: string) {
      this.result = result;
      if (color !== "") {
        this.color = color;
      }

      this.dialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.result__color {
  height: 12px;
}

.result__body {
  position: relative;
  padding: 32px 24px;
  text-align: center;
}

.result__close {
  position: absolute;
  top: 4px;
  right: 4px;
}

.result__label {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.875rem;
}

.result__name {
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: anywhere;
}
</style>
