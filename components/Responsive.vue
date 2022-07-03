<template>
  <div class="hidden-xs">
    <slot name="content"></slot>
  </div>

  <div class="hidden-sm-and-up">
    <v-row justify="center" class="mt-2">
      <v-btn :disabled="isRunning" @click="dialog = true">
        <v-icon size="30">mdi-chevron-up</v-icon>
      </v-btn>
    </v-row>

    <v-dialog width="100%" fullscreen v-model="dialog">
      <v-card>
        <v-card-actions>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>

        <slot name="content"></slot>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export default {
  data(): {
    dialog: boolean;
  } {
    return {
      dialog: false,
    };
  },
  props: {
    isRunning: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.v-card-actions {
  background-color: #cfd8dc;
}
</style>
