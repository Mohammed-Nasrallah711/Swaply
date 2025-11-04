<script setup>
import { CheckIcon, StarIcon } from "@heroicons/vue/24/solid";
import MdiIcon from "./MdiIcon.vue";
import { mdiNavigationOutline } from "@mdi/js";
import format from "../../mixins/formats";
import usePrice from "../../mixins/price";
import { useCurrencyStore } from "../../stores/currencyStore";
import { computed, onMounted, ref } from "vue";
import { useCityStore } from "../../stores/city";

const props = defineProps({
  storeName: String,
  isCertified: Boolean,
  price: [Number, String],
  rating: [Number, String],
  cityId: Number,
  lastUpdate: String,
  image: String,
  recentPrices: Array,
  priceRating: String, // Backend price rating
});

const { currencyFormat } = format();
const { calculatePriceRating } = usePrice();
const currencyStore = useCurrencyStore();
const priceUSD = ref(0);
const numericPrice = computed(() => Number(props.price));
const numericRating = computed(() => {
  const rating = Number(props.rating);
  return isNaN(rating) ? 4.0 : rating;
});
const formattedRating = computed(() => {
  return numericRating.value.toFixed(1);
});
const priceType = computed(() => {
  return calculatePriceRating(numericPrice.value, props.recentPrices, props.priceRating);
});
const cityStore = useCityStore();
const distance = computed(() => {
  return cityStore.distanceToSpecificCity(props.cityId);
});
onMounted(async () => {
  priceUSD.value = await currencyStore.convertToUSD(numericPrice.value);
});
</script>

<template>
  <div
    class="flex flex-col-reverse lg:grid lg:grid-cols-3 border border-gray-200 dark:border-gray-700 rounded-xl mt-3 gap-6 overflow-hidden bg-white dark:bg-gray-900">
    <!-- محتوى المتجر -->
    <div class="py-8 px-6 rounded-xl mb-2">
      <div class="flex justify-between items-center font-normal text-[22px] xl:text-[26px]">
        <div class="flex gap-2 items-center font-normal text-[22px] xl:text-[26px]">
          <span class="text-gray-900 dark:text-gray-100">{{ storeName }}</span>
          <span
            class="cursor-default border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 gap-[2px] text-[10px] py-1 pr-1 flex items-center"
            v-if="isCertified">
            <span class="font-medium">معتمد</span>
            <CheckIcon class="w-4 h-4" />
          </span>
        </div>
        <span class="text-gray-900 dark:text-gray-100 font-semibold">{{
          currencyFormat(price, undefined, "ar", "ILS")
        }}</span>
      </div>

      <div class="flex items-center justify-between text-gray-700 dark:text-gray-300 font-normal">
        <span class="flex items-center gap-2 mt-3">
          <span>{{ formattedRating }}</span>
          <StarIcon class="w-5 h-5 text-amber-400" />
        </span>
        <span>{{ priceUSD }}</span>
      </div>

      <div class="flex justify-between flex-col items-start gap-2 mt-3">
        <span class="text-[12px] rounded-lg px-4 py-[6px] cursor-default" :class="priceType.style">
          {{ priceType.rating }}
        </span>

        <div>
          <span class="font-normal text-gray-700 dark:text-gray-200 block mb-1 text-[18px]">المسافة</span>
          <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-normal">
            <span> {{ distance }} كم </span>
            <span>
              <MdiIcon :icon="mdiNavigationOutline" class="text-gray-600 dark:text-gray-300" />
            </span>
          </div>
        </div>
      </div>

      <div class="text-gray-500 dark:text-gray-400 text-[12px] mt-3 font-normal">
        <span>اخر تحديث: </span>
        <span>{{ lastUpdate }}</span>
      </div>
    </div>

    <!-- الصورة أو الخريطة -->
    <div class="col-span-2 bg-gray-100 dark:bg-gray-800">
      <div class="p-0">
        <img :src="image" :alt="storeName + ' صورة'" class="max-h-80 w-full object-cover" />
      </div>
    </div>
  </div>
</template>