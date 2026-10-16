<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const { user, logout } = useAuth();
const router = useRouter();

function onLogout() {
  logout();
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div>
          <p class="font-semibold">Vacation Manager</p>
          <p v-if="user" class="text-xs text-slate-500">
            {{ user.name }} · {{ user.role }}
          </p>
        </div>
        <nav class="flex items-center gap-4 text-sm">
          <router-link
            v-if="user?.role === 'Requester'"
            to="/requests"
            class="text-slate-700 hover:underline"
          >
            My requests
          </router-link>
          <router-link
            v-if="user?.role === 'Validator'"
            to="/review"
            class="text-slate-700 hover:underline"
          >
            Review
          </router-link>
          <router-link to="/team" class="text-slate-700 hover:underline">
            Team planning
          </router-link>
          <button class="text-slate-700 hover:underline" type="button" @click="onLogout">
            Log out
          </button>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
