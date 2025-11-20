<template>
  <HeaderPage title="البلاغات" :is-has-add-button="false" />

  <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
    <div class="space-y-4">
      <div class="grid grid-cols-6 gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div v-for="i in 6" :key="i" class="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div v-for="i in 8" :key="i" class="grid grid-cols-6 gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="flex gap-2 justify-center">
          <div class="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>

  <GenericDataTable v-else :headers="headers" :items="filteredItems">
    <template #product_id="{ item }">
      <span>#{{ item.product_id }}</span>
    </template>
    <template #actions="item">
      <div class="flex justify-center gap-2">
        <button v-if="item.item.status !== 'reviewed'" @click="markAsReviewed(item.item)"
          class="text-blue-600 dark:text-slate-50 hover:underline px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
          مراجعة البلاغ
        </button>
        <span v-else class="px-3 py-1 rounded bg-green-600 text-white cursor-default">
          تمت المراجعة
        </span>
        <button @click="deleteReport(item.item)"
          class="text-red-600 dark:text-red-400 hover:underline px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
          حذف
        </button>
      </div>
    </template>

    <template #prev-icon>
      <ChevronDoubleRightIcon class="w-5" />
    </template>

    <template #next-icon>
      <ChevronDoubleLeftIcon class="w-5" />
    </template>
  </GenericDataTable>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import HeaderPage from "../../components/dashboard/global/HeaderPage.vue";
import GenericDataTable from "../../components/dashboard/global/GenericDataTable.vue";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/vue/24/outline";
import axiosClient from "../../axiosClient";
import useFormats from "../../mixins/formats";

const headers = [
  { text: "رقم المنتج", value: "product_id", sortable: true },
  { text: "اسم المنتج", value: "product_name", sortable: true },
  { text: "سعر المنتج", value: "product_price", sortable: true },
  { text: "صاحب المنتج", value: "owner_name", sortable: true },
  { text: "عدد مرات الإبلاغ", value: "report_count", sortable: true },
  { text: "إجراءات", value: "actions" },
];

const items = ref([]);
const searchQuery = ref("");
const loading = ref(true);
const emitter = inject("emitter");
const { formatDate, cleanId } = useFormats();

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter((item) =>
    item.owner_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchReports = async () => {
  loading.value = true;
  try {
    const response = await axiosClient.get("/admin/reports");
    items.value = response.data.data.map((ele) => ({
      id: ele.id,
      product_id: ele.product_id,
      owner_name: ele.product.store.user.name,
      product_price: `${Math.round(ele.product.price)}`,
      report_count: ele.report_count,
      product_name: ele.product.name,
      status: ele.status,
    }));
  } catch (e) {
  } finally {
    loading.value = false;
  }
};
// Review Report
const markAsReviewed = async (item) => {
  try {
    const response = await axiosClient.put(
      `/admin/products/${cleanId(item.product_id)}/report/make-reviewed`,
      {
        status: "reviewed",
      }
    );
    if (response.status === 200) {
      items.value = items.value.map((i) =>
        i.id === item.id ? { ...i, status: "reviewed" } : i
      );
      emitter.emit("showNotificationAlert", ["success", "تمت مراجعة البلاغ"]);
    }
  } catch (e) {
    emitter.emit("showNotificationAlert", ["error", "فشلت عملية المراجعة"]);
  }
};

// Delete Report
const deleteReport = async (item) => {
  if (!confirm("هل أنت متأكد من حذف هذا البلاغ؟")) {
    return;
  }
  try {
    const response = await axiosClient.delete(
      `/admin/products/${cleanId(item.product_id)}/report`
    );
    if (response.status === 200) {
      items.value = items.value.filter((i) => i.id !== item.id);
      emitter.emit("showNotificationAlert", ["success", "تم حذف البلاغ بنجاح"]);
    }
  } catch (e) {
    emitter.emit("showNotificationAlert", ["error", "فشلت عملية الحذف"]);
  }
};

onMounted(async () => {
  await fetchReports();
});
</script>
