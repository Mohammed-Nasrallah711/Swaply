<script setup>
import StoreBox from "../../components/front/StoreBox.vue";
import GazaMap from "../../components/front/global/GazaMap.vue";
import { computed, onMounted, ref } from "vue";
import { useSearchStore } from "../../stores/search";
import { storeToRefs } from "pinia";
import useFormats from "../../mixins/formats";

const { timeAgo } = useFormats();
const searchStore = useSearchStore();
const { stores, current_page, last_page, loading, errors } =
  storeToRefs(searchStore);
const cities = computed(() => {
  const allCities = stores.value.map((store) => {
    return store.city?.name;
  });
  return [...new Set(allCities)];
});

const loadMoreTrigger = ref(null);

const fetchNextPage = async () => {
  if (current_page.value >= last_page.value) return;
  await searchStore.fetchAllStoresHasProdcut(
    route.query.id,
    current_page.value + 1,
    JSON.stringify({
      category: dependentCategories.value.value,
      dependent: dependentPrice.value.value,
    })
  );
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      });
    },
    { root: null, rootMargin: "0px", threshold: 1.0 }
  );

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
});
</script>

<template>
  <div class="flex flex-col-reverse lg:grid lg:gap-5 lg:grid-cols-3 lg:max-h-screen lg:overflow-scroll scrollbar-hide">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 lg:block lg:mt-0">
      <template v-for="store in stores" :key="store.id">
        <template v-for="product in store.products" :key="product.id">
          <StoreBox :price="product.price" :store-name="store.name" :last-update="timeAgo(product.updated_at)"
            :is-certified="true" :city-id="store.city_id" :recent-prices="product.recent_prices" 
            :price-rating="store.price_rating" :rating="store.rating || 0.0" />
        </template>
      </template>
      <div ref="loadMoreTrigger" class="w-full h-1"></div>
    </div>
    <div v-if="stores.length > 0" class="col-span-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
      <GazaMap :cities="cities" />
    </div>
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
</style>