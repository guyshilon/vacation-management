<script setup lang="ts">
// Vue
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  options: { value: string; label: string }[];
  placeholder: string;
}>();

const model = defineModel<string>({ default: "" });
const open = ref(false);
const root = ref<HTMLElement | null>(null);

const label = computed(
  () =>
    props.options.find((option) => option.value === model.value)?.label ??
    props.placeholder,
);

function toggle() {
  open.value = !open.value;
}

function pick(value: string) {
  model.value = value;
  open.value = false;
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null;
  if (root.value && target && !root.value.contains(target)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", onDocumentClick));
onUnmounted(() => document.removeEventListener("click", onDocumentClick));
</script>

<template>
  <div ref="root" class="filter-pill" :class="{ open }">
    <button class="filter-pill-btn" type="button" @click="toggle">
      <span class="filter-pill-icon">
        <slot name="icon" />
      </span>
      <span>{{ label }}</span>
      <svg
        class="filter-chevron"
        :class="{ open }"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      >
        <path d="M2.5 4.5 6 8l3.5-3.5" />
      </svg>
    </button>
    <div v-if="open" class="filter-menu">
      <button
        v-for="option in options"
        :key="option.value || placeholder"
        class="filter-menu-item"
        :class="{ active: option.value === model }"
        type="button"
        @click="pick(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
