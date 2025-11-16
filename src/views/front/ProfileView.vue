<script setup>
import {
  ArrowRightIcon,
  Bars3Icon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/outline";
import SidebarItem from "../../components/front/SidebarItem.vue";
import { UserIcon, Cog6ToothIcon } from "@heroicons/vue/24/outline";

import { onBeforeUnmount, onMounted, ref } from "vue";
import { AdjustmentsVerticalIcon } from "@heroicons/vue/24/solid";
import {
  ArrowRightStartOnRectangleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import PersonalSection from "../../components/front/PersonalSection.vue";
import SettingAccount from "../../components/front/SettingAccount.vue";
import FavoriteSetting from "../../components/front/FavoriteSetting.vue";
import PrivacyAndSecurity from "../../components/front/PrivacyAndSecurity.vue";
import PrivacyPolicy from "../../components/front/PrivacyPolicy.vue";
import TermsAndConditions from "../../components/front/TermsAndConditions.vue";
import AboutApp from "../../components/front/AboutApp.vue";
import { useAuthStore } from "../../stores/auth/auth";

const authStore = useAuthStore();
const links = [
  {
    group_name: "الحساب",
    items: [
      { id: "personal_page", label: "الملف الشخصي", icon: UserIcon },
      { id: "setting", label: "الاعدادات", icon: Cog6ToothIcon },
    ],
  },
  {
    group_name: "التخصص و التحكم",
    items: [
      { id: "preferences", label: "التفضيلات", icon: AdjustmentsVerticalIcon },
      {
        id: "privacy-security",
        label: "الخصوصية و الامان",
        icon: ShieldCheckIcon,
      },
    ],
  },
  {
    group_name: "أخرى",
    items: [
      { id: "privacy-policy", label: "سياسة الخصوصية", icon: DocumentTextIcon },
      {
        id: "terms-conditions",
        label: "الشروط و الاحكام",
        icon: DocumentTextIcon,
      },
      { id: "about", label: "حول", icon: InformationCircleIcon },
    ],
  },
];

const activeId = ref("personal_page");

const sectionRefs = ref({});

const setSectionRef = (id) => (el) => {
  if (el) sectionRefs.value[id] = el;
};

let observer = null;
let ignoreObserver = false;
const scrollToSection = ({ id, label }) => {
  ignoreObserver = true;
  sectionRefs.value[id]?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  if (isOpen.value) {
    isOpen.value = false;
  }
  sectionTitle.value = label;
  setTimeout(() => {
    ignoreObserver = false;
  }, 500);
};
const isOpen = ref(false);
const scrollContainer = ref(null);
const sectionTitle = ref("الملف الشخصي");
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (ignoreObserver) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          activeId.value = id;
          const label = getLabelById(id);
          if (label) sectionTitle.value = label;
        }
      });
    },
    { root: scrollContainer.value, threshold: 0.8 }
  );

  Object.values(sectionRefs.value).forEach((el) => observer.observe(el));
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
const getLabelById = (id) => {
  for (const group of links) {
    const item = group.items.find((i) => i.id === id);
    if (item) return item.label;
  }
  return null;
};

</script>

<template>
  <div
    class="header flex items-center justify-between fixed left-0 top-0 right-0 p-4 pt-20 border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-800 z-50">
    <div class="flex items-center gap-5 container">
      <div class="flex items-center gap-2">
        <Bars3Icon class="w-6 h-6 cursor-pointer block lg:hidden text-black dark:text-white"
          @click="isOpen = !isOpen" />
        <ArrowRightIcon class="w-4 h-4 cursor-pointer hidden lg:block text-black dark:text-white"
          @click="$router.push({ name: 'home' })" />
      </div>
      <p class="text-black dark:text-white font-semibold text-[16px] sm:text-[20px]">
        لوحة التحكم - {{ sectionTitle }}
      </p>
    </div>
  </div>

  <div class="flex mt-[127px] h-[calc(100vh - 127px)] overflow-hidden">
    <nav
      class="side-bar w-full lg:w-1/4 border-l top-0 absolute dark:border-gray-700 h-[calc(100vh - 127px)] lg:relative lg:right-0 max-w-[280px] p-4 transition-all lg:max-h-[calc(100vh-127px)] lg:overflow-y-auto lg:overflow-x-hidden duration-[0.4s]"
      :class="{
        'bg-white dark:bg-gray-800 h-screen z-[1000000000] right-0': isOpen,
        '-right-full': !isOpen,
      }">
      <ul class="relative">
        <li v-for="link in links" :key="link.group_name" class="mb-4">
          <p class="group-name text-gray-600 dark:text-gray-300 font-normal text-[14px] mb-3">
            {{ link.group_name }}
          </p>
          <ul>
            <SidebarItem v-for="item in link.items" :key="item.id" :id="item.id" :label="item.label" :class="{
              'text-white bg-back rounded-lg': activeId === item.id,
              'mb-[6px]': true,
              'text-black dark:text-white': activeId !== item.id,
            }" :active-id="activeId" @update:activeId="activeId = $event" @scrollTo="scrollToSection($event)">
              <template #icon>
                <component :is="item.icon" class="h-5 w-5 dark:text-white" :class="{
                  'text-white': activeId === item.id,
                  'text-blue-950': activeId !== item.id,
                }" />
              </template>
            </SidebarItem>
          </ul>
        </li>
        <span class="absolute block w-full h-[2px] rounded bg-gray-300 dark:bg-gray-600"></span>
      </ul>
      <button class="text-white
        w-full
        flex
        items-center
        justify-center
        gap-3
        py-2
        font-medium
        rounded-lg
        text-[14px]
        mt-8
        bg-red-600
        hover:bg-red-700
        dark:hover:saturate-[120%]        
        border-red-600
        ring-1
        ring-red-600
        ring-offset-0
      ring-offset-white
      dark:ring-offset-gray-900
        hover:ring-offset-2
        transition
        duration-200
        " @click="authStore.logout()">
        <ArrowRightStartOnRectangleIcon class="w-5 h-5" />
        <span>تسجيل الخروج</span>
      </button>
    </nav>

    <span class="overlay w-screen h-screen transition-all duration-[0.4s] absolute top-0 left-0 z-[100000000]" :class="{
      'block lg:hidden bg-black bg-opacity-25 dark:bg-white dark:bg-opacity-25':
        isOpen,
      hidden: !isOpen,
    }" @click="isOpen = false" />

    <main class="container mx-auto lg:mr-0 lg:ml-auto max-h-[calc(100vh-127px)] overflow-y-auto scrollbar-hide lg:w-3/4"
      ref="scrollContainer">
      <div class="mt-4" id="personal_page" :ref="setSectionRef('personal_page')">
        <PersonalSection />
      </div>
      <div class="mt-6" id="setting" :ref="setSectionRef('setting')">
        <SettingAccount />
      </div>
      <div class="mt-6" id="preferences" :ref="setSectionRef('preferences')">
        <FavoriteSetting />
      </div>
      <div class="mt-6" id="privacy-security" :ref="setSectionRef('privacy-security')">
        <PrivacyAndSecurity />
      </div>
      <div class="mt-6" id="privacy-policy" :ref="setSectionRef('privacy-policy')">
        <PrivacyPolicy />
      </div>
      <div class="mt-6" id="terms-conditions" :ref="setSectionRef('terms-conditions')">
        <TermsAndConditions />
      </div>
      <div class="my-6" id="about" :ref="setSectionRef('about')">
        <AboutApp />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.side-bar {
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
  direction: rtl;
}
</style>
