<template>
  <v-container>
    <wheel :items="items"></wheel>
  </v-container>
</template>

<script lang="ts">
export default {
  data() {
    return {
      items: [
        {
          value: "hoge",
          color: "#ff0000",
        },
        {
          value: "fuga",
          color: "#00ff00",
        },
        {
          value: "piyo",
          color: "#0000ff",
        },
      ],
    };
  },
};
</script>
