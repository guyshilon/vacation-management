<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { homePathForRole, useAuth } from "../composables/useAuth";

const email = ref("requester@vacation.local");
const password = ref("Password123");
const errorMessage = ref("");
const loading = ref(false);

const { login } = useAuth();
const router = useRouter();

async function onSubmit() {
  errorMessage.value = "";
  loading.value = true;
  try {
    await login(email.value, password.value);
    const { user } = useAuth();
    await router.push(homePathForRole(user.value?.role ?? "Requester"));
  } catch (error) {
    errorMessage.value = "Login failed. Check email, password, and that the backend is running.";
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <form
      class="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-2xl font-semibold">Vacation Manager</h1>
      <p class="text-sm text-slate-600">Sign in with a demo account.</p>

      <label class="block space-y-1 text-sm">
        <span>Email</span>
        <input
          v-model="email"
          type="email"
          required
          class="w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>

      <label class="block space-y-1 text-sm">
        <span>Password</span>
        <input
          v-model="password"
          type="password"
          required
          class="w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

      <button
        type="submit"
        class="w-full rounded bg-slate-900 px-3 py-2 text-white disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? "Signing in..." : "Sign in" }}
      </button>

      <p class="text-xs text-slate-500">
        Requester: requester@vacation.local / Password123<br />
        Validator: validator@vacation.local / Password123
      </p>
    </form>
  </div>
</template>
