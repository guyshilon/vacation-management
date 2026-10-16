<script setup lang="ts">
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
  }
);
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4"
  >
    <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
      <h2 class="text-lg font-semibold">Reject request</h2>
      <p class="mt-1 text-sm text-slate-600">A comment is required.</p>
      <textarea
        v-model="comments"
        rows="4"
        class="mt-4 w-full rounded border border-slate-300 px-3 py-2 text-sm"
        placeholder="Why is this request rejected?"
      />
      <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded px-3 py-2 text-sm text-slate-700"
          :disabled="loading"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
          :disabled="loading"
          @click="emit('confirm', comments)"
        >
          {{ loading ? "Rejecting..." : "Reject" }}
        </button>
      </div>
    </div>
  </div>
</template>
