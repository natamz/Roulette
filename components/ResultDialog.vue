<template>
  <div>
    <v-dialog width="100%" v-model="dialog">
      <v-card>
        <v-card-text>
          <p>結果は・・・</p>
          <div id="color" v-if="color" :style="'background-color:' + color"></div>
          <h1>{{ result }}</h1>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export default {
  data(): {
    dialog: boolean;
    color: string;
    result: string;
  } {
    return {
      dialog: false,
      color: "",
      result: "",
    };
  },
  methods: {
    showDialog(result: string, color: string) {
      this.result = result;
      if (color !== "") {
        this.color = color;
      }

      this.dialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
div#color {
  margin-top: 10px;
  display: block;
  width: 100%;
  height: 2em;
  border-radius: 5px;
}
</style>
