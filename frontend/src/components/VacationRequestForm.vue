<script setup lang="ts">
// Vue
import { computed, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  open: boolean;
  loading: boolean;
  errorMessage: string;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: { start_date: string; end_date: string; reason?: string }];
}>();

const startDate = ref("");
const endDate = ref("");
const reason = ref("");

const today = computed(() => toIsoDate(new Date()));
const maxDate = computed(() => {
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() + 2);
  return toIsoDate(limit);
});
const endMin = computed(() => startDate.value || today.value);

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function reset() {
  startDate.value = "";
  endDate.value = "";
  reason.value = "";
}

function onClose() {
  if (props.loading) {
    return;
  }
  emit("close");
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    onClose();
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      reset();
      window.addEventListener("keydown", onKeydown);
    } else {
      window.removeEventListener("keydown", onKeydown);
    }
  }
);

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});

function openCalendar(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }
}

function onSubmit() {
  emit("submit", {
    start_date: startDate.value,
    end_date: endDate.value,
    reason: reason.value.trim() || undefined,
  });
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-overlay" @click.self="onClose">
      <div class="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-modal-title">
        <header class="request-modal-head">
          <div>
            <h2 id="request-modal-title">Time off request</h2>
            <p>Fill out the form to submit a time off request.</p>
          </div>
          <button class="modal-close" type="button" :disabled="loading" aria-label="Close" @click="onClose">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <form class="request-modal-body" @submit.prevent="onSubmit">
          <div class="request-date-row">
            <div class="modal-field">
              <span>Start date</span>
              <input
                v-model="startDate"
                type="date"
                required
                :min="today"
                :max="maxDate"
                class="field date-field"
                @click="openCalendar"
              />
            </div>
            <span class="request-date-arrow" aria-hidden="true">→</span>
            <div class="modal-field">
              <span>End date</span>
              <input
                v-model="endDate"
                type="date"
                required
                :min="endMin"
                :max="maxDate"
                class="field date-field"
                @click="openCalendar"
              />
            </div>
          </div>

          <label class="modal-field">
            <span>Reason <em>(optional)</em></span>
            <textarea
              v-model="reason"
              rows="5"
              class="field"
              placeholder="Type description..."
            />
          </label>

          <p v-if="errorMessage" class="text-sm" style="color: var(--status-rejected)">{{ errorMessage }}</p>

          <div class="request-modal-footer">
            <button class="btn-outline" type="button" :disabled="loading" @click="onClose">Cancel</button>
            <button class="btn-primary" type="submit" :disabled="loading">
              {{ loading ? "Submitting..." : "Submit request" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
