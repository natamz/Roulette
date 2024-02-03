<template>
  <v-switch v-model="dark" hide-details="auto" :prepend-icon="themeIcon"></v-switch>
</template>

<script lang="ts">
export default {
  data() {
    return {
      dark: false,
    };
  },
  computed: {
    themeIcon(): string {
      return this.dark ? "mdi-weather-night" : "mdi-weather-sunny";
    },
  },
  watch: {
    dark() {
      this.$colorMode.preference = this.dark ? "dark" : "light";
    },
  },
  mounted() {
    this.dark = localStorage.getItem("nuxt-color-mode") == "dark";
  },
};
</script>
