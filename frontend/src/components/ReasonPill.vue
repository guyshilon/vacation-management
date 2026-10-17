<script setup lang="ts">
defineProps<{
  reason?: string | null;
}>();
</script>

<template>
  <span
    v-if="reason"
    class="reason-pill"
    :title="reason"
  >
    {{ reason }}
  </span>
  <span v-else class="text-sm text-[var(--text-secondary)]">—</span>
</template>
