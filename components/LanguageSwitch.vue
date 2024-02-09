<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-translate" v-bind="props"></v-btn>
    </template>

    <v-list>
      <v-list-item v-for="(item, i) in languages" :key="i" @click="onClick(item.value)">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
export default {
  data() {
    return {
      languages: [
        { title: "English", value: "en" },
        { title: "日本語", value: "ja" },
      ],
    };
  },
  methods: {
    onClick(lang: string) {
      this.$i18n.locale = lang;
    },
  },
};
</script>
