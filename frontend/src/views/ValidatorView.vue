<script setup lang="ts">
// Vue
import { computed, onMounted, ref, watch } from "vue";

// Types
import type { User, VacationRequest } from "../types";

// API
import { fetchUsers } from "../api/users";
import {
  approveVacationRequest,
  fetchVacationRequests,
  rejectVacationRequest,
} from "../api/vacationRequests";

// Components
import ActionsMenu from "../components/ActionsMenu.vue";
import FilterSelect from "../components/FilterSelect.vue";
import PageSearch from "../components/PageSearch.vue";
import RejectCommentModal from "../components/RejectCommentModal.vue";
import VacationRequestTable from "../components/VacationRequestTable.vue";

// Layouts
import AppLayout from "../layouts/AppLayout.vue";

// Composables
import { useDateSort } from "../composables/useDateSort";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { sortBy, sortDir, onSort } = useDateSort();

const PAGE_SIZE = 10;

const requests = ref<VacationRequest[]>([]);
const users = ref<User[]>([]);
const page = ref(1);
const totalPages = ref(1);
const statusFilter = ref("");
const userFilter = ref("");
const search = ref("");
const loading = ref(false);
const listError = ref("");
const actionError = ref("");
const actingId = ref<string | null>(null);
const rejectTarget = ref<VacationRequest | null>(null);
const rejectLoading = ref(false);
const rejectError = ref("");

const statusOptions = [
  { value: "", label: "Status" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

const employeeOptions = computed(() => [
  { value: "", label: "Employee" },
  ...users.value.map((person) => ({ value: person.id, label: person.name })),
]);

const pageItems = computed(() => {
  const last = Math.max(1, totalPages.value);
  const current = page.value;
  const wanted = [1, last, current - 1, current, current + 1].filter(
    (n) => n >= 1 && n <= last,
  );
  const unique = [...new Set(wanted)].sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  unique.forEach((n, index) => {
    if (index > 0 && n - unique[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(n);
  });
  return items;
});

const visibleRequests = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) {
    return requests.value;
  }
  return requests.value.filter((request) =>
    [request.reason, request.status, request.user?.name, request.user?.email]
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
});

async function loadRequests() {
  loading.value = true;
  listError.value = "";
  try {
    const { data } = await fetchVacationRequests({
      page: page.value,
      limit: PAGE_SIZE,
      status: statusFilter.value || undefined,
      user_id: userFilter.value || undefined,
      sort: sortBy.value || undefined,
      order: sortBy.value ? sortDir.value : undefined,
    });
    requests.value = data.vacationRequests;
    totalPages.value = data.pagination.totalPages;
  } catch (error) {
    listError.value = getApiErrorMessage(error, "Could not load requests.");
  } finally {
    loading.value = false;
  }
}

async function loadUsers() {
  const { data } = await fetchUsers();
  users.value = data.users;
}

watch([statusFilter, userFilter, sortBy, sortDir], () => {
  page.value = 1;
  void loadRequests();
});

async function onApprove(request: VacationRequest) {
  actingId.value = request.id;
  actionError.value = "";
  try {
    await approveVacationRequest(request.id);
    await loadRequests();
  } catch (error) {
    actionError.value = getApiErrorMessage(
      error,
      "Could not approve this request.",
    );
  } finally {
    actingId.value = null;
  }
}

function openReject(request: VacationRequest) {
  rejectError.value = "";
  rejectTarget.value = request;
}

async function onReject(comments: string) {
  if (!rejectTarget.value) {
    return;
  }
  rejectLoading.value = true;
  rejectError.value = "";
  try {
    await rejectVacationRequest(rejectTarget.value.id, comments);
    rejectTarget.value = null;
    await loadRequests();
  } catch (error) {
    rejectError.value = getApiErrorMessage(
      error,
      "Could not reject this request.",
    );
  } finally {
    rejectLoading.value = false;
  }
}

function previousPage() {
  if (page.value > 1) {
    page.value -= 1;
    void loadRequests();
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value += 1;
    void loadRequests();
  }
}

function goToPage(next: number) {
  if (
    next === page.value ||
    next < 1 ||
    next > totalPages.value ||
    loading.value
  ) {
    return;
  }
  page.value = next;
  void loadRequests();
}

onMounted(async () => {
  try {
    await loadUsers();
  } catch {
    users.value = [];
  }
  await loadRequests();
});
</script>

<template>
  <AppLayout>
    <template #search>
      <PageSearch v-model="search" />
    </template>
    <h1 class="page-title">Review requests</h1>
    <div class="filter-row">
      <FilterSelect
        v-model="statusFilter"
        placeholder="Status"
        :options="statusOptions"
      >
        <template #icon>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M4 11h16" />
          </svg>
        </template>
      </FilterSelect>
      <FilterSelect
        v-model="userFilter"
        placeholder="Employee"
        :options="employeeOptions"
      >
        <template #icon>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="9.5" cy="7" r="3.5" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </template>
      </FilterSelect>
    </div>

    <p v-if="listError" class="text-sm" style="color: var(--status-rejected)">
      {{ listError }}
    </p>
    <p
      v-if="actionError"
      class="mb-3 text-sm"
      style="color: var(--status-rejected)"
    >
      {{ actionError }}
    </p>
    <p
      v-if="loading && requests.length === 0"
      class="text-sm text-[var(--text-secondary)]"
    >
      Loading...
    </p>
    <div v-else class="table-stage">
      <Transition name="page-fade" mode="out-in">
        <VacationRequestTable
          :key="page"
          :requests="visibleRequests"
          paged
          show-user
          show-actions
          :sort-by="sortBy"
          :sort-dir="sortDir"
          @sort="onSort"
        >
          <template #actions="{ request }">
            <ActionsMenu
              :request="request"
              :acting="actingId === request.id"
              @approve="onApprove(request)"
              @reject="openReject(request)"
            />
          </template>
        </VacationRequestTable>
      </Transition>
    </div>

    <div class="pager">
      <div class="pager-status">
        Showing
        <span class="pager-current">{{ page }}</span>
        Out of {{ Math.max(totalPages, 1) }}
      </div>
      <div class="pager-controls">
        <button
          class="pager-btn"
          type="button"
          :disabled="page <= 1 || loading"
          @click="previousPage"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Previous
        </button>
        <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
          <span v-if="item === 'ellipsis'" class="pager-ellipsis">…</span>
          <button
            v-else
            class="pager-page"
            :class="{ current: item === page }"
            type="button"
            :disabled="loading"
            @click="goToPage(item)"
          >
            {{ item }}
          </button>
        </template>
        <button
          class="pager-btn"
          type="button"
          :disabled="page >= totalPages || loading"
          @click="nextPage"
        >
          Next
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>

    <RejectCommentModal
      :open="Boolean(rejectTarget)"
      :loading="rejectLoading"
      :error-message="rejectError"
      @close="rejectTarget = null"
      @confirm="onReject"
    />
  </AppLayout>
</template>
