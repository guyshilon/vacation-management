<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  createVacationRequest,
  fetchMyVacationRequests,
} from "../api/vacationRequests";
import VacationRequestForm from "../components/VacationRequestForm.vue";
import VacationRequestTable from "../components/VacationRequestTable.vue";
import AppLayout from "../layouts/AppLayout.vue";
import type { VacationRequest } from "../types";
import { getApiErrorMessage } from "../utils/apiError";

const requests = ref<VacationRequest[]>([]);
const loadingList = ref(false);
const submitting = ref(false);
const listError = ref("");
const formError = ref("");
const formRef = ref<{ reset: () => void } | null>(null);

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

async function onCreate(payload: {
  start_date: string;
  end_date: string;
  reason?: string;
}) {
  submitting.value = true;
  formError.value = "";
  try {
    await createVacationRequest(payload);
    formRef.value?.reset();
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
    <div class="space-y-8">
      <section class="rounded-xl bg-white p-6 shadow-sm">
        <h1 class="mb-1 text-xl font-semibold">New vacation request</h1>
        <p class="mb-4 text-sm text-slate-600">
          Start and end dates are required. The end date must be after the start date, and
          dates cannot be in the past or overlap another request.
        </p>
        <VacationRequestForm
          ref="formRef"
          :loading="submitting"
          :error-message="formError"
          @submit="onCreate"
        />
      </section>

      <section class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold">My requests</h2>
        <p v-if="listError" class="text-sm text-red-600">{{ listError }}</p>
        <p v-else-if="loadingList" class="text-sm text-slate-500">Loading...</p>
        <VacationRequestTable v-else :requests="requests" />
      </section>
    </div>
  </AppLayout>
</template>
