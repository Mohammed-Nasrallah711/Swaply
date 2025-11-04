<template>
  <HeaderPage title="المستخدمون" :is-has-add-button="false" />

  <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
    <div class="space-y-4">
      <div class="grid grid-cols-7 gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div v-for="i in 7" :key="i" class="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div v-for="i in 8" :key="i" class="grid grid-cols-7 gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
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

  <GenericDataTable v-else :headers="headers" :items="items">
    <template #actions="item">
      <div class="flex gap-2 justify-center">
        <button @click="openEditModal(item.item)" class="bg-blue-600 text-white px-3 py-1 rounded">
          تعديل
        </button>
        <button @click="deleteUser(item.item)" class="bg-red-600 text-white px-3 py-1 rounded">
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

  <EditUserDialog v-model="showDialog" v-model:userRole="user.role" :user="user" v-model:userStatus="user.status"
    @fetchUsers="fetchUsers" />

  <ConfirmDeleteDialog v-model="showDeleteDialog" :message="confirmMessage" @confirm="ConfirmDelete" />
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import HeaderPage from "../../components/dashboard/global/HeaderPage.vue";
import GenericDataTable from "../../components/dashboard/global/GenericDataTable.vue";
import EditUserDialog from "../../components/dashboard/EditUserDialog.vue";
import ConfirmDeleteDialog from "../../components/dashboard/global/ConfirmDeleteDialog.vue";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/vue/24/outline";
import axiosClient from "../../axiosClient";
import format from "../../mixins/formats";

const headers = [
  { text: "رقم المستخدم", value: "id", sortable: true },
  { text: "اسم المستخدم", value: "name", sortable: true },
  { text: "البريد الإلكتروني", value: "email", sortable: true },
  { text: "رقم الهاتف", value: "phone", sortable: true },
  { text: "الدور", value: "role", sortable: true },
  { text: "الحالة", value: "status", sortable: true },
  { text: "إجراءات", value: "actions" },
];

const translateRole = (role) => {
  switch (role) {
    case "admin":
      return "مدير";
    case "merchant":
      return "تاجر";
    case "customer":
      return "مستهلك";
    default:
      return "غير معروف";
  }
};

const translateStatus = (status) => {
  switch (status) {
    case "active":
      return "نشط";
    case "inactive":
      return "غير نشط";
    case "pending":
      return "معلق";
    default:
      return "غير معروف";
  }
};

const items = ref([]);
const loading = ref(true);

const users = ref({});
const { formatDate, cleanId } = format();

const mode = ref("create");
const user = ref({});
const showDialog = ref(false);

const openDialog = (type, usr = {}) => {
  mode.value = type;
  user.value = usr;
  showDialog.value = true;
};

const openEditModal = (usr) => {
  const selectedUsr = users.value.filter((ele) => ele.id == cleanId(usr.id))[0];
  openDialog("edit", selectedUsr);
};

// حذف المستخدم
const showDeleteDialog = ref(false);
const confirmMessage = ref("");
const selectedUser = reactive({});
const emitter = inject("emitter");
// Delete User
const deleteUser = ({ id, name = "" }) => {
  confirmMessage.value = `هل أنت متأكد من رغبتك بحذف المستخدم "${name}"؟`;
  selectedUser.username = name;
  selectedUser.userId = id;
  showDeleteDialog.value = true;
};
// Confirm Delete
const ConfirmDelete = async () => {
  const response = await axiosClient.delete(
    `admin/users/${cleanId(selectedUser.userId)}`
  );
  if (response.status == 200) {
    users.value = users.value.filter((u) => u.userId !== selectedUser.userId);
    emitter.emit("showNotificationAlert", [
      "success",
      "تم حذف المستخدم بنجاح!",
    ]);
  }
};
// Fetch Users
const fetchUsers = async () => {
  loading.value = true;
  try {
    await axiosClient.get("/admin/users").then((response) => {
      users.value = response.data.data;
      items.value = response.data.data.map((ele) => {
        return {
          id: `# ${ele.id}`,
          name: ele.name,
          email: ele.email ?? "غير مسجل",
          phone: ele.phone ? `\u2066${ele.phone}\u2069` : "غير مسجل",
          role: translateRole(ele.role),
          status: translateStatus(ele.status),
          created_at: formatDate(ele.created_at),
        };
      });
    });
  } catch (e) {
  } finally {
    loading.value = false;
  }
};
onMounted(async () => {
  await fetchUsers();
});
</script>
