<script setup lang="ts">
// Vue
import { ref } from "vue";
import { useRouter } from "vue-router";

// Components
import AppBrand from "../components/AppBrand.vue";

// Composables
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
    errorMessage.value =
      "Login failed. Check email, password, and that the backend is running.";
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)] p-4"
  >
    <form
      class="w-full max-w-md space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-8"
      @submit.prevent="onSubmit"
    >
      <AppBrand />
      <p class="text-sm text-[var(--text-secondary)]">
        Sign in with a demo account.
      </p>

      <label class="block space-y-1 text-sm text-[var(--text-body)]">
        <span>Email</span>
        <input v-model="email" type="email" required class="field" />
      </label>

      <label class="block space-y-1 text-sm text-[var(--text-body)]">
        <span>Password</span>
        <input v-model="password" type="password" required class="field" />
      </label>

      <p
        v-if="errorMessage"
        class="text-sm"
        style="color: var(--status-rejected)"
      >
        {{ errorMessage }}
      </p>

      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? "Signing in..." : "Sign in" }}
      </button>

      <p class="text-xs text-[var(--text-secondary)]">
        Requester: requester@vacation.local / Password123<br />
        Validator: validator@vacation.local / Password123
      </p>
    </form>
  </div>
</template>
