<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  submit: [payload: { start_date: string; end_date: string; reason?: string }];
}>();

defineProps<{
  loading: boolean;
  errorMessage: string;
}>();

const startDate = ref("");
const endDate = ref("");
const reason = ref("");

function onSubmit() {
  emit("submit", {
    start_date: startDate.value,
    end_date: endDate.value,
    reason: reason.value.trim() || undefined,
  });
}

function reset() {
  startDate.value = "";
  endDate.value = "";
  reason.value = "";
}

defineExpose({ reset });
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="block space-y-1 text-sm">
        <span>Start date</span>
        <input
          v-model="startDate"
          type="date"
          required
          class="w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>
      <label class="block space-y-1 text-sm">
        <span>End date</span>
        <input
          v-model="endDate"
          type="date"
          required
          class="w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>
    </div>
    <label class="block space-y-1 text-sm">
      <span>Reason (optional)</span>
      <textarea
        v-model="reason"
        rows="3"
        class="w-full rounded border border-slate-300 px-3 py-2"
      />
    </label>
    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    <button
      type="submit"
      class="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      :disabled="loading"
    >
      {{ loading ? "Submitting..." : "Submit request" }}
    </button>
  </form>
</template>
