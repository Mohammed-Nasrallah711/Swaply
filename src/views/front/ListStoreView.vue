<script setup>
import SingleStoreBox from "../../components/front/SingleStoreBox.vue";
import { useSearchStore } from "../../stores/search";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import useFormats from "../../mixins/formats";
import { useRoute } from "vue-router";

const { timeAgo } = useFormats();
const searchStore = useSearchStore();
const { stores, current_page, last_page, loading, errors } =
  storeToRefs(searchStore);


const route = useRoute();

const loadMoreTrigger = ref(null);

// Flatten all products across stores and sort by numeric price ascending
const entriesSorted = computed(() => {
  const normalize = (v) => {
    if (v === null || v === undefined) return Number.POSITIVE_INFINITY;
    if (typeof v === "number") return v;
    const s = String(v);
    const sanitized = s.replace(/[^\d.]+/g, "");
    const n = Number.parseFloat(sanitized);
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
  };
  const list = [];
  (stores.value || []).forEach((store) => {
    (store.products || []).forEach((product) => {
      list.push({
        store,
        product,
        key: `${store.id}-${product.id}`,
        numericPrice: normalize(product?.price),
      });
    });
  });
  list.sort((a, b) => a.numericPrice - b.numericPrice);
  return list;
});

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
    <template v-for="entry in entriesSorted" :key="entry.key">
      <SingleStoreBox
        :price="entry.product.price"
        :store-name="entry.store.name"
        :last-update="timeAgo(entry.product.updated_at)"
        :is-certified="true"
        :rating="entry.store.rating || 0.0"
        :city-id="+entry.store.city_id"
        :recent-prices="entry.product.recent_prices"
        :image="entry.store.image"
        :price-rating="entry.store.price_rating"
        :product-name="entry.product.name"
        :product-category="entry.product.category?.name"
        :is-category-search="route.query.type === 'category'"
      />
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