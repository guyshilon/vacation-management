<script setup lang="ts">
// Vue
import { computed, onMounted, ref } from "vue";

// Types
import type { VacationRequest } from "../types";

// API
import {
  createVacationRequest,
  fetchMyVacationRequests,
} from "../api/vacationRequests";

// Components
import PageSearch from "../components/PageSearch.vue";
import VacationRequestForm from "../components/VacationRequestForm.vue";
import VacationRequestTable from "../components/VacationRequestTable.vue";

// Layouts
import AppLayout from "../layouts/AppLayout.vue";

// Composables
import { useDateSort } from "../composables/useDateSort";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { sortBy, sortDir, onSort, sorted } = useDateSort();

const requests = ref<VacationRequest[]>([]);
const loadingList = ref(false);
const submitting = ref(false);
const listError = ref("");
const formError = ref("");
const search = ref("");
const showForm = ref(false);

const visibleRequests = computed(() => {
  const term = search.value.trim().toLowerCase();
  const rows = term
    ? requests.value.filter((request) =>
        [request.reason, request.status, request.user?.name]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
    : requests.value;
  return sorted(rows);
});

async function loadRequests() {
  loadingList.value = true;
  listError.value = "";
  try {
    const { data } = await fetchMyVacationRequests();
    requests.value = data.vacationRequests;
  } catch (error) {
    listError.value = getApiErrorMessage(error, "Could not load your requests.");
  } finally {
    loadingList.value = false;
  }
}

function closeForm() {
  showForm.value = false;
  formError.value = "";
}

async function onCreate(payload: {
  start_date: string;
  end_date: string;
  reason?: string;
}) {
  submitting.value = true;
  formError.value = "";
  try {
    await createVacationRequest(payload);
    showForm.value = false;
    await loadRequests();
  } catch (error) {
    formError.value = getApiErrorMessage(error, "Could not submit the request.");
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  void loadRequests();
});
</script>

<template>
  <AppLayout>
    <template #search>
      <PageSearch v-model="search" />
    </template>
    <h1 class="page-title">My requests</h1>
    <div class="filter-row justify-end">
      <button class="btn-primary rounded-full" type="button" @click="showForm = true">
        + New request
      </button>
    </div>

    <VacationRequestForm
      :open="showForm"
      :loading="submitting"
      :error-message="formError"
      @close="closeForm"
      @submit="onCreate"
    />

    <p v-if="listError" class="text-sm" style="color: var(--status-rejected)">{{ listError }}</p>
    <p v-else-if="loadingList" class="text-sm text-[var(--text-secondary)]">Loading...</p>
    <VacationRequestTable
      v-else
      :requests="visibleRequests"
      show-user
      :sort-by="sortBy"
      :sort-dir="sortDir"
      @sort="onSort"
    />
  </AppLayout>
</template>
