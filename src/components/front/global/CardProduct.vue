<script setup>
import {
  ClockIcon,
  FireIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/vue/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/vue/24/solid";
import format from "../../../mixins/formats";
import { computed, inject, watch } from "vue";
import axiosClient from "../../../axiosClient";

const { currencyFormat, calculatePriceAfterOffer } = format();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  offer: {
    type: Object,
    default: null,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});
const emitter = inject("emitter");
const emit = defineEmits(["update:isFavorite"]);
const isFavorite = computed({
  get: () => props.isFavorite,
  set: (value) => emit("update:isFavorite", value),
});

watch(isFavorite, (newVal) => {
  if (newVal) {
    emitter.emit("showNotificationAlert", [
      "success",
      "تم اضافة المنتج إلى المفضلة!",
    ]);
  } else {
    emitter.emit("showNotificationAlert", [
      "error",
      "تم حذف المنتج من المفضلة!",
    ]);
  }
});

const addToFavorite = async () => {
  try {
    const response = await axiosClient.post(`/favorites/${props.id}`);
    if (response.status == 201) {
      isFavorite.value = true;
    }
  } catch (e) {
  }
};
const removeFromFavorite = async () => {
  try {
    const response = await axiosClient.delete(`/favorites/${props.id}`);
    if (response.status == 200) {
      isFavorite.value = false;
    }
  } catch (e) {
  }
};
</script>

<template>
  <div class="border
      rounded-[18px]
      h-[22rem]
      text-gray-700
      dark:text-gray-200
      overflow-hidden
      z-[100000000000000000]
      cursor-pointer
      transition-all
      duration-300
      hover:-translate-y-4
      bg-white
      dark:bg-gray-700
      hover:shadow-lg
      hover:shadow-blue-200/60
      dark:hover:shadow-lg
      dark:hover:shadow-blue-400/20
      dark:border-gray-700">
    <!-- Image container -->
    <div
      class="bg-[radial-gradient(circle,_#d1d5dbb3,_#9ca3af)] dark:bg-[radial-gradient(circle,_#1f293780,_#111827)] relative group ">
      <img :src="image" class="w-full aspect-[4/3] object-contain" alt="product image" />
      <StarSolidIcon @click.stop="isFavorite = false"
        class="w-6 absolute top-3 -right-20 transition-all duration-300 group-hover:right-3 text-yellow-300 hover:text-yellow-400 dark:text-yellow-400 dark:hover:text-yellow-500"
        v-if="isFavorite" @click="removeFromFavorite" />

      <StarIcon @click.stop="isFavorite = true"
        class="w-6 absolute top-3 -right-20 transition-all duration-300 group-hover:right-3 text-yellow-400 hover:text-yellow-500 dark:text-gray-300 dark:hover:text-gray-200"
        @click="addToFavorite" v-else />
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="flex items-center gap-4 font-normal mb-1 text-[18px]">
        <span class="title flex-1">{{ name }}</span>
        <span class="price">{{
          currencyFormat(
            calculatePriceAfterOffer({ price: price, offer: offer }),
            undefined,
            "ar",
            "ILS"
          )
        }}</span>
      </div>

      <div class="flex items-center justify-between">
        <p
          class="description mb-1 text-nowrap w-full overflow-hidden text-ellipsis text-gray-500 dark:text-gray-300/90 text-[14px]">
          {{ description }}
        </p>
        <span class="line-through" v-if="offer">
          {{ currencyFormat(price, undefined, "ar", "ILS") }}
        </span>
      </div>

      <div class="store-name flex items-center gap-1 mb-1">
        <MapPinIcon class="w-[12px] h-[12px]" />
        <span class="text-[12px] font-normal dark:text-gray-300">{{
          storeName
        }}</span>
      </div>

      <div class="time flex items-center justify-between">
        <div class="time flex items-center gap-1">
          <ClockIcon class="w-[12px] h-[12px]" />
          <span class="text-[12px] dark:text-gray-300">{{ time }}</span>
        </div>
        <FireIcon class="w-5 text-orange-600 dark:text-amber-500" v-if="offer" />
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>