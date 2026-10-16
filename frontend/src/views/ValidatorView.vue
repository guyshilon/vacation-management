<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { fetchUsers } from "../api/users";
import {
  approveVacationRequest,
  fetchVacationRequests,
  rejectVacationRequest,
} from "../api/vacationRequests";
import RejectCommentModal from "../components/RejectCommentModal.vue";
import VacationRequestTable from "../components/VacationRequestTable.vue";
import AppLayout from "../layouts/AppLayout.vue";
import type { User, VacationRequest } from "../types";
import { getApiErrorMessage } from "../utils/apiError";

const PAGE_SIZE = 5;

const requests = ref<VacationRequest[]>([]);
const users = ref<User[]>([]);
const page = ref(1);
const totalPages = ref(1);
const total = ref(0);
const statusFilter = ref("");
const userFilter = ref("");
const loading = ref(false);
const listError = ref("");
const actionError = ref("");
const actingId = ref<string | null>(null);
const rejectTarget = ref<VacationRequest | null>(null);
const rejectLoading = ref(false);
const rejectError = ref("");

async function loadRequests() {
  loading.value = true;
  listError.value = "";
  try {
    const { data } = await fetchVacationRequests({
      page: page.value,
      limit: PAGE_SIZE,
      status: statusFilter.value || undefined,
      user_id: userFilter.value || undefined,
    });
    requests.value = data.vacationRequests;
    totalPages.value = data.pagination.totalPages;
    total.value = data.pagination.total;
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

watch([statusFilter, userFilter], () => {
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
    actionError.value = getApiErrorMessage(error, "Could not approve this request.");
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
    rejectError.value = getApiErrorMessage(error, "Could not reject this request.");
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

onMounted(async () => {
  await loadUsers();
  await loadRequests();
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <section class="rounded-xl bg-white p-6 shadow-sm">
        <h1 class="text-xl font-semibold">All vacation requests</h1>
        <p class="mt-1 text-sm text-slate-600">
          Filter by status or employee. Pending requests can be approved or rejected.
        </p>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <label class="block space-y-1 text-sm">
            <span>Status</span>
            <select
              v-model="statusFilter"
              class="w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
          <label class="block space-y-1 text-sm">
            <span>Employee</span>
            <select
              v-model="userFilter"
              class="w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="">All</option>
              <option v-for="person in users" :key="person.id" :value="person.id">
                {{ person.name }}
              </option>
            </select>
          </label>
        </div>
      </section>

      <section class="rounded-xl bg-white p-6 shadow-sm">
        <p v-if="listError" class="text-sm text-red-600">{{ listError }}</p>
        <p v-else-if="actionError" class="mb-3 text-sm text-red-600">{{ actionError }}</p>
        <p v-else-if="loading" class="text-sm text-slate-500">Loading...</p>
        <VacationRequestTable
          v-else
          :requests="requests"
          show-user
          show-actions
        >
          <template #actions="{ request }">
            <div v-if="request.status === 'Pending'" class="flex gap-2">
              <button
                type="button"
                class="rounded bg-emerald-700 px-2 py-1 text-xs text-white disabled:opacity-50"
                :disabled="actingId === request.id"
                @click="onApprove(request)"
              >
                Approve
              </button>
              <button
                type="button"
                class="rounded bg-red-600 px-2 py-1 text-xs text-white"
                @click="openReject(request)"
              >
                Reject
              </button>
            </div>
            <span v-else class="text-xs text-slate-400">—</span>
          </template>
        </VacationRequestTable>

        <div class="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>{{ total }} request(s)</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded border px-2 py-1 disabled:opacity-40"
              :disabled="page <= 1 || loading"
              @click="previousPage"
            >
              Previous
            </button>
            <span>Page {{ page }} of {{ totalPages }}</span>
            <button
              type="button"
              class="rounded border px-2 py-1 disabled:opacity-40"
              :disabled="page >= totalPages || loading"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>
      </section>
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
