<script setup>
import { LockClosedIcon } from "@heroicons/vue/24/outline";
import BackButton from "../../components/front/global/BackButton.vue";
import MainButton from "../../components/front/global/MainButton.vue";
import { VueSpinnerIos } from "vue3-spinners";
import { inject, ref } from "vue";
import { useRoute } from "vue-router";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "../../stores/auth/auth";
import { storeToRefs } from "pinia";

const route = useRoute();
const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const identifier = ref(route.query.identifier || "");
const token = ref(route.query.token || "");

const schema = yup.object({
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
});
const emitter = inject("emitter");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirm_password");

const onSubmit = handleSubmit(async (values) => {
  if (!identifier.value || !token.value) {
    emitter.emit("showNotificationAlert", [
      "success",
      "خطأ: لا يمكن إعادة ضبط كلمة المرور بدون رمز التحقق أو البريد/الهاتف",
    ]);
    return;
  }

  
  const payload = {
    password: password.value,
    password_confirmation: confirmPassword.value,
    token: token.value,
  };

  if (identifier.value.includes("@")) {
    payload.email = identifier.value;
  } else {
    payload.phone = identifier.value;
  }

  await authStore.resetPassword(payload);

});
</script>

<template>
  <div class="flex items-center justify-center bg-gray-50 dark:bg-gray-800 h-screen">
    <BackButton class="absolute right-6 top-8" />

    <div class="logo flex items-center justify-center pt-6 absolute top-1">
      <img src="/Logo.png" class="w-32 dark:hidden" alt="logo" />
      <img src="/Logo-black.png" class="w-32 hidden dark:block" alt="logo" />
    </div>

    <form @submit.prevent="onSubmit"
      class="bg-white dark:bg-gray-900 shadow-md dark:shadow-[inset_0_-4px_10px_rgba(0,0,0,0.01)] dark:shadow-slate-700 rounded-lg px-6 py-10 min-w-[250px] w-[30%]">
      <div class="icon">
        <LockClosedIcon class="w-28 mx-auto text-blue-600" />
      </div>
      <span class="block text-xl font-medium text-blue-600 mt-2 mb-4">
        استعادة كلمة المرور
      </span>

      <div class="mb-4">
        <input v-model="password" v-bind="passwordAttrs" type="password" placeholder="كلمة المرور الجديدة"
          class="focus:border-gray-500 focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400 pl-10"
          :class="{
            'border-red-600 focus:border-red-500 dark:text-white focus:ring-red-600 bg-red-100/70 placeholder:text-red-500':
              errors.password,
            'focus:border-gray-500 border-none dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
              !errors.password,
          }" />
        <span v-if="errors.password" class="text-red-500 text-sm">
          {{ errors.password }}
        </span>
      </div>

      <!-- Confirm Password -->
      <div class="mb-4">
        <input v-model="confirmPassword" v-bind="confirmPasswordAttrs" type="password" placeholder="تأكيد كلمة المرور"
          class="focus:border-gray-500 focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400 pl-10"
          :class="{
            'border-red-600 focus:border-red-500 dark:text-white focus:ring-red-600 bg-red-100/70 placeholder:text-red-500':
              errors.confirm_password,
            'focus:border-gray-500 border-none dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
              !errors.confirm_password,
          }" />
        <span v-if="errors.confirm_password" class="text-red-500 text-sm">
          {{ errors.confirm_password }}
        </span>
      </div>

      <MainButton type="submit" label="ارسال" class="mt-6 select-none w-full" :style="{ opacity: loading ? 0.8 : 1 }"
        :class="{ 'pointer-events-none': loading }">
        <template #icon>
          <VueSpinnerIos v-if="loading" size="20" class="text-gray-50 ml-2" />
        </template>
      </MainButton>
    </form>
  </div>
</template>
