<script setup>
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { inject, ref, onMounted } from "vue";
import axiosClient from "../../axiosClient";

const props = defineProps({
  id: Number,
  title: {
    type: String,
  },
  whenRun: String,
  isActive: String,
  alerted: Boolean,
});
const box = ref(null);
const emitter = inject("emitter");
const emit = defineEmits(["update:isActive"]);

const isNew = ref(true);

onMounted(() => {
  setTimeout(() => {
    isNew.value = false;
  }, 50);
});

const updateStatus = async () => {
  const status = props.isActive == "active" ? "inactive" : "active";
  const response = await axiosClient.put(`notifications/${props.id}`, {
    status: status,
  });
  if (response.status == 200) {
    emit("update:isActive", status);
    emitter.emit("showNotificationAlert", [
      "success",
      `تم ${status == "active" ? "تنشيط" : "إيقاف"} التنبيه
  بنجاح`,
    ]);
  }
};

const isRemoving = ref(false);

const removeFromNotification = async () => {
  isRemoving.value = true;
  
  const response = await axiosClient.delete(`/notifications/${props.id}`);
  if (response.status == 200) {
    emitter.emit("showNotificationAlert", [
      "success",
      "تم حذف التنبيه بنجاح!",
    ]);
    
    // Wait for animation to complete before removing
    setTimeout(() => {
      box.value.remove();
    }, 300);
  } else {
    isRemoving.value = false;
  }
};
</script>
<template>
  <div 
    class="flex justify-between items-center bg-gray-100 dark:bg-gray-700 mb-3 rounded-[16px] p-3 pl-8 pr-4 transition-all duration-300 ease-out"
    :class="{ 
      'opacity-0 scale-95 -translate-y-2': isNew,
      'opacity-0 scale-95 translate-y-2': isRemoving 
    }"
    ref="box">
    <div>
      <div class="flex">
        <span class="title text-gray-900 dark:text-white font-medium text-[16px] mb-1 block">
          {{ title }}
        </span>
        <span class="status flex items-center gap-2 mr-2">
          <span
            class="active bg-green-700 dark:bg-green-600 rounded-2xl font-medium text-[12px] text-white py-[5px] px-[18px] cursor-pointer transition-opacity hover:opacity-70"
            v-if="isActive == 'active'" @click="updateStatus">
            نشط
          </span>
          <span
            class="in-active bg-gray-200 dark:bg-gray-600 rounded-2xl font-medium text-[12px] text-black dark:text-white py-[5px] px-[18px] cursor-pointer transition-opacity hover:opacity-70"
            v-else @click="updateStatus">
            متوقف
          </span>
          <span
            class="alerted bg-red-600 rounded-2xl font-medium text-[12px] text-white py-[5px] px-2 cursor-default select-none"
            v-if="alerted">
            تم التنبيه
          </span>
        </span>
      </div>
      <span class="text-gray-600 dark:text-gray-300 font-normal text-[14px] block">
        {{ whenRun }}
      </span>
    </div>
    <XMarkIcon
      class="w-6 h-6 text-gray-600 dark:text-gray-300 transition-all cursor-pointer hover:text-gray-900 dark:hover:text-white"
      @click="removeFromNotification" />
  </div>
</template>