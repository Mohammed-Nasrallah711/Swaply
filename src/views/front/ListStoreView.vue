<script setup>
import SingleStoreBox from "../../components/front/SingleStoreBox.vue";
import { useSearchStore } from "../../stores/search";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import useFormats from "../../mixins/formats";
import { useRoute } from "vue-router";

const { timeAgo } = useFormats();
const searchStore = useSearchStore();
const { stores, current_page, last_page, loading, errors } =
  storeToRefs(searchStore);


const route = useRoute();

const loadMoreTrigger = ref(null);

const fetchNextPage = async () => {
  if (current_page.value >= last_page.value || loading.value) return;
  await searchStore.fetchAllStoresHasProdcut(
    route.query.id,
    current_page.value + 1,
    {}
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

  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value);
});
</script>

<template>
  <div class="sm:grid gap-2 sm:grid-cols-2 lg:block pb-6">
    <template v-for="store in stores" :key="store.id">
      <template v-for="product in store.products" :key="product.id">
        <SingleStoreBox :price="product.price" :store-name="store.name" :last-update="timeAgo(product.updated_at)"
          :is-certified="true" :rating="store.rating || 0.0" :city-id="+store.city_id" :recent-prices="product.recent_prices"
          :image="store.image" :price-rating="store.price_rating" />
      </template>
    </template>
    <div ref="loadMoreTrigger" class="w-full h-1"></div>
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