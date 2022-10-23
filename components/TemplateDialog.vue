<template>
  <div>
    <v-dialog max-width="800px" fullscreen v-model="dialog" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>テンプレート</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-divider></v-divider>
        <v-list>
          <v-list-item v-for="(template, index) in templates">
            <v-row>
              <v-col>
                {{ template.name }}
              </v-col>
              <v-col>
                <v-btn class="ma-1" @click="selectTemplate(index)"></v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { templates } from "~~/consts/templates";

export default {
  data(): {
    dialog: boolean;
    templates: any;
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
      const items = JSON.parse(JSON.stringify(templates[index].items));
      if (items) {
        this.$emit("selectTemplate", items);
        this.$audio.click();
        this.dialog = false;
      }
    },
  },
};
</script>
