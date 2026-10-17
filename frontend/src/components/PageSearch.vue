<script setup lang="ts">
const search = defineModel<string>({ default: "" });
</script>

<template>
  <form class="search-bar" role="search" @submit.prevent>
    <span class="search-bar-icon" aria-hidden="true">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.35"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="10.5" cy="10.5" r="6.25" />
        <path d="M15.3 15.3 21 21" />
      </svg>
    </span>
    <input
      v-model="search"
      type="search"
      placeholder="Start typing..."
      aria-label="Search requests"
    />
    <button type="submit">Search</button>
  </form>
</template>
