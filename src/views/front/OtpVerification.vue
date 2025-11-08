<script setup>
import { ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { VueSpinnerIos } from "vue3-spinners";
import MainButton from "../../components/front/global/MainButton.vue";
import BackButton from "../../components/front/global/BackButton.vue";
import { useAuthStore } from "../../stores/auth/auth";
import { storeToRefs } from "pinia";
import { inject } from "vue";

const schema = yup.object({
  otp: yup
    .string()
    .required("الكود مطلوب")
    .length(6, "الكود يجب أن يكون 6 أرقام"),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
});

const [otp, otpAttrs] = defineField("otp");
const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);
const identifier = ref(localStorage.getItem("resetIdentifier"));
const otpError = ref("");
const emitter = inject("emitter");

const onSubmit = handleSubmit(async () => {
  otpError.value = "";
  try {
    await authStore.verifyOtp(identifier.value, otp.value);
  } catch (error) {
    otpError.value = error?.response?.data?.message || "الكود غير صحيح، يرجى المحاولة مرة أخرى";
  }
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
      class="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-600 rounded-lg px-6 py-10 min-w-[250px] w-[30%]">
      <span class="block text-xl font-medium text-blue-600 mt-2 mb-4">
        إدخال رمز التحقق (OTP)
      </span>

      <div class="mb-4">
        <input dir="ltr" v-model="otp" v-bind="otpAttrs" type="text" placeholder="أدخل الكود المكون من 6 أرقام" maxlength="6"
          class="focus:border-gray-500 focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white block w-full text-center text-xl tracking-[1rem] placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400"
          :class="{
            'border-red-600 focus:border-red-500 dark:text-white focus:ring-red-600 bg-red-100/70 placeholder:text-red-500':
              errors.otp || otpError,
            'focus:border-gray-500 border-none dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
              !errors.otp && !otpError,
          }" />
        <span v-if="errors.otp" class="text-red-500 text-sm block mt-1">
          {{ errors.otp }}
        </span>
        <span v-if="otpError && !errors.otp" class="text-red-500 text-sm block mt-1">
          {{ otpError }}
        </span>
      </div>

      <MainButton type="submit" label="تحقق" class="mt-6 select-none w-full" :style="{ opacity: loading ? 0.8 : 1 }"
        :class="{ 'pointer-events-none': loading }">
        <template #icon>
          <VueSpinnerIos v-if="loading" size="20" class="text-gray-50 ml-2" />
        </template>
      </MainButton>
    </form>
  </div>
</template>
