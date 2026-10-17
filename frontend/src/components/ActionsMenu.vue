<script setup lang="ts">
// Vue
import { onMounted, onUnmounted, ref } from "vue";

// Types
import type { VacationRequest } from "../types";

const props = defineProps<{
  request: VacationRequest;
  acting: boolean;
}>();

const emit = defineEmits<{
  approve: [];
  reject: [];
}>();

const open = ref(false);

function close() {
  open.value = false;
}

function toggle() {
  open.value = !open.value;
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  if (target && !target.closest(`[data-actions="${props.request.id}"]`)) {
    close();
  }
}

onMounted(() => document.addEventListener("click", onDocumentClick));
onUnmounted(() => document.removeEventListener("click", onDocumentClick));
</script>

<template>
  <div
    v-if="request.status === 'Pending'"
    class="actions-wrap"
    :data-actions="request.id"
  >
    <button class="btn-actions" type="button" @click="toggle">
      Actions
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
    <div v-if="open" class="actions-menu">
      <button
        class="actions-menu-item approve"
        type="button"
        :disabled="acting"
        @click="
          emit('approve');
          close();
        "
      >
        Approve
      </button>
      <button
        class="actions-menu-item reject"
        type="button"
        @click="
          emit('reject');
          close();
        "
      >
        Reject
      </button>
    </div>
  </div>
  <span v-else class="text-sm text-[var(--text-secondary)]">—</span>
</template>
