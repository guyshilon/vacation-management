<script setup lang="ts">
// Composables
import { useTheme } from "../composables/useTheme";

const { isDark, toggleDark } = useTheme();
</script>

<template>
  <button
    type="button"
    class="theme-switch"
    :class="{ on: isDark }"
    role="switch"
    :aria-checked="isDark"
    :title="isDark ? 'Light mode' : 'Dark mode'"
    @click="toggleDark()"
  >
    <span class="theme-switch-knob" aria-hidden="true" />
  </button>
</template>
