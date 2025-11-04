<script setup>
defineProps({
  icon: {
    type: String,
  },
});
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :class="$attrs"
    class="w-6 h-6 text-blue-900 dark:text-white">
    <path :d="icon" fill="currentColor" />
  </svg>
</template>