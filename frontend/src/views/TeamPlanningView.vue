<script setup lang="ts">
// Vue
import { computed, onMounted, ref } from "vue";

// Types
import type { VacationRequest } from "../types";

// API
import { fetchTeamVacationRequests } from "../api/vacationRequests";

// Components
import PageSearch from "../components/PageSearch.vue";
import VacationRequestTable from "../components/VacationRequestTable.vue";

// Layouts
import AppLayout from "../layouts/AppLayout.vue";

// Composables
import { useDateSort } from "../composables/useDateSort";

// Utils
import { getApiErrorMessage } from "../utils/apiError";

const { sortBy, sortDir, onSort, sorted } = useDateSort();

const requests = ref<VacationRequest[]>([]);
const loading = ref(false);
const errorMessage = ref("");
const search = ref("");

const visibleRequests = computed(() => {
  const term = search.value.trim().toLowerCase();
  const rows = term
    ? requests.value.filter((request) =>
        [request.reason, request.status, request.user?.name]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
    : requests.value;
  return sorted(rows);
});

onMounted(async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const { data } = await fetchTeamVacationRequests();
    requests.value = data.vacationRequests;
  } catch (error) {
    errorMessage.value = getApiErrorMessage(
      error,
      "Could not load team vacations.",
    );
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <AppLayout>
    <template #search>
      <PageSearch v-model="search" />
    </template>
    <h1 class="page-title">Team planning</h1>
    <p
      v-if="errorMessage"
      class="text-sm"
      style="color: var(--status-rejected)"
    >
      {{ errorMessage }}
    </p>
    <p v-else-if="loading" class="text-sm text-[var(--text-secondary)]">
      Loading...
    </p>
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
