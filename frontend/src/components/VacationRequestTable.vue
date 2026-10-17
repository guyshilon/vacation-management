<script setup lang="ts">
// Vue
import { computed, ref } from "vue";

// Types
import type { DateSortField, SortDir } from "../composables/useDateSort";
import type { VacationRequest } from "../types";

// Utils
import { formatDisplayDate, initials, shortId, vacationDays } from "../utils/formatDate";

// Components
import ReasonPill from "./ReasonPill.vue";
import StatusBadge from "./StatusBadge.vue";

const AVATAR_COLORS = ["#ec4899", "#007cff", "#14b8a6", "#f59e0b", "#8b5cf6"];

const props = defineProps<{
  requests: VacationRequest[];
  showUser?: boolean;
  showActions?: boolean;
  paged?: boolean;
  sortBy?: DateSortField | "";
  sortDir?: SortDir;
}>();

const emit = defineEmits<{
  sort: [field: DateSortField];
}>();

const selected = ref<VacationRequest | null>(null);

const columnCount = computed(
  () => 6 + Number(props.showUser) + Number(props.showActions),
);

function requestName(request: VacationRequest): string {
  return request.user?.name ?? "Employee";
}

function avatarColor(name: string): string {
  let hash = 0;
  for (const char of name) {
    hash += char.charCodeAt(0);
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function openDetails(request: VacationRequest) {
  selected.value = request;
}

function closeDetails() {
  selected.value = null;
}

function onSheetActionClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  if (target?.closest(".actions-menu-item")) {
    closeDetails();
  }
}
</script>

<template>
  <div class="table-card overflow-visible" :class="{ paged }">
    <table class="request-table w-full min-w-[720px] text-left">
      <thead>
        <tr
          class="bg-[var(--bg-table-head)] text-sm font-semibold text-[var(--text-body)]"
        >
          <th
            class="rounded-l-[var(--radius-md)] py-3.5 pl-4 pr-4 font-semibold"
          >
            ID No.
          </th>
          <th v-if="showUser" class="py-3.5 pr-4 font-semibold">Name</th>
          <th class="py-3.5 pr-4 font-semibold">Days</th>
          <th class="py-3.5 pr-4 font-semibold">Reason</th>
          <th class="py-3.5 pr-4 font-semibold">Status</th>
          <th class="py-3.5 pr-4 font-semibold">
            <button
              class="sort-head"
              type="button"
              @click="emit('sort', 'start_date')"
            >
              Start Date
              <svg
                class="sort-icon"
                :class="{
                  asc: sortBy === 'start_date' && sortDir === 'ASC',
                  desc: sortBy === 'start_date' && sortDir === 'DESC',
                }"
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path class="sort-up" d="M3 5.2 6 2.2 9 5.2" />
                <path class="sort-down" d="M3 8.8 6 11.8 9 8.8" />
              </svg>
            </button>
          </th>
          <th
            class="py-3.5 pr-4 font-semibold"
            :class="showActions ? '' : 'rounded-r-[var(--radius-md)]'"
          >
            <button
              class="sort-head"
              type="button"
              @click="emit('sort', 'end_date')"
            >
              End Date
              <svg
                class="sort-icon"
                :class="{
                  asc: sortBy === 'end_date' && sortDir === 'ASC',
                  desc: sortBy === 'end_date' && sortDir === 'DESC',
                }"
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path class="sort-up" d="M3 5.2 6 2.2 9 5.2" />
                <path class="sort-down" d="M3 8.8 6 11.8 9 8.8" />
              </svg>
            </button>
          </th>
          <th
            v-if="showActions"
            class="rounded-r-[var(--radius-md)] py-3.5 pr-4 font-semibold"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="requests.length === 0">
          <td
            class="py-10 text-sm text-[var(--text-secondary)]"
            :colspan="columnCount"
          >
            No vacation requests yet.
          </td>
        </tr>
        <tr
          v-for="request in requests"
          :key="request.id"
          class="border-t border-[var(--border)] text-sm"
        >
          <td
            class="py-4 pl-3 pr-4 font-mono text-xs text-[var(--text-secondary)]"
          >
            {{ shortId(request.id) }}
          </td>
          <td
            v-if="showUser"
            class="py-4 pr-4 font-semibold text-[var(--text-primary)]"
          >
            {{ request.user?.name ?? "—" }}
          </td>
          <td class="py-4 pr-4 text-[var(--text-body)]">
            {{ vacationDays(request.start_date, request.end_date) }}
          </td>
          <td class="py-4 pr-4">
            <ReasonPill :reason="request.reason" />
          </td>
          <td class="py-4 pr-4">
            <StatusBadge :status="request.status" />
          </td>
          <td class="py-4 pr-4 text-[var(--text-body)]">
            {{ formatDisplayDate(request.start_date) }}
          </td>
          <td class="py-4 pr-4 text-[var(--text-body)]">
            {{ formatDisplayDate(request.end_date) }}
          </td>
          <td v-if="showActions" class="py-4 pr-3">
            <slot name="actions" :request="request" />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="request-cards">
      <p v-if="requests.length === 0" class="py-10 text-center text-sm text-[var(--text-secondary)]">
        No vacation requests yet.
      </p>
      <button
        v-for="request in requests"
        :key="request.id"
        class="request-card"
        type="button"
        @click="openDetails(request)"
      >
        <span class="request-card-avatar" :style="{ background: avatarColor(requestName(request)) }">
          {{ initials(requestName(request)) }}
        </span>
        <span class="request-card-copy">
          <strong>{{ requestName(request) }}</strong>
          <em>{{ request.reason?.trim() || "No reason" }}</em>
        </span>
        <StatusBadge :status="request.status" />
      </button>
    </div>

    <Teleport to="body">
      <div v-if="selected" class="request-sheet-overlay" @click.self="closeDetails">
        <div class="request-sheet" role="dialog" aria-modal="true" aria-labelledby="request-sheet-title">
          <div class="request-sheet-head">
            <span class="request-card-avatar" :style="{ background: avatarColor(requestName(selected)) }">
              {{ initials(requestName(selected)) }}
            </span>
            <div>
              <h2 id="request-sheet-title">{{ requestName(selected) }}</h2>
              <StatusBadge :status="selected.status" />
            </div>
            <button class="modal-close" type="button" aria-label="Close" @click="closeDetails">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <dl class="request-sheet-facts">
            <div>
              <dt>ID</dt>
              <dd>{{ shortId(selected.id) }}</dd>
            </div>
            <div>
              <dt>Days</dt>
              <dd>{{ vacationDays(selected.start_date, selected.end_date) }}</dd>
            </div>
            <div>
              <dt>Start</dt>
              <dd>{{ formatDisplayDate(selected.start_date) }}</dd>
            </div>
            <div>
              <dt>End</dt>
              <dd>{{ formatDisplayDate(selected.end_date) }}</dd>
            </div>
            <div class="wide">
              <dt>Reason</dt>
              <dd>{{ selected.reason?.trim() || "—" }}</dd>
            </div>
            <div v-if="selected.comments" class="wide">
              <dt>Comment</dt>
              <dd>{{ selected.comments }}</dd>
            </div>
          </dl>
          <div v-if="showActions" class="request-sheet-actions" @click="onSheetActionClick">
            <slot name="actions" :request="selected" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
