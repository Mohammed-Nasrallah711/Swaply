<!-- views/dashboard/CategoryView.vue -->
<template>
  <HeaderPage title="التصنيفات" ButtonLabel="اضافة تصنيف جديد" @button-add-click="openDialog('create')" />

  <div class="mb-4">
    <input
    name="category-search"
    v-model="searchQuery" type="text" placeholder="ابحث عن تصنيف..." class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none
      dark:bg-gray-700 dark:border-gray-600 dark:text-white
      placeholder:text-gray-600/60 dark:placeholder-gray-400
      " />
  </div>

  <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
    <div class="space-y-4">
      <div class="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div v-for="i in 4" :key="i" class="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div v-for="i in 8" :key="i" class="grid grid-cols-4 gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="flex gap-2 justify-center">
          <div class="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>

  <GenericDataTable v-else :headers="headers" :items="filteredItems">
    <template #id="{ item }">
      <span># {{ item.id }}</span>
    </template>
    <template #actions="item">
      <div class="flex gap-2 justify-center">
        <button @click="openEditModal(item.item)" class="bg-blue-600 text-white px-3 py-1 rounded">
          تعديل
        </button>
        <button @click="deleteCategory(item.item)" class="bg-red-600 text-white px-3 py-1 rounded">
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

  <AddOrEditCategoryDialog v-model="showDialog" :mode="mode" v-model:category="category"
    @fetch-categories="fetchCategories" />
  <ConfirmDeleteDialog v-model="showDeleteDialog" :message="confirmMessage" @confirm="ConfirmDelete" />
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from "vue";
import HeaderPage from "../../components/dashboard/global/HeaderPage.vue";
import AddOrEditCategoryDialog from "../../components/dashboard/AddOrEditCategoryDialog.vue";
import ConfirmDeleteDialog from "../../components/dashboard/global/ConfirmDeleteDialog.vue";
import GenericDataTable from "../../components/dashboard/global/GenericDataTable.vue";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/vue/24/outline";
import axiosClient from "../../axiosClient";
import format from "../../mixins/formats";

const headers = [
  { text: "رقم التصنيف", value: "id", sortable: true },
  { text: "اسم التصنيف", value: "name", sortable: true },
  { text: "تاريخ الإضافة", value: "created_at", sortable: true },
  { text: "إجراءات", value: "actions" },
];

const items = ref([]);
const searchQuery = ref("");
const loading = ref(true);

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const { formatDate, cleanId } = format();
const mode = ref("create");
const category = ref({});
const showDialog = ref(false);
const showDeleteDialog = ref(false);
const confirmMessage = ref("");
const selectedCategory = reactive({});
const emitter = inject("emitter");

const deleteCategory = ({ id, name = "" }) => {
  confirmMessage.value = `هل أنت متأكد من رغبتك بحذف التصنيف "${name}"؟`;
  selectedCategory.name = name;
  selectedCategory.id = id;
  showDeleteDialog.value = true;
};

const ConfirmDelete = async () => {
  const response = await axiosClient.delete(
    `admin/categories/${cleanId(selectedCategory.id)}`
  );
  if (response.status == 200) {
    items.value = items.value.filter((i) => i.id !== selectedCategory.id);
    emitter.emit("showNotificationAlert", ["success", "تم حذف التصنيف بنجاح!"]);
  }
};

const openDialog = (type, cat = {}) => {
  mode.value = type;
  category.value = cat;
  showDialog.value = true;
};

const openEditModal = (cat) => {
  const selectedCat = items.value.filter(
    (ele) => ele.id == cleanId(cat.id)
  )[0];
  openDialog("edit", selectedCat);
};

const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await axiosClient.get("/admin/categories");
    items.value = response.data.categories.map((ele) => ({
      id: ele.id,
      name: ele.name,
      description: ele.description,
      created_at: formatDate(ele.created_at),
    }));
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCategories();
});
</script>
