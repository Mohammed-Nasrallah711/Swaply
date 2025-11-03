<script setup>
import {
  ArrowsRightLeftIcon,
  BuildingStorefrontIcon,
  ExclamationCircleIcon,
  IdentificationIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/solid";
import { useRouter } from "vue-router";

const router = useRouter();

const data = [
  {
    icon: ExclamationCircleIcon,
    title: "التنبيهات الطارئة",
    text: "اشترك لنرسل لك أسعار السلع عند انخفاضها عبر الرسائل النصية, حتى دون انترنت.",
  },
  {
    icon: BuildingStorefrontIcon,
    title: "قائمتك الخاصة",
    text: "حفظ متاجر مفضلة و تتبع اسعارها و عروضها",
  },
  {
    icon: IdentificationIcon,
    title: "هوية امنة",
    text: "بناء سمعة موثوقة للابلاغ عن الاسعار. تسجيلك يزيد مصداقيتك",
  },
  {
    icon: ArrowsRightLeftIcon,
    title: "مقايضة موثوقة",
    text: "قم بعرض مقايضات مع جيرانك بعد التحقق من الهوية",
  },
  {
    type: "button",
    title: "سجل الان - مجانا",
  },
  {
    icon: ShieldCheckIcon,
    title: "تواصل امن",
    text: "تواصل مباشرة مع متاجر قريبة موثوقة",
  },
];
</script>


<template>
  <div class="container mx-auto">
    <div class="bg-sky-100 dark:bg-blue-300/20 px-8 py-12 rounded-3xl">
      <h4 class="title text-gray-950 dark:text-gray-200 font-normal text-center text-[26px] mb-12">
        سجل الدخول للحصول على مزايا متقدمة
      </h4>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div class="box flex flex-col items-center text-center box" v-for="item in data" :key="item.title" :class="{
          'row-start-4 col-start-1 col-end-3 sm:row-start-auto sm:col-start-auto sm:col-end-auto':
            !item.icon,
        }">
          <template v-if="item.icon">
            <component :is="item.icon" class="w-16 h-16 text-gray-700 dark:text-gray-300" />
            <p class="title text-gray-700 dark:text-gray-200 font-medium text-[18px] my-2">
              {{ item.title }}
            </p>
            <p class="text text-[14px] text-gray-600 dark:text-gray-400">
              {{ item.text }}
            </p>
          </template>

          <template v-else>
            <div class="join-now flex justify-center items-center h-full" @click="router.push({ name: 'login' })">
              <button class="
                  border
                  rounded-lg
                  px-7
                  py-[10px]
                  font-normal
                  transition-all
                text-white
                  ring-1
                border-blue-500
                dark:border-blue-500
                bg-blue-500
                ring-blue-500
                  ring-offset-0
                  ring-offset-[#e0f2fe]
                  dark:ring-offset-[#36485f]
                  duration-200
                  hover:ring-offset-2
                ">
                {{ item.title }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box:nth-child(2) {
  position: relative;

  &::after {
    content: "";
    left: 0;
    height: 140%;
    width: 2px;
    position: absolute;
    top: 0;
    background: #a7a4beb0;
  }

  &::before {
    content: "";
    right: 0;
    height: 140%;
    width: 2px;
    position: absolute;
    top: 0;
    background: #a7a4beb0;
  }

  @media (max-width: 1025px) {

    &::before,
    &::after {
      display: none;
    }
  }
}
</style>600