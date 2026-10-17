<script setup lang="ts">
// Vue
import { ref, watch } from "vue";

const props = defineProps<{
  open: boolean;
  loading: boolean;
  errorMessage: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [comments: string];
}>();

const comments = ref("");

watch(
  () => props.open,
  (open) => {
    if (open) {
      comments.value = "";
    }
  },
);
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
  >
    <div
      class="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-6"
    >
      <h2 class="text-lg font-semibold">Reject request</h2>
      <p class="mt-1 text-sm text-[var(--text-secondary)]">
        A comment is required.
      </p>
      <textarea
        v-model="comments"
        rows="4"
        class="field mt-4"
        placeholder="Why is this request rejected?"
      />
      <p
        v-if="errorMessage"
        class="mt-2 text-sm"
        style="color: var(--status-rejected)"
      >
        {{ errorMessage }}
      </p>
      <div class="mt-4 flex justify-end gap-2">
        <button
          class="btn-outline"
          type="button"
          :disabled="loading"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          class="btn-primary"
          style="background: var(--status-rejected)"
          type="button"
          :disabled="loading"
          @click="emit('confirm', comments)"
        >
          {{ loading ? "Rejecting..." : "Reject" }}
        </button>
      </div>
    </div>
  </div>
</template>
