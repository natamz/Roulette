<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn
        icon="mdi-translate"
        v-bind="props"
      />
    </template>

    <v-list>
      <v-list-item
        v-for="locale in locales"
        :key="locale.code"
        @click="setLocale(locale.code)"
      >
        <v-list-item-title>{{ locale.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const { locales, setLocale } = useI18n();
</script>
