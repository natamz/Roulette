<template>
  <!-- .v-snackbar の margin はもともと 8px。下にほかのスナックバーが出ていたら、その分だけ上げる -->
  <v-snackbar
    ref="snackbar"
    v-model="model"
    :style="{ marginBottom: `${8 + offset}px` }"
    @after-leave="remove"
  >
    <slot />
    <template
      v-if="$slots.actions"
      #actions
    >
      <slot name="actions" />
    </template>
  </v-snackbar>
</template>

<script lang="ts">
// 出ているスナックバーと、その高さ（出た順）。全部のスナックバーで共有する
const shown = reactive<{ id: number; height: number }[]>([]);
let nextId = 0;
</script>

<script setup lang="ts">
// 画面の下に同時に出るスナックバー（初回の案内と、共有URLを開いたときの案内）を、重ならないように積む
// 先に出たものが下。下のものが消えきったら、上のものが下りる
const GAP = 8;

const model = defineModel<boolean>({ required: true });
const snackbar = ref<{ contentEl?: HTMLElement }>();
const id = nextId++;

// 自分より下にあるスナックバーの高さと間隔の合計
const offset = computed(() => {
  const index = shown.findIndex(entry => entry.id === id);
  return shown.slice(0, Math.max(index, 0)).reduce((sum, entry) => sum + entry.height + GAP, 0);
});

watch(model, (value) => {
  if (value && !shown.some(entry => entry.id === id)) shown.push({ id, height: 0 });
}, { immediate: true });

// 高さは文言の長さや、画面の幅での折り返しで変わる
watch(() => snackbar.value?.contentEl, (el, _, onCleanup) => {
  if (!el) return;
  const observer = new ResizeObserver(() => {
    const entry = shown.find(entry => entry.id === id);
    if (entry) entry.height = el.offsetHeight;
  });
  observer.observe(el);
  onCleanup(() => observer.disconnect());
});

function remove() {
  const index = shown.findIndex(entry => entry.id === id);
  if (index >= 0) shown.splice(index, 1);
}

onBeforeUnmount(remove);
</script>
