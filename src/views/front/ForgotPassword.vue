<script setup>
import { computed, ref, watch } from "vue";
import MainButton from "../../components/front/global/MainButton.vue";
import ButtonTab from "../../components/front/ButtonTab.vue";
import { useRouter } from "vue-router";
import { VueSpinnerIos } from "vue3-spinners";
import BackButton from "../../components/front/global/BackButton.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import ErrorInputText from "../../components/front/global/ErrorInputText.vue";
import { useAuthStore } from "../../stores/auth/auth";
import { storeToRefs } from "pinia";
import { KeyIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const { loading, backErrors, forgotMessage } =
  storeToRefs(authStore);

const props = defineProps({});
const type = ref("text");
const placeholderInput = ref("0 59 123 4567");
const buttonTitle = ref("مرحبا بعودتك");
const router = useRouter();
const isLoginPage = ref(false);
const isPhoneNumber = ref(true);
const using = ref("phone_number");

const baseSchema = {
  emailOrPhone: yup
    .string()
    .required("هذا الحقل مطلوب")
    .test("emailOrPhone", function (value) {
      if (!value) return false;

      const phoneRegex = /^[0-9]{10}$/;

      const isPhone = isPhoneNumber.value;
      const isValid = isPhone
        ? phoneRegex.test(value)
        : yup.string().email().isValidSync(value);

      if (!isValid) {
        return this.createError({
          message: isPhone ? "أدخل رقم هاتف صحيح" : "ادخل بريد إلكتروني صحيح",
        });
      }

      return true;
    }),

};
// Forgot Password Validation Schema
const schema = computed(() => {
  return yup.object(baseSchema);
});
const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema,
  context: { type: type.value },
});

const [emailOrPhone] = defineField("emailOrPhone");

watch(
  isPhoneNumber,
  (newVal) => {
    if (newVal) {
      placeholderInput.value = "0 59 123 4567";
      using.value = "phone_number";
      type.value = "text";
      emailOrPhone.value = "";
    } else {
      placeholderInput.value = "example@gmail.com";
      using.value = "email";
      type.value = "email";
      emailOrPhone.value = "";
    }
    resetForm({
      values: {
        emailOrPhone: "",
      },
      errors: {},
    });

    router.replace({
      name: router.currentRoute.value.name,
      query: { using: using.value },
    });
  },
  {
    immediate: true,
  }
);
watch(
  () => router.currentRoute.value.name,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      resetForm({
        values: {
          emailOrPhone: "",
        },
        errors: {},
      });
    }
    if (newVal == "login") {
      isLoginPage.value = true;
      buttonTitle.value = "مرحبا بعودتك";
      return;
    }
    isLoginPage.value = false;
    buttonTitle.value = "انضمام";
  },
  {
    immediate: true,
  }
);

const onSubmit = handleSubmit(async (values) => {
  const credentials = {};

  if (isPhoneNumber.value) {
    credentials.phone = "+97" + emailOrPhone.value;
  } else {
    credentials.email = emailOrPhone.value;
  }
  await authStore.forgotPassword(credentials);
  if (credentials.phone) {
    localStorage.setItem("resetIdentifier", credentials.phone);
  } else {
    localStorage.setItem("resetIdentifier", credentials.email);
  }
});

const firstError = (field) => {
  return Array.isArray(backErrors.value?.[field])
    ? backErrors.value[field][0]
    : null;
};

</script>

<template>
  <div class="flex items-center justify-center bg-gray-50 dark:bg-gray-800 h-screen">
    <BackButton class="absolute right-6 top-8" />
    <div class="logo flex items-center justify-center pt-6 absolute top-1">
      <img src="/Logo.png" class="w-32 dark:hidden" alt="logo" />
      <img src="/Logo-black.png" class="w-32 hidden dark:block" alt="logo" />
    </div>
    <form @submit.prevent="onSubmit"
      class="bg-white dark:bg-gray-900  shadow-md dark:shadow-lg  dark:shadow-slate-700 rounded-lg px-6 py-10 max-w-[450px] w-[95%]">
      <div class="icon">
        <KeyIcon class="w-28 mx-auto text-blue-600" />
      </div>
      <span class="flex justify-center text-2xl font-medium dark:text-white text-black mt-2 mb-1">استعادة كلمة
        المرور</span>
      <span
        class="flex justify-center text-center text-base font-light text-slate-500 dark:text-slate-300 mt-1 mb-4">ادخل
        البريد الالكتروني أو رقم الهاتف المرتبط بحسابك لاستعادة كلمة
        المرور</span>
      <div
        class="buttons bg-gray-200 dark:bg-gray-700 p-[2px] rounded-full text-[13px] flex items-center gap-x-0.5 mb-4">
        <ButtonTab label="البريد الالكتروني" :is-active="!isPhoneNumber" @click="isPhoneNumber = false"
          class="py-1 rounded-full" />
        <ButtonTab label="الهاتف" :is-active="isPhoneNumber" @click="isPhoneNumber = true" class="py-1 rounded-full" />
      </div>
      <div class="relative" dir="ltr">
        <div class="relative">
          <input :type="type" :placeholder="placeholderInput" v-model="emailOrPhone"
            class="no-spinner focus:border-gray-500 focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400"
            :class="{
              'pl-[35px]': type === 'text',
              'pl-[39px]': emailOrPhone !== '' && type === 'text',
              'border-red-600 text-red-600  focus:border-red-500 dark:text-white focus:ring-red-600 bg-red-100/70 placeholder:text-red-500':
                errors.emailOrPhone ||
                firstError('email') ||
                firstError('phone'),
              'focus:border-gray-500 border-none  dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
                !errors.emailOrPhone &&
                !firstError('email') &&
                !firstError('phone'),
            }" />
          <span v-if="type == 'text'" class="absolute left-2.5 top-1/2 -translate-y-[50%] leading-none" :class="{
            'text-red-500':
              errors.emailOrPhone ||
              firstError('email') ||
              firstError('phone'),
            'mt-[1px] text-[14px] dark:text-gray-400 font-normal text-gray-500':
              emailOrPhone === '',
            'text-black dark:text-white':
              emailOrPhone !== '' &&
              !firstError('email') &&
              !firstError('phone'),
          }">+97</span>
        </div>
        <ErrorInputText :error-message="errors.emailOrPhone || firstError('email') || firstError('phone')
          " />
        <span v-if="forgotMessage" class="text-[14px] font-normal text-green-600">{{ forgotMessage }}</span>
      </div>
      <MainButton type="submit" label="ارسال" class="mt-6 select-none" :style="{ opacity: loading ? 0.8 : 1 }"
        :class="{ 'pointer-events-none': loading }">
        <template #icon>
          <VueSpinnerIos v-if="loading" size="20" class="text-gray-50 ml-2" />
        </template>
      </MainButton>
    </form>
  </div>
</template>
