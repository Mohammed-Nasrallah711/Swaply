<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h3 class="title font-semibold text-lg text-blue-950 dark:text-white pr-2">
    {{ label }}
  </h3>
</template>