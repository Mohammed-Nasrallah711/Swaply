<script setup>
import {
  ChatBubbleOvalLeftIcon,
  CheckBadgeIcon,
  CubeIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { UserIcon } from "@heroicons/vue/24/outline";
import { ArrowsRightLeftIcon, CheckIcon } from "@heroicons/vue/24/solid";
import { MapPinIcon } from "@heroicons/vue/24/outline";
import { ClockIcon } from "@heroicons/vue/24/outline";
import MainButton from "./global/MainButton.vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { StarIcon } from "@heroicons/vue/24/outline";
import { ShieldCheckIcon } from "@heroicons/vue/24/outline";
import { CalendarIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import SecondButton from "./SecondButton.vue";
import useFormats from "../../mixins/formats";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth/auth";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const { getRelativeTime } = useFormats();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}
const isSendRequest = computed(() => {
  return props.item.myResponse ? true : false;
});

const requestStatus = computed(() => {
  const status = props.item.myResponse?.status;
  return status == "accepted"
    ? {
      text: "مقبول",
      parent_style:
        "bg-green-50 border border-green-100 p-4 dark:bg-green-800 dark:border-green-700",
      label_style: "text-green-800 dark:text-white",
      text_style: "text-green-600 dark:text-green-300",
    }
    : status == "rejected"
      ? {
        text: "تم رفضه",
        parent_style:
          "bg-red-50 border border-red-100 p-4 dark:bg-red-800 dark:border-red-700",
        label_style: "text-red-800 dark:text-white",
        text_style: "text-red-600 dark:text-red-300",
      }
      : {
        text: "معلق",
        parent_style:
          "bg-orange-50 border border-orange-100 p-4 dark:bg-orange-800 dark:border-orange-700",
        label_style: "text-orange-800 dark:text-white",
        text_style: "text-orange-600 dark:text-orange-300",
      };
});
</script>

<template>
  <div
    class="single-offer p-4 bg-white dark:bg-gray-900 rounded-[10px] hover:shadow-md dark:shadow-[inset_0_6px_10px_rgba(255,255,255,0.15),0_4px_4px_0_rgba(0,0,0,0.75)] transition relative my-4 last-of-type:mb-0 ">
    <div class="flex items-center justify-between mb-4">
      <div class="info flex items-center gap-2">
        <div class="icon bg-gray-100 dark:bg-gray-700 h-10 w-10 flex items-center justify-center rounded-full">
          <UserIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div class="">
          <span class="font-normal flex items-center">
            <span class="text-lg text-gray-800 dark:text-white font-medium">{{
              item.user.name
            }}</span>
            <span v-if="item.user.is_trusty"
              class=" dark:border-green-600 py-1.5 px-2 bg-green-100/90 dark:bg-green-900/50 rounded-full flex items-center  ml-2 gap-1 w-fit justify-center mr-2">
              <CheckIcon class="w-3 h-3 text-gray-600 dark:text-green-600 hidden" />
              <span class="
              text-xs
              text-green-700
              dark:text-green-500 
               leading-none">موثوق</span>
            </span>
          </span>
          <div class="degree text-gray-400 dark:text-gray-300 text-xs font-normal mt-1">
            درجة الموثوقية: 80%
          </div>
        </div>
      </div>
      <div class="text-white bg-red-600 dark:bg-red-500 rounded-md w-12 h-6 px-7 flex items-center justify-center">
        <span class="font-medium text-[10px] leading-none">عاجل</span>
      </div>
    </div>

    <div class="flex items-center justify-center gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <div class="flex flex-col items-center">
        <span class="font-normal text-[14px] text-gray-500 dark:text-gray-300">يعرض</span>
        <span class="text-teal-700 dark:text-green-400 font-normal">{{
          item.offer_item
        }}</span>
      </div>
      <ArrowsRightLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
      <div class="flex flex-col items-center">
        <span class="font-normal text-[14px] text-gray-500 dark:text-gray-300">يريد</span>
        <span class="text-blue-600 dark:text-blue-300 dark:saturate-200 font-normal">{{
          item.request_item
        }}</span>
      </div>
    </div>
    <div class="text-[14px] text-gray-600 dark:text-gray-300 font-normal mt-4">
      <div class="message">{{ item.description }}</div>
      <div class="location flex items-center justify-between mt-2">
        <div>
          <MapPinIcon class="w-4 h-4 text-gray-600 dark:text-gray-300 inline-block" />
          <span class="inline-block mr-1 text-[12px] text-gray-500 dark:text-gray-400">{{ item.location }}</span>
        </div>
        <span class="time flex items-center gap-1">
          <ClockIcon class="w-4 h-4 text-gray-600 dark:text-gray-300 inline-block" />
          <span class="inline-block mr-1 text-[12px] text-gray-500 dark:text-gray-400">{{
            getRelativeTime(item.created_at) }}</span>
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-2 mt-4">
      <div class="flex items-center gap-2">
        <button @click="toggle"
          class="flex-1 flex items-center justify-center p-2 border rounded-lg text-[14px] transition-all border-gray-300 bg-white text-black hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
          <span class="font-medium">تفاصيل اكثر</span>
          <ChevronDownIcon :class="isOpen ? 'rotate-180 transform' : ''"
            class="w-4 h-4 mr-2 mt-[2px] transition-transform text-black dark:text-white" />
        </button>

        <MainButton v-if="item.user.id != user.id" class="text-[14px] flex-1" label="بدا المحادثة"
          @click="$emit('startChat', item.user)" />
      </div>

      <div v-show="isOpen" class="p-2 text-gray-600 w-full transition-all">
        <div
          class="info-user bg-blue-50 border border-blue-100 p-4 rounded-lg dark:bg-blue-900/20 dark:border-blue-700">
          <div class="flex items-center gap-2 mb-4">
            <UserIcon class="w-4 h-4 text-blue-900 dark:text-blue-400" />
            <span class="font-medium text-blue-900 text-[16px] dark:text-blue-300">
              معلومات المستخدم
            </span>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex items-start sm:items-center flex-col sm:flex-row gap-2 justify-between">
              <div class="flex flex-1 gap-2 items-center">
                <span class="flex items-center gap-1">
                  <span class="icon flex items-center">
                    <StarIcon class="w-4 h-4 inline-block text-amber-600 dark:text-amber-400" />
                  </span>
                  <span class="text-gray-600 text-[14px] font-normal dark:text-gray-400">
                    التقييم:
                  </span>
                </span>
                <span class="value text-black font-normal text-[14px] dark:text-white">
                  <span class="rate ml-1">4.8/5</span>
                  <span class="opration">({{ item.batar_count ?? 0 }} عملية)</span>
                </span>
              </div>
              <div class="flex flex-1">
                <span class="flex items-center gap-1">
                  <span class="icon flex items-center">
                    <CalendarIcon class="w-[14px] h-[14px] text-blue-700 dark:text-blue-400 inline-block" />
                  </span>
                  <span class="text-gray-600 text-[14px] font-normal dark:text-gray-400">
                    عضو
                    {{
                      getRelativeTime(item.user.created_at).replace(
                        "قبل",
                        "منذ"
                      )
                    }}
                  </span>
                </span>
              </div>
            </div>
            <div class="flex items-start sm:items-center flex-col sm:flex-row gap-2 justify-start">
              <div class="flex flex-1 gap-2 items-center">
                <span class="flex items-center gap-1">
                  <span class="icon flex items-center">
                    <ChatBubbleOvalLeftIcon class="w-[14px] h-[14px] text-green-700 dark:text-green-400 inline-block" />
                  </span>
                  <span class="text-gray-600 text-[14px] font-normal dark:text-gray-400">
                    التواصل:
                  </span>
                </span>
                <span class="value text-black font-normal text-[14px] dark:text-white">
                  {{ item.contact_method ?? "-" }}
                </span>
              </div>
              <div class="flex flex-1 gap-2 items-center">
                <span class="flex items-center gap-1">
                  <span class="icon flex items-center">
                    <ShieldCheckIcon class="w-[15px] h-[15px] text-green-700 dark:text-green-400 inline-block" />
                  </span>
                  <span class="text-gray-600 text-[14px] font-normal dark:text-gray-400">
                    درجة الثقة:
                  </span>
                </span>
                <span class="value text-green-700 font-normal text-[14px] dark:text-green-400">
                  87%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="cart-details bg-green-50 border border-green-100 p-4 rounded-lg mt-4 dark:bg-green-900/20 dark:border-green-700">
          <div class="flex items-center gap-2 mb-4">
            <CubeIcon class="w-4 h-4 text-green-900 dark:text-green-400" />
            <span class="font-medium text-green-900 text-[16px] dark:text-green-300">
              تفاصيل السة المعروضة
            </span>
          </div>
          <div>
            <div class="jsutify-between mb-2 flex items-start sm:items-center flex-col sm:flex-row gap-2">
              <div class="flex-1">
                <span class="text-gray-500 text-[14px] font-normal block dark:text-gray-400">الحالة:</span>
                <span class="text-green-700 text-[14px] font-medium block dark:text-green-300">{{ item.offer_status ??
                  "-" }}</span>
              </div>
              <div class="flex-1">
                <span class="text-gray-500 text-[14px] font-normal block dark:text-gray-400">الكمية:</span>
                <span class="text-green-700 text-[14px] font-medium block dark:text-green-300">
                  {{ item.quantity ?? "-" }}</span>
              </div>
            </div>
            <div class="flex items-center jsutify-between mb-2">
              <div class="flex-1">
                <span class="text-gray-500 text-[14px] font-normal block dark:text-gray-400">التوفر:</span>
                <span class="text-green-700 text-[14px] font-medium block dark:text-green-300">{{ item.availability ??
                  "-" }}</span>
              </div>
            </div>
            <div class="flex items-center jsutify-between">
              <div class="flex-1">
                <span class="text-gray-500 text-[14px] font-normal block dark:text-gray-400">تفضيلات التبادل:</span>
                <span class="text-green-700 text-[14px] font-medium block dark:text-green-300">{{
                  item.exchange_preferences ?? "-" }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="cart-details bg-gray-50 border border-gray-100 p-4 rounded-lg mt-4 dark:bg-gray-800 dark:border-gray-700">
          <div class="flex items-center gap-2 mb-3">
            <span class="font-medium text-dark text-[16px] dark:text-white">وصف مفصل</span>
          </div>
          <div class="text-gray-500 text-[14px] font-normal dark:text-gray-300">
            <p>
              {{ item.description }}
            </p>
          </div>
        </div>
        <div
          class="cart-details bg-blue-50 border border-blue-100 p-4 rounded-lg mt-4 dark:bg-blue-800/20 dark:border-blue-700/40"
          v-if="user?.id == item.user_id && item.sentResponses.length">
          <div class="flex items-center gap-2 mb-3">
            <span class="font-medium text-green-800 text-[16px] dark:text-white">المستخدمين المستعدون لقبول عملية
              التبادل</span>
          </div>
          <div class="text-gray-500 text-[14px] font-normal dark:text-gray-300">
            <ul class="mt-4">
              <li class="grid grid-cols-3 mb-3 text-green-700 font-medium">
                <span>اسم المستخدم</span>
                <span>تاريخ ارسال الطلب</span>
                <span class="text-center">الاجراء</span>
              </li>
              <li>
                <ul v-for="response in item.sentResponses" :key="response.id">
                  <li class="grid grid-cols-3 border-b last-of-type:border-none border-b-gray-200 gap-4 mb-2">
                    <span class="">{{ response.user.name }}</span>
                    <span>
                      {{
                        getRelativeTime(response.created_at).replace(
                          "قبل",
                          "منذ"
                        )
                      }}</span>
                    <span class="flex justify-center">
                      <template v-if="!item.accepted_by">
                        <span @click="$emit('acceptUser', response)"
                          class="border-2 border-green-600 text-sm rounded-lg cursor-pointer px-4 py-1 text-green-600 font-normal flex justify-center items-center transition-colors hover:text-white hover:bg-green-600">قبول</span>
                      </template>
                      <template v-else>
                        <span v-if="response.user_id == item.accepted_by"
                          class="border-2 border-green-600 text-sm rounded-full cursor-default px-4 py-1 gap-1 bg-green-600 text-white font-normal flex justify-center items-center">
                          <CheckIcon class="w-[18px]" />
                          <span>تم قبوله</span>
                        </span>
                        <span v-else
                          class="border-2 border-red-600 text-sm rounded-full cursor-default px-4 py-1 gap-1 bg-red-600 text-white font-normal flex justify-center items-center">
                          <XMarkIcon class="w-[18px]" />
                          <span>تم رفضه</span>
                        </span>
                      </template>
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-details border p-4 rounded-lg mt-4" :class="requestStatus.parent_style" v-if="isSendRequest">
          <div class="flex items-center gap-2 mb-3">
            <span class="font-medium text-dark text-[16px]" :class="requestStatus.label_style">حالة طلبك</span>
          </div>
          <div class="text-[14px] font-normal" :class="requestStatus.text_style">
            <p>
              {{ requestStatus.text }}
            </p>
          </div>
        </div>
        <div
          class="cart-details bg-gray-50 border border-gray-100 p-4 rounded-lg mt-4 dark:bg-gray-800 dark:border-gray-700"
          v-if="item.image">
          <div class="flex items-center gap-2 mb-3">
            <span class="font-medium text-dark text-[16px] dark:text-white">الصورة</span>
          </div>
          <div class="text-gray-500 text-[14px] font-normal dark:text-gray-300">
            <img :src="item.image" :alt="item.name" class="max-h-[250px]" />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
          <template v-if="user && user.id !== item.user_id">
            <SecondButton title="رسالة سريعة"
              class="text-black hover:bg-gray-50 dark:text-white hover:text-black dark:hover:text-black border-gray-300"
              @click="$emit('startChat', item.user)">
              <template #icon>
                <ChatBubbleOvalLeftIcon class="w-4 h-4" />
              </template>
            </SecondButton>
            <SecondButton v-if="!isSendRequest" title="إرسال طلب لقبول المبادلة"
              class="text-green-700 dark:text-green-500 hover:bg-green-700 hover:text-white dark:hover:text-white border-green-600"
              @click="$emit('sendAcceptResponse', item)">
              <template #icon>
                <PaperAirplaneIcon class="w-4 h-4" />
              </template>
            </SecondButton>
          </template>
          <template v-else>
            <SecondButton v-if="item.accepted_by" title="تم اكتمام العملية"
              class="text-green-600 hover:bg-green-600 hover:text-white border-green-600"
              @click="$emit('markAsComplete', item.id)">
              <template #icon>
                <CheckBadgeIcon class="w-5 h-5" />
              </template>
            </SecondButton>
            <SecondButton v-else title="تعديل العرض" @click="$emit('edit', item)"
              class="bg-blue-600 hover:bg-blue-500 text-white border-blue-600">
              <template #icon>
                <PencilIcon class="w-4 h-4" />
              </template>
            </SecondButton>
            <SecondButton title="حذف العرض" class="text-white bg-red-600 hover:bg-red-500  border-red-600"
              @click="$emit('delete', item.id)">
              <template #icon>
                <TrashIcon class="w-4 h-4" />
              </template>
            </SecondButton>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
