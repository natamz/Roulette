<template>
  <div>
    <!-- PC は中央のカード、スマホは全画面 -->
    <app-dialog
      v-model="dialog"
      :title="$t('template_title')"
      mobile-fullscreen
    >
      <!-- 行そのものを押して選ぶ。名前の下に、項目の色を並べる -->
      <div class="templates">
        <v-btn
          v-for="(template, index) in templates"
          :key="index"
          variant="flat"
          border
          block
          class="templates__item"
          :aria-label="$t('use_template', { name: template.name[$i18n.locale] })"
          @click="selectTemplate(index)"
        >
          <span class="templates__name">{{ template.name[$i18n.locale] }}</span>
          <span class="templates__colors">
            <span
              v-for="(item, i) in template.items"
              :key="i"
              class="templates__color"
              :style="{ backgroundColor: item.color }"
            />
          </span>
        </v-btn>
      </div>
    </app-dialog>
  </div>
</template>

<script lang="ts">
import { templates } from "~/consts/templates";

export default {
  emits: ["selectTemplate"],
  data(): {
    dialog: boolean;
    templates: typeof templates;
  } {
    return {
      dialog: false,
      templates: templates,
    };
  },
  methods: {
    showDialog() {
      this.dialog = true;
      this.$audio.click();
    },
    selectTemplate(index: number) {
      const template = templates[index];
      if (!template) return;
      const items = JSON.parse(JSON.stringify(template.items));
      if (items) {
        this.$emit("selectTemplate", items);
        this.$audio.click();
        this.dialog = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.templates {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 24px 24px;
}

// v-btn は高さが固定で、中身を中央に1行で並べるので、2段の左寄せにする
.templates__item.v-btn {
  height: auto;
  padding: 12px 16px;
  border-radius: 12px;
  letter-spacing: normal;
  text-transform: none;

  :deep(.v-btn__content) {
    flex: 1 1 auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-width: 0;
    white-space: normal;
  }
}

.templates__name {
  font-size: 1rem;
  font-weight: 500;
  text-align: start;
}

.templates__colors {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

// 薄い色（黄色など）が背景に埋もれないよう、細い枠を付ける
.templates__color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
