<script setup>
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "../../stores/product";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "../../stores/category";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const search = ref(null);
const router = useRouter();
const productStore = useProductStore();
const { products } = storeToRefs(productStore);
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const query = ref("");
const filteredItems = computed(() => {
  let productList = Array.isArray(products.value) ? products.value : [];
  let categoryList = Array.isArray(categories.value) ? categories.value : [];
  let combinedList = [];

  if (query.value !== "") {
    const q = query.value.toString().toLowerCase();

    // Filter products
    const filteredProducts = productList.filter((item) => {
      const productName = item.name?.toLowerCase() || "";
      const categoryName = item.category?.name?.toLowerCase() || "";
      return productName.includes(q) || categoryName.includes(q);
    });

    // Filter categories
    const filteredCategories = categoryList.filter((item) => {
      const categoryName = item.name?.toLowerCase() || "";
      return categoryName.includes(q);
    });

    // Add products with type marker
    filteredProducts.forEach(product => {
      combinedList.push({ ...product, _type: 'product' });
    });

    // Add categories with type marker
    filteredCategories.forEach(category => {
      combinedList.push({ ...category, _type: 'category' });
    });
  }

  return combinedList;
});
const searchFor = () => {
  if (!search.value || !search.value.name) return;

  // If it's a category, use the new category search endpoint
  if (search.value._type === 'category') {
    const categoryId = search.value.id;
    router.push({
      name: "search-list-stores",
      query: { 
        for: search.value.name, 
        categoryId: categoryId,
        type: 'category'
      },
    });
  } else if (search.value._type === 'product' || (!search.value._type && search.value.id)) {
    // It's a product (or legacy format without _type)
    router.push({
      name: "search-list-stores",
      query: { for: search.value.name, id: search.value.id, type: 'product' },
    });
  }
};

// Watch for changes when user clicks on a dropdown item
watch(search, (newValue) => {
  // Only trigger if it's an object with name and id properties
  // and not a string (which happens in suggestionClick)
  if (newValue && typeof newValue === 'object' && newValue.name && newValue.id) {
    searchFor();
  }
});

const suggestionClick = (category) => {
  query.value = category.name;
  // Set the category object with type marker so it can be properly handled
  search.value = { ...category, _type: 'category' };
  // Trigger search immediately
  searchFor();
};

onMounted(async () => {
  await categoryStore.fetchAllCategoriesIds();
  await productStore.fetchAllProductsIds();
});
</script>

<template>
  <div class="search mt-6">
    <Combobox v-model="search" @keyup.enter="searchFor">
      <div class="relative mt-1">
        <ComboboxInput
          class="border-blue-200 dark:border-blue-200/30 focus:border-blue-400 py-3 bg-transparent text-gray-900 bg-white dark:text-white rounded-xl  dark:bg-gray-700 block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400 pr-12"
          @change="query = $event.target.value" placeholder="ابحث عن منتج أو فئة... (خبز, أرز, حليب)" />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <ComboboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg">
          <ComboboxOption v-for="item in filteredItems" :key="`${item._type || 'product'}-${item.id}`" :value="item" v-slot="{ active, selected }">
            <li class="
                cursor-pointer 
                select-none 
                py-2 
                px-3 
                transition 
                bg-white 
                dark:bg-gray-800 
                text-gray-900 
                dark:text-gray-200
                data-[active=true]:bg-blue-500 
                data-[active=true]:dark:bg-gray-600 
                data-[active=true]:text-white 
                data-[selected=true]:bg-gray-200 
                data-[selected=true]:dark:bg-blue-700 
                data-[selected=true]:text-gray-600
              " :data-active="active" :data-selected="selected">
              <span class="flex items-center gap-2">
                <span v-if="item._type === 'category'" class="text-xs text-blue-600 dark:text-blue-400 font-medium
                data-[active=true]:text-white
                data-[active=true]:dark:text-white
                "
                :data-active="active" :data-selected="selected"
                >☰</span>
                <span>{{ item.name }}</span>
                <span v-if="item._type === 'category'" class="text-xs text-gray-500 dark:text-gray-400
                data-[active=true]:text-white
                data-[active=true]:dark:text-white
                data-[selected=true]:text-gray-600
                data-[selected=true]:dark:text-gray-600
                "
                :data-active="active" :data-selected="selected"
                >(فئة)</span>
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
    <div class="suggestion flex items-center mt-2">
      <span class="text-[12px] text-gray-600 font-normal mx-4">مقترح:</span>
      <ul class="flex items-center gap-1">
        <li
          class="text-blue-800 bg-blue-200 dark:bg-blue-600/30 dark:text-blue-300 text-[12px] block py-2 px-3 cursor-pointer hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all rounded-lg leading-none"
          v-for="value in categories.slice(0, 4)" :key="value" @click="suggestionClick(value)">
          {{ value.name }}
        </li>
      </ul>
    </div>
  </div>
</template>