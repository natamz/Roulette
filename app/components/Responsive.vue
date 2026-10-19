<template>
  <div class="hidden-xs">
    <slot name="content" />
  </div>

  <div class="hidden-sm-and-up">
    <v-row
      justify="center"
      class="mt-2"
    >
      <v-btn
        :aria-label="$t('edit_items')"
        :disabled="isRunning"
        @click="showDialog"
      >
        <v-icon size="30">
          $editItems
        </v-icon>
      </v-btn>
    </v-row>

    <v-dialog
      v-model="dialog"
      width="100%"
      fullscreen
    >
      <v-card>
        <v-card-actions>
          <v-btn
            icon
            :aria-label="$t('close')"
            @click="dialog = false"
          >
            <v-icon>$close</v-icon>
          </v-btn>
        </v-card-actions>

        <slot name="content" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    isRunning: { type: Boolean, default: false },
  },
  data(): {
    dialog: boolean;
  } {
    return {
      dialog: false,
    };
  },
  methods: {
    showDialog() {
      this.dialog = true;
      this.$audio.click_B();
    },
  },
};
</script>
