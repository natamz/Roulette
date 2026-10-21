<template>
  <v-row class="my-1">
    <v-col
      cols="1"
      class="px-1 d-flex flex-column justify-center"
    >
      <v-icon class="handle">
        $drag
      </v-icon>
    </v-col>

    <v-col
      cols="1"
      class="px-1 d-flex flex-column justify-center"
    >
      <v-btn
        block
        :style="'background-color:' + item.color"
        :aria-label="$t('change_color')"
        class="my-3"
        @click="$emit('colorClick')"
      />
    </v-col>

    <v-col
      cols="5"
      md="6"
      class="px-1"
    >
      <v-text-field
        :model-value="item.name"
        hide-details="auto"
        clearable
        @update:model-value="$emit('updateName', $event)"
        @keypress.enter="$emit('enter', $event)"
      />
    </v-col>

    <v-col
      cols="3"
      md="2"
      class="px-1"
    >
      <v-select
        :model-value="item.rate"
        :items="rates"
        density="compact"
        hide-details="auto"
        @update:model-value="$emit('updateRate', $event)"
      />
    </v-col>

    <v-col
      cols="2"
      class="px-1"
    >
      <v-btn
        size="x-small"
        icon
        color="error"
        :aria-label="$t('delete_item')"
        @click="$emit('remove')"
      >
        <v-icon>$close</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type RouletteItem from "~/models/entities/RouletteItem";

const rates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 項目リストの1行。親（Roulette.vue）が描き直しても、item が変わらない行は描き直さない（#202）
// - 親の v-for のハンドラは毎回新しい関数になるが、emits に書いたイベントのハンドラは props の比較から外れる
// - 回転中の無効化は親が inert でまとめるので、disabled は受け取らない
// - ルートの要素は1つ（Sortable は .list-group の直下の要素を行として扱う）
export default {
  props: {
    item: { type: Object as () => RouletteItem, required: true },
  },
  emits: ["updateName", "updateRate", "colorClick", "remove", "enter"],
  data(): { rates: number[] } {
    return { rates };
  },
};
</script>

<style lang="scss">
.v-select {
  * :not(.v-field__append-inner *) {
    height: 56px;
  }
}
</style>
