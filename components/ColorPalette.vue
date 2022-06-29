<template>
  <div>
    <v-dialog max-width="800px" v-model="dialog">
      <v-card>
        <v-card-actions>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>

        <v-card-text>
          <v-row v-for="colors in colorGroups" class="mt-1 mb-5">
            <v-col v-for="color in colors" cols="3" sm="2">
              <v-btn
                block
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
    colorGroups: ReadonlyArray<ReadonlyArray<string>>;
  } {
    return {
      id: 0,
      dialog: false,
      colorGroups: colors,
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
