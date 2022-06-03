<template>
  <v-row>
    <v-col cols="12" sm="6">
      <wheel :items="items" ref="wheel"></wheel>

      <v-btn @click="$refs.wheel.start()">start</v-btn>
    </v-col>

    <v-col cols="12" sm="6">
      <v-list v-for="item in items" :key="item.id">
        <v-list-item>
          <input type="color" v-model="item.color" />
          <v-text-field height="37px" dense v-model="item.value">
          </v-text-field>
          <v-btn @click="remove(item.id)">x</v-btn>
        </v-list-item>
      </v-list>

      <v-btn @click="add">add</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import WheelItem from "@/types/WheelItem";

export default {
  data(): { items: WheelItem[]; count: number } {
    return {
      items: [
        {
          id: 1,
          value: "hoge",
          color: "#ff0000",
        },
        {
          id: 2,
          value: "fuga",
          color: "#00ff00",
        },
      ],
      count: 2,
    };
  },
  methods: {
    add() {
      this.count++;
      this.items.push({ id: this.count, value: "", color: "#ffff00" });
    },
    remove(id: number) {
      this.items = this.items.filter((i: WheelItem) => i.id !== id);
    },
  },
};
</script>
