<template>
  <v-switch
    v-model="dark"
    inset
    color="primary"
    hide-details="auto"
    role="switch"
    :aria-label="$t('dark_mode')"
  />
</template>

<script lang="ts">
export default {
  computed: {
    // 保存した値（preference）ではなく、今のテーマを見る。OS の設定に従っているときは preference が "system" になる
    dark: {
      get(): boolean {
        return this.$colorMode.value == "dark";
      },
      set(value: boolean) {
        this.$colorMode.preference = value ? "dark" : "light";
      },
    },
  },
};
</script>
