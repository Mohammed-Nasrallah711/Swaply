<script setup>
import { computed, inject, watch } from "vue";
import BaseSwitch from "./global/BaseSwitch.vue";
import MdiIcon from "./MdiIcon.vue";
import axiosClient from "../../axiosClient";

const props = defineProps({
  icon: [Object, String, Function],
  title: String,
  description: String,
  isEnable: Boolean,
  from: String,
  id: String,
});

const emit = defineEmits(["update:isEnable"]);
const emitter = inject("emitter");

const isEnableValue = computed({
  get: () => props.isEnable,
  set: (value) => emit("update:isEnable", value),
});

watch(
  () => isEnableValue.value,
  async (newVal) => {
    const response = await axiosClient.put(
      "/notifications/change-status-methods",
      {
        notification_method: props.id,
        status: newVal,
      }
    );
    if (response.status == 200) {
      emitter.emit("showNotificationAlert", [
        "success",
        `تم ${newVal ? "تفعيل" : "ايقاف"} ${props.title} بنجاح`,
      ]);
    }
  }
);
</script>

<template>
  <div
    class="flex bg-white dark:bg-gray-900 shadow-md dark:shadow-[inset_0_-4px_10px_rgba(0,0,0,0.01)] dark:shadow-slate-700 w-full items-center rounded-2xl justify-between px-8 py-4 mb-4 transition-colors">
    <div class="flex items-center gap-4">
      <div class="icon">
        <template v-if="from == 'mdi'">
          <MdiIcon :icon="icon" class="w-[30px] h-[30px] text-blue-800 dark:text-white" />
        </template>
        <template v-else>
          <component :is="icon" class="w-[30px] h-[30px] text-blue-800 dark:text-white dark:fill-white" />
        </template>
      </div>
      <div>
        <div>
          <span class="text-blue-600 dark:text-white font-medium text-[16px] mb-1 block">
            {{ title }}
          </span>
          <span class="text-gray-600 dark:text-gray-300 font-normal text-[14px] mb-2 block">
            {{ description }}
          </span>
        </div>
      </div>
    </div>
    <div class="action">
      <BaseSwitch v-model:model-value="isEnableValue" />
    </div>
  </div>
</template>