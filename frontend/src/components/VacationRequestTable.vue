<script setup lang="ts">
import type { VacationRequest } from "../types";
import StatusBadge from "./StatusBadge.vue";

defineProps<{
  requests: VacationRequest[];
  showUser?: boolean;
  showActions?: boolean;
}>();
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm">
      <thead class="border-b text-slate-500">
        <tr>
          <th v-if="showUser" class="py-2 pr-3">Employee</th>
          <th class="py-2 pr-3">Start</th>
          <th class="py-2 pr-3">End</th>
          <th class="py-2 pr-3">Reason</th>
          <th class="py-2 pr-3">Status</th>
          <th class="py-2">Comments</th>
          <th v-if="showActions" class="py-2 pl-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="requests.length === 0">
          <td class="py-6 text-slate-500" :colspan="(showUser ? 6 : 5) + (showActions ? 1 : 0)">
            No vacation requests yet.
          </td>
        </tr>
        <tr v-for="request in requests" :key="request.id" class="border-b last:border-0">
          <td v-if="showUser" class="py-2 pr-3">
            {{ request.user?.name ?? "—" }}
          </td>
          <td class="py-2 pr-3">{{ request.start_date }}</td>
          <td class="py-2 pr-3">{{ request.end_date }}</td>
          <td class="py-2 pr-3">{{ request.reason || "—" }}</td>
          <td class="py-2 pr-3">
            <StatusBadge :status="request.status" />
          </td>
          <td class="py-2">{{ request.comments || "—" }}</td>
          <td v-if="showActions" class="py-2 pl-3">
            <slot name="actions" :request="request" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
