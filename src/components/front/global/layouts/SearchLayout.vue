<script setup>
import { FunnelIcon, MapPinIcon } from "@heroicons/vue/24/outline";
import { useRoute, useRouter } from "vue-router";
import ButtonTab from "../../ButtonTab.vue";
import { computed, onMounted, ref, watch } from "vue";
import { ListBulletIcon } from "@heroicons/vue/24/solid";
import SelectListBox from "../SelectListBox.vue";
import HeaderPage from "../HeaderPage.vue";
import LogoSection from "../LogoSection.vue";
import { useSearchStore } from "../../../../stores/search";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "../../../../stores/category";

const isListStorePage = ref(false);
const router = useRouter();
const route = useRoute();
const search = ref("");
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const searchStore = useSearchStore();
const { current_page, stores, loading } = storeToRefs(searchStore);

watch(
  () => router.currentRoute.value.name,
  (newVal) => {
    if (newVal == "search-list-stores") {
      isListStorePage.value = true;
    } else {
      isListStorePage.value = false;
    }
  }
);

const priceOptions = [
  { id: 1, name: "حسب السعر", value: "price" },
  { id: 2, name: "حسب المسافة", value: "distance" },
  { id: 3, name: "حسب التقييم", value: "rating" },
];
const dependentPrice = ref({ id: 1, name: "حسب السعر", value: "ar" });

const categoriesOptions = computed(() => {
  const allCategories = categories.value.map((cat) => {
    return { id: cat.id, name: cat.name, value: cat.id };
  });
  return [{ id: 1, name: "جميع الفئات", value: "all" }, ...allCategories];
});
const dependentCategories = ref({ id: 1, name: "جميع الفئات", value: "all" });


const searchFor = async () => {
  const query = {
    dependent: dependentPrice.value.name,
    categories: dependentCategories.value.name,
  };
  
  const filter = JSON.stringify({
    category: dependentCategories.value.value,
    dependent: dependentPrice.value.value,
  });

  // Check if this is a category search or product search
  if (route.query.type === 'category' && route.query.categoryId) {
    await searchStore.fetchAllStoresByCategory(
      route.query.categoryId,
      current_page.value,
      filter
    );
  } else if (route.query.id) {
    await searchStore.fetchAllStoresHasProdcut(
      route.query.id,
      current_page.value,
      filter
    );
  }
  
  router.replace({
    name: router.currentRoute.value.name,
    query: { ...route.query, ...query },
  });

};

onMounted(() => {
  search.value = route.query.for;
  if (route.name == "search-list-stores") {
    isListStorePage.value = true;
  } else {
    isListStorePage.value = false;
  }
  const query = {};
  const dependent = priceOptions.find((el) => el.name == route.query.dependent);
  if (dependent) {
    dependentPrice.value = dependent;
  }
  const categories = categoriesOptions.value.find(
    (el) => el.name == route.query.categories
  );
  if (categories) {
    dependentCategories.value = categories;
  }
});

onMounted(async () => {
  // Check if this is a category search or product search
  if (route.query.type === 'category' && route.query.categoryId && route.query.for) {
    await searchStore.fetchAllStoresByCategory(route.query.categoryId);
  } else if (route.query.id && route.query.for) {
    await searchStore.fetchAllStoresHasProdcut(route.query.id);
  }
  await categoryStore.fetchAllCategoriesIds();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-800">
    <HeaderPage>
      <LogoSection />
    </HeaderPage>
    <!-- العنوان -->
    <div class="flex items-center gap-2 text-[24px] text-gray-700 dark:text-white font-medium mt-16">
      <span>نتائج البحث:</span>
      <span>{{ search }}</span>
    </div>

    <!-- الفلاتر -->
    <div class="filter flex items-center gap-2 my-4">
    <SelectListBox v-model="dependentPrice" :options="priceOptions" />
    <div
      class="border search-button rounded-lg py-[6px] relative px-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
      @click="searchFor()">
      <FunnelIcon class="w-6" />
      <span
        class="absolute -top-7 left-1/2 hidden -translate-x-1/2 bg-gray-500/50 text-[12px] px-2 py-1 font-medium rounded-md text-white transition-all">
        بحث
      </span>
    </div>
  </div>

  <!-- أزرار العرض -->
  <div class="buttons bg-gray-200 dark:bg-gray-700 p-[2px] rounded-full text-[16px] flex items-center gap-1 mb-4">
    <ButtonTab label="قائمة" :is-active="isListStorePage" @click="
      router.replace({
        name: 'search-list-stores',
        query: route.query,
      })
      " class="py-2 rounded-full" :icon="ListBulletIcon" />
    <ButtonTab label="خريطة" :is-active="!isListStorePage" @click="
      router.replace({
        name: 'search-map',
        query: route.query,
      })
      " class="py-2 rounded-full" :icon="MapPinIcon" />
  </div>

    <!-- المحتوى -->
    <main>
      <slot />
      
      <!-- Empty State -->
      <div 
        v-if="!loading && stores.length === 0" 
        class="flex flex-col justify-center items-center h-64 text-center px-4">
        <div class="mb-4">
          <svg 
            class="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="1.5" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
          لم نجد نتائج لبحثك
        </h3>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
          لا توجد متاجر تبيع "{{ search }}" في الوقت الحالي
        </p>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.search-button {
  &:hover {
    span {
      display: block;
    }
  }
}
</style>
