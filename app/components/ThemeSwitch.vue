<template>
  <v-switch
    v-model="dark"
    hide-details="auto"
    :aria-label="$t('dark_mode')"
    :prepend-icon="themeIcon"
  />
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
      return this.dark ? "$themeDark" : "$themeLight";
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
