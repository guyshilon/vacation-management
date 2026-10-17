<script setup lang="ts">
// Vue
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Components
import AppBrand from "../components/AppBrand.vue";
import ThemeToggle from "../components/ThemeToggle.vue";

// Composables
import { useAuth } from "../composables/useAuth";

// Utils
import { initials } from "../utils/formatDate";

const { user, logout } = useAuth();
const router = useRouter();
const route = useRoute();
const avatar = computed(() => (user.value ? initials(user.value.name) : ""));
const menuOpen = ref(false);

watch(
  () => route.path,
  () => {
    menuOpen.value = false;
  }
);

function closeMenu() {
  menuOpen.value = false;
}

function onLogout() {
  logout();
  menuOpen.value = false;
  router.push("/login");
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeMenu();
  }
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <div class="app-canvas">
    <div class="app-shell">
      <button
        v-if="menuOpen"
        class="sidebar-backdrop"
        type="button"
        aria-label="Close menu"
        @click="closeMenu"
      />
      <aside
        class="app-sidebar flex min-h-full w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-sidebar)] px-4 py-6"
        :class="{ open: menuOpen }"
      >
        <AppBrand compact />

        <p class="nav-section">Main menu</p>
        <nav class="flex flex-1 flex-col gap-1">
          <router-link
            v-if="user?.role === 'Requester'"
            to="/requests"
            class="nav-item"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="5" width="18" height="16" rx="2.5" />
              <path d="M8 3v4M16 3v4M3 10h18" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
            </svg>
            My requests
          </router-link>
          <router-link
            v-if="user?.role === 'Validator'"
            to="/review"
            class="nav-item"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="5" width="18" height="16" rx="2.5" />
              <path d="M8 3v4M16 3v4M3 10h18" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
            </svg>
            Review
          </router-link>
          <router-link to="/team" class="nav-item">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
              <circle cx="9.5" cy="7" r="3.5" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Team planning
          </router-link>
        </nav>

        <button class="nav-item mt-auto" type="button" @click="onLogout">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 21h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" />
            <path d="M8 17l-5-5 5-5M3 12h12" />
          </svg>
          Log out
        </button>
      </aside>

      <div class="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--bg-app)]">
        <header class="app-header flex items-center gap-3 px-8 pt-6">
          <button
            class="menu-toggle header-icon"
            type="button"
            aria-label="Open menu"
            @click="menuOpen = true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div class="min-w-0 flex-1">
            <slot name="search" />
          </div>
          <div class="flex shrink-0 items-center gap-4">
            <ThemeToggle />
            <div
              class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
              style="background: var(--avatar)"
            >
              {{ avatar }}
            </div>
          </div>
        </header>
        <main class="app-main flex min-h-0 flex-1 flex-col px-8 pb-10 pt-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
