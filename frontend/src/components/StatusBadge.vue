<script setup lang="ts">
// Types
import type { VacationRequestStatus } from "../types";

defineProps<{
  status: VacationRequestStatus;
}>();

const colors: Record<VacationRequestStatus, string> = {
  Pending: "var(--status-pending)",
  Approved: "var(--status-approved)",
  Rejected: "var(--status-rejected)",
};
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 text-sm font-medium"
    :style="{ color: colors[status] }"
  >
    <span
      class="h-1.5 w-1.5 rounded-full"
      :style="{ background: colors[status] }"
    />
    {{ status }}
  </span>
</template>
