<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid";
import { computed } from "vue";

const props = defineProps({
  modelValue: Object,
  options: Array,
  label: { type: String, default: "اختر" },
});
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <Listbox v-model="value">
    <div class="relative w-36 h-10">
      <ListboxButton v-slot="{ open }"
        class="w-full h-10 border flex text-[14px] items-center justify-between rounded-lg bg-white dark:bg-gray-700 py-3 px-3 text-gray-700 font-normal dark:text-white">
        <span>{{ value?.name || label }}</span>
        <ChevronUpIcon class="w-4 h-4 text-gray-500 dark:text-gray-300 mt-1" v-if="open" />
        <ChevronDownIcon class="w-4 h-4 text-gray-500 dark:text-gray-300 mt-1" v-else />
      </ListboxButton>

      <ListboxOptions
        class="absolute mt-1 max-h-60 text-[14px] w-full overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg z-[1000]">
        <ListboxOption v-for="option in options" :key="option.id" :value="option" v-slot="{ active, selected }">
          <li class="cursor-pointer select-none py-2 px-3" :class="[
            active
              ? 'bg-gray-100 dark:bg-blue-700 text-gray-700 dark:text-white'
              : 'text-gray-900 dark:text-white',
            selected
              ? 'bg-gray-200 dark:bg-blue-700 text-gray-600 dark:text-white'
              : '',
          ]">
            {{ option.name }}
          </li>
        </ListboxOption>
      </ListboxOptions>
    </div>
  </Listbox>
</template>
