<script setup>
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/vue/24/solid";
import useFormats from "../../mixins/formats";

defineProps({
  title: String,
  time: String,
  isDecrease: {
    type: Boolean,
    default: false,
  },
  isIncrease: {
    type: Boolean,
    default: false,
  },
  isUrgent: {
    type: Boolean,
    default: false,
  },
});

const { getRelativeTime } = useFormats();
</script>
<template>
  <div class="px-6 py-[10px] rounded-[10px] mb-4" :class="{
    'bg-sky-100 dark:bg-sky-900': !isUrgent,
    'bg-red-100 dark:bg-red-800 border-red-400 dark:border-red-600 border':
      isUrgent,
  }">
    <div class="flex justify-between items-center">
      <span class="text-gray-800 dark:text-gray-200 font-normal">{{
        title
      }}</span>
      <span
        class="bg-red-600 dark:bg-red-500 text-white inline-block px-4 py-1 rounded-md text-[12px] font-medium cursor-default"
        v-if="isUrgent">
        عاجل
      </span>
    </div>
    <div class="flex items-center gap-1">
      <p class="time text-[12px] font-normal text-gray-600 dark:text-gray-300">
        {{ getRelativeTime(time).replace("قبل", "منذ") }}
      </p>
      <span>
        <ArrowTrendingUpIcon v-if="isIncrease" class="w-5 h-5"
          :class="{ 'text-green-500': !isUrgent, 'text-red-500': isUrgent }" />
        <ArrowTrendingDownIcon v-if="isDecrease" class="w-5 h-5"
          :class="{ 'text-green-500': !isUrgent, 'text-red-500': isUrgent }" />
      </span>
    </div>
  </div>
</template>