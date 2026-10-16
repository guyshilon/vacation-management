<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchTeamVacationRequests } from "../api/vacationRequests";
import VacationRequestTable from "../components/VacationRequestTable.vue";
import AppLayout from "../layouts/AppLayout.vue";
import type { VacationRequest } from "../types";
import { getApiErrorMessage } from "../utils/apiError";

const requests = ref<VacationRequest[]>([]);
const loading = ref(false);
const errorMessage = ref("");

onMounted(async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const { data } = await fetchTeamVacationRequests();
    requests.value = data.vacationRequests;
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, "Could not load team vacations.");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <AppLayout>
    <section class="rounded-xl bg-white p-6 shadow-sm">
      <h1 class="text-xl font-semibold">Team vacation planning</h1>
      <p class="mt-1 mb-4 text-sm text-slate-600">
        Pending and approved time off for everyone, ordered by start date. Rejected
        requests are hidden so you can plan around days people are actually out or waiting
        for approval.
      </p>
      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
      <p v-else-if="loading" class="text-sm text-slate-500">Loading...</p>
      <VacationRequestTable v-else :requests="requests" show-user />
    </section>
  </AppLayout>
</template>
