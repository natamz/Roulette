<template>
  <div>
    <settings-dialog ref="settingsDialog" />
    <template-dialog
      ref="templateDialog"
      @select-template="selectTemplate"
    />
    <tutorial-dialog ref="tutorialDialog" />
    <english-guide />

    <v-app>
      <v-app-bar elevation="1">
        <v-app-bar-title>{{ $t("title") }}</v-app-bar-title>
        <v-btn
          icon
          :aria-label="$t('tutorial_title')"
          :disabled="isRunning"
          @click="onTutorialClick"
        >
          <v-icon>$help</v-icon>
        </v-btn>
        <language-switch />
        <!-- スマホ（xs）では、テンプレートは項目リストのダイアログから開く（ヘッダーのアイコンが多いとタイトルが切れる） -->
        <!-- サーバーは画面の幅を知らないので、CSS で隠す -->
        <v-btn
          icon
          class="hidden-xs"
          :aria-label="$t('template_title')"
          :disabled="isRunning"
          @click="onTemplateClick"
        >
          <v-icon>$template</v-icon>
        </v-btn>
        <share-button />
        <v-btn
          icon
          :aria-label="$t('setting_title')"
          :disabled="isRunning"
          @click="onSettingClick"
        >
          <v-icon>$settings</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <roulette
            ref="roulette"
            @state-change="stateChange"
            @template-click="onTemplateClick"
          />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
import type TutorialDialog from "~/components/TutorialDialog.vue";
import type TemplateDialog from "~/components/TemplateDialog.vue";
import type SettingsDialog from "~/components/SettingsDialog.vue";
import type Roulette from "~/components/Roulette.vue";
import type RouletteItem from "~/models/entities/RouletteItem";

export default {
  data() {
    return {
      isRunning: false,
    };
  },
  methods: {
    selectTemplate(items: RouletteItem[]) {
      (this.$refs.roulette as typeof Roulette).setItems(items);
    },
    stateChange(isRunning: boolean) {
      this.isRunning = isRunning;
    },
    onTutorialClick() {
      (this.$refs.tutorialDialog as typeof TutorialDialog).showDialog();
    },
    onTemplateClick() {
      (this.$refs.templateDialog as typeof TemplateDialog).showDialog();
    },
    onSettingClick() {
      (this.$refs.settingsDialog as typeof SettingsDialog).showDialog();
    },
  },
};
</script>
