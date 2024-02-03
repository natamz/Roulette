<template>
  <settings-dialog ref="settingsDialog"></settings-dialog>
  <template-dialog ref="templateDialog" @selectTemplate="selectTemplate"></template-dialog>
  <tutorial-dialog ref="tutorialDialog"></tutorial-dialog>

  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-title>ルーレット</v-app-bar-title>
      <v-btn @click="onTutorialClick" icon :disabled="isRunning">
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
      <v-btn @click="onTemplateClick" icon :disabled="isRunning">
        <v-icon>mdi-database</v-icon>
      </v-btn>
      <v-btn @click="onSettingClick" icon :disabled="isRunning">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <roulette ref="roulette" @stateChange="stateChange"></roulette>
      </v-container>
    </v-main>

    <v-footer>
      <v-card elevation="0" rounded="0" width="100%" class="text-center">
        <v-divider></v-divider>

        <v-card-text>
          <v-btn href="https://github.com/natamz/Roulette" variant="flat">
            <v-icon>mdi-github</v-icon>
          </v-btn>
          <share-button />
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import type TutorialDialog from "@/components/TutorialDialog.vue";
import type TemplateDialog from "@/components/TemplateDialog.vue";
import type SettingsDialog from "@/components/SettingsDialog.vue";
import type Roulette from "@/components/Roulette.vue";
import type RouletteItem from "~~/models/entities/RouletteItem";

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
