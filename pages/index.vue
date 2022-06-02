<template>
  <v-container>
    <wheel :items="items"></wheel>
    <v-list v-for="item in items" :key="item.id">
      <span>{{ item.id }}</span>
      <v-list-item>
        <input type="color" v-model="item.color" />
        <v-text-field height="37px" dense v-model="item.value"> </v-text-field>
        <v-btn @click="remove(item.id)">x</v-btn>
      </v-list-item>
    </v-list>

    <v-btn @click="add">add</v-btn>
  </v-container>
</template>

<script lang="ts">
export default {
  data() {
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
      this.items = this.items.filter((i: { id: number }) => i.id !== id);
    },
  },
};
</script>
