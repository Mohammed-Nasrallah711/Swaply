<script setup>
import MdiIcon from "../MdiIcon.vue";
import FooterColumn from "./FooterColumn.vue";
import {
  mdiFacebook,
  mdiInstagram,
  mdiTwitter,
  mdiYoutube,
} from "@mdi/js";

const langs = [
  { id: 1, name: "العربية", value: "ar" },
  { id: 2, name: "english", value: "en" },
];

const columnsData = [
  {
    groupTitle: "روابط سريعة",
    items: [
      { text: "الصفحة الرئيسية" },
      { text: "الاسعار" },
      { text: "التنبيهات" },
      { text: "العروض" },
      { text: "الملف الشخصي" },
    ],
  },
  {
    groupTitle: "معلومات تقنية",
    items: [
      { text: "حالة النظام" },
      { text: "المطورين" },
      { text: "التحديثات" },
    ],
  },
  {
    groupTitle: "اخرى",
    items: [
      { text: "حول المنصة" },
      { text: "سياسة الخصوصية" },
      { text: "شروط الاستخدام" },
      { text: "تواصل معنا" },
    ],
  },
];
</script>
<template>
  <footer class="container grid grid-cols-2 sm:grid-cols-4 text-center sm:text-start gap-3 px-6 py-12">
    <div>
      <div class="logo flex-1 flex justify-center sm:justify-start items-center">
        <img src="/Logo.png" class="w-28 block dark:hidden" alt="logo" />
        <img src="/Logo-black.png" class="w-28 hidden dark:block" alt="logo" />
      </div>

      <!-- Social icons -->
      <div class="icons flex gap-2 mt-4 justify-center sm:justify-start">
        <a href="http://x.com" target="_blank" class="transition-all hover:rotate-[360deg]">
          <MdiIcon class="text-gray-800 dark:text-gray-300" :icon="mdiTwitter" />
        </a>
        <a href="http://facebook.com" target="_blank" class="transition-all hover:rotate-[360deg]">
          <MdiIcon class="text-gray-800 dark:text-gray-300" :icon="mdiFacebook" />
        </a>
        <a href="http://youtube.com" target="_blank" class="transition-all hover:rotate-[360deg]">
          <MdiIcon class="text-gray-800 dark:text-gray-300" :icon="mdiYoutube" />
        </a>
        <a href="http://instagram.com" target="_blank" class="transition-all hover:rotate-[360deg]">
          <MdiIcon class="text-gray-800 dark:text-gray-300" :icon="mdiInstagram" />
        </a>
      </div>
    </div>

    <!-- Footer columns -->
    <template v-for="column in columnsData" :key="column">
      <FooterColumn :data="column" class="dark:text-gray-200" />
    </template>
  </footer>
</template>