<template>
  <div>
    <v-dialog width="100%" v-model="dialog">
      <v-card>
        <v-card-text>
          <p>結果は・・・</p>
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
  } {
    return {
      dialog: false,
    };
  },
  methods: {
    showDialog(result: string) {
      this.result = result;
      this.dialog = true;
    },
  },
};
</script>
