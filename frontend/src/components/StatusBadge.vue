<script setup lang="ts">
import type { VacationRequestStatus } from "../types";

defineProps<{
  status: VacationRequestStatus;
}>();

const classes: Record<VacationRequestStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
};
</script>

<template>
  <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="classes[status]">
    {{ status }}
  </span>
</template>
