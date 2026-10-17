<script setup lang="ts">
defineProps<{
  compact?: boolean;
}>();
</script>

<template>
  <div class="nav-brand" :class="{ compact }">
    <div class="nav-brand-mark" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="var(--brand)"
          stroke-width="1.8"
        />
        <path
          d="M12 12 9.4 10.4"
          stroke="var(--brand)"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <path
          d="M12 12 15.6 9.9"
          stroke="var(--brand)"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <circle cx="12" cy="12" r="1.15" fill="var(--brand)" />
      </svg>
    </div>
    <span class="nav-brand-name">VacationFactory</span>
  </div>
</template>
