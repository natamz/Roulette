<template>
  <div>
    <v-dialog
      max-width="800px"
      fullscreen
      v-model="dialog"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>テンプレート</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="dialog = false"> 保存 </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-divider></v-divider>
        <v-list>
          <v-list-item v-for="(template, index) in templates">
            {{ template.name }}
            <v-btn @click="selectTemplate(index)"></v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
const templates = [
  {
    name: "サイコロ",
    items: [
      { name: "1", rate: 1, color: "#ff9e9e" },
      { name: "2", rate: 1, color: "#ff9eff" },
      { name: "3", rate: 1, color: "#9e9eff" },
      { name: "4", rate: 1, color: "#9effff" },
      { name: "5", rate: 1, color: "#9eff9e" },
      { name: "6", rate: 1, color: "#ffff9e" },
    ],
  },
];

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
    },
    selectTemplate(index: number) {
      const items = JSON.parse(JSON.stringify(templates[index].items));
      if (items) {
        this.$emit("selectTemplate", items);
        this.dialog = false;
      }
    },
  },
};
</script>
