<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="primary">
          <v-btn
            icon
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t("template_title") }}</v-toolbar-title>
          <v-spacer />
        </v-toolbar>

        <v-divider />
        <v-list>
          <v-list-item
            v-for="(template, index) in templates"
            :key="index"
          >
            <v-row>
              <v-col>
                {{ template.name[$i18n.locale] }}
              </v-col>
              <v-col>
                <v-btn
                  class="ma-1"
                  icon="mdi-check"
                  @click="selectTemplate(index)"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
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
