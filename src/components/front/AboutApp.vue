<script setup>
import SecondaryTitle from "./global/SecondaryTitle.vue";
import SingleFavoriteStructure from "./SingleFavoriteStructure.vue";
</script>

<template>
  <SecondaryTitle label="حول التطبيق" class="mb-3" />
  <div class="border rounded-xl p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <div
      class="last-of-type:border-none border-b dark:border-gray-700 last-of-type:p-0 pb-3 mt-4 first-of-type:mt-0 flex items-center">
      <div>
        <span class="text-blue-950 dark:text-white font-bold text-[26px] mb-3 block">نبض الاسعار</span>
        <span class="text-gray-600 dark:text-gray-300 font-medium text-[20px] mb-2 block">الاصدار 1.0.0</span>
      </div>
    </div>

    <SingleFavoriteStructure class="pb-0 border-none -mb-2" title="مهمتنا"
      description="نبض هي منصة مصممة لخدمة المجتمع في أوقات الأزمات من خلال توفير معلومات دقيقة ومحدثة عن أسعار الموارد الأساسية والسلع." />

    <div class="mt-4">
      <span class="text-black dark:text-white font-medium text-[16px] mb-3 block">ميزاتنا</span>
      <span class="text-gray-600 dark:text-gray-300 font-medium text-[14px] mb-2 block">
        <ul class="list-disc pr-4">
          <li class="mb-1">تتبع أسعار المنتجات والمتاجر</li>
          <li class="mb-1">نظام تنبيهات ذكي لانخفاض الاسعار</li>
          <li class="mb-1">منصة مقايضة مجتمعية موثوقة</li>
          <li class="mb-1">محادثات مباشرة للتفاوض</li>
          <li class="mb-1">قائمة مفضلات وعروض خاصة</li>
          <li class="mb-1">البحث بالموقع والتصنيفات</li>
        </ul>
      </span>
    </div>

    <div class="last-of-type:border-none border-b last-of-type:p-0 mt-4 first-of-type:mt-0 flex">
      <div>
        <span class="text-black dark:text-white font-medium text-[16px] mb-3 block">تواصل معنا</span>
        <span class="text-gray-600 dark:text-gray-300 font-medium text-[14px] mb-2 block">
          للدعم و الاستفسارات: support@pricepulse.app
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-ul {
  li {
    position: relative;

    &::after {
      content: ">*";
      right: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
    }
  }
}
</style>
