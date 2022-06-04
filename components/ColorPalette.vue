<template>
  <div>
    <v-dialog max-width="800px" v-model="dialog">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col v-for="color in colors">
              <v-btn
                @click="colorSubmit(color)"
                :style="'background-color:' + color"
              ></v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { colors } from "@/consts/colors";

export default {
  data(): {
    id: Number;
    dialog: boolean;
    colors: ReadonlyArray<string>;
  } {
    return {
      id: 0,
      dialog: false,
      colors: colors,
    };
  },
  methods: {
    showDialog(id: number) {
      this.id = id;
      this.dialog = true;
    },
    colorSubmit(color: string) {
      this.$emit("colorSubmit", { id: this.id, color: color });
      this.dialog = false;
    },
  },
};
</script>
