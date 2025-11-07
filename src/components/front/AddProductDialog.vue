<template>
  <TransitionRoot :show="modelValue" as="template">
    <Dialog @close="closeDialog" class="relative z-[1000000000]">
      <!-- Overlay with transition -->
      <TransitionChild as="template" enter="ease-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild as="template" enter="ease-out duration-200" enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95">
          <DialogPanel
            class="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto relative">
            <button type="button" tabindex="0" class="sr-only">focus</button>
            <DialogTitle class="pt-6 mb-3">
              <h3 class="title font-medium text-[20px] text-black dark:text-white">
                {{ isEditPage ? "تعديل المنتج" : "إضافة منتج" }}
              </h3>
              <p class="subtitle font-normal text-gray-600 mt-1 text-[14px] dark:text-gray-300">
                {{
                  isEditPage
                    ? "قم بتعديل بيانات المنتج "
                    : "أضف منتج جديد إلى مجموعة منتجاتك"
                }}
              </p>
            </DialogTitle>
            <form @submit.prevent="submit">
              <ComboboxComponent v-model="selectedProduct" :items="availableProducts" placeholder="مثال: حليب" />
              <ErrorInputText :error-message="(nameMeta.touched || submitCount > 0) ? nameError : ''" />

              <!-- category (disabled auto) -->
              <FormControl label="التصنيف" id="category" :value="categoryForProductSelected" disabled />

              <FormControl label="سعر المنتج" type="number" id="product-price" class="bg-transparent" :value="price"
                @input="price = $event.target.valueAsNumber" placeholder="100" />

              <ErrorInputText :error-message="(priceMeta.touched || submitCount > 0) ? priceError : ''" />

              <!-- description -->
              <FormControl label="الوصف" id="الوصف" :value="description" @input="description = $event.target.value"
                class="bg-transparent" placeholder="تفاصيل اضافية عن المنتج" type="textarea" />
              <ErrorInputText :error-message="(descriptionMeta.touched || submitCount > 0) ? descriptionError : ''" />

              <!-- image -->
              <div class="mb-3">
                <label for="file_image"
                  class="flex items-center gap-2 cursor-pointer justify-center border border-gray-300 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:border-gray-500 active:ring-gray-500 rounded-md">
                  <CameraIcon class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span class="font-normal dark:text-white">{{
                    imagePreview ? "تعديل الصورة" : "اضافة صورة"
                    }}</span>
                </label>
                <input type="file" id="file_image" hidden @change="onFileChange" />
                <div v-if="imagePreview" class="mt-2">
                  <img :src="imagePreview"
                    class="w-32 h-32 object-contain rounded-md bg-gray-100 dark:bg-gray-700 p-1" />
                </div>
                <ErrorInputText :error-message="(imageMeta.touched || submitCount > 0) ? imageError : ''" />
              </div>

              <MainButton :label="isEditPage ? 'تعديل المنتج' : 'نشر المنتج'" class="bg-blue-700 hover:bg-blue-500"
                type="submit" />
            </form>
            <!-- زر الاغلاق -->
            <div class="absolute top-[20px] right-[20px]">
              <span
                class="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-all cursor-pointer">
                <XMarkIcon class="h-5 w-5 stroke-[4px]" @click="closeDialog()" />
              </span>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  ref,
  computed,
  inject,
  watch,
  nextTick,
} from "vue";
import { XMarkIcon, CameraIcon } from "@heroicons/vue/24/outline";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import FormControl from "./global/FormControl.vue";
import MainButton from "./global/MainButton.vue";
import ComboboxComponent from "../dashboard/global/ComboboxComponent.vue";
import ErrorInputText from "./global/ErrorInputText.vue";
import { useProductStore } from "../../stores/product";
import { storeToRefs } from "pinia";
import axiosClient from "../../axiosClient";

// validation
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  modelValue: { type: [Boolean, Object], required: true },
  productsIds: { type: Array, default: [] },
  productEdit: { type: Object, default: null },
});
const emit = defineEmits(["update:modelValue", "fetchProducts"]);
const emitter = inject("emitter");

// stores
const productStore = useProductStore();
const { products } = storeToRefs(productStore);

const imagePreview = ref(null);
//Add or Edit Product  Validation Schema (Merchant) 
const schema = yup.object({
  name: yup.object().required("اسم المنتج مطلوب"),
  price: yup
    .number()
    .typeError("السعر يجب ان يكون رقم")
    .positive("السعر يجب ان يكون أكبر من 0")
    .required("السعر مطلوب"),
  description: yup.string().required("الوصف مطلوب"),
  // image optional; if provided must be a file
  image: yup.mixed().nullable(),
});

const { handleSubmit, submitCount, resetForm: resetVeeForm } = useForm({ validationSchema: schema });

const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
const { value: price, errorMessage: priceError, meta: priceMeta } = useField("price");
const { value: description, errorMessage: descriptionError, meta: descriptionMeta } =
  useField("description");
const { value: image, errorMessage: imageError, meta: imageMeta } = useField("image");

const categoryForProductSelected = computed(() => {
  if (name.value && name.value.category) {
    return name.value.category.name;
  }
  return "";
});

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    image.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

const closeDialog = () => {
  emit("update:modelValue", false);
  resetForm();
};
const resetForm = () => {
  name.value = null;
  price.value = "";
  description.value = "";
  image.value = null;
  imagePreview.value = null;
  selectedProduct.value = null;
  resetVeeForm({ values: { name: null, price: "", description: "", image: null }, errors: {} });
};

const isEditPage = computed(() => {
  return ![0, undefined, null, [], "", {}].includes(
    props.productEdit.product_id
  );
});
// Add or Edit Product (Merchant)
const submit = handleSubmit(async (values) => {
  const formData = new FormData();
  if (values.name) formData.append("product_id", values.name.id);
  if (values.price) formData.append("price", values.price);
  if (values.description) formData.append("description", values.description);
  if (values.image) formData.append("image", values.image);
  try {
    if (isEditPage.value) {
      formData.append("_method", "PUT");
      const response = await axiosClient.post(
        `merchant/store/products/${props.productEdit.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, }
      );
      if (response.status == 200) {
        emitter.emit("showNotificationAlert", [
          "success",
          `تم تعديل المنتج ${values.name.name} بنجاح !`,
        ]);
        // Emit event to update product dialog and other sections
        emitter.emit("productUpdated", {
          id: props.productEdit.id,
          ...(response.data.product || response.data)
        });
        emit("fetchProducts");
        closeDialog();
      } return;
    }
    const response = await axiosClient.post(
      "merchant/store/products",
      formData,
      { headers: { "Content-Type": "multipart/form-data" }, });
    if (response.status == 200) {
      emitter.emit("showNotificationAlert", [
        "success",
        `تم اضافة المنتج ${values.name.name} بنجاح الى متجرك!`,
      ]); emit("fetchProducts"); closeDialog();
    }
  } catch (e) { }
});


const availableProducts = computed(() => {
  return products.value.filter((p) => !props.productsIds.includes(p.id) || p.id === props.productEdit?.product_id);
});

const selectedProduct = ref(null);

watch(selectedProduct, (val) => {
  name.value = val;
});

watch(
  () => props.modelValue,
  async (val) => {
    if (!val) return;
    await productStore.fetchAllProductsIds();
    if (isEditPage.value) {
      await nextTick();
      selectedProduct.value = products.value.find(
        (p) => p.id === props.productEdit?.product_id
      );
      name.value = selectedProduct.value.name;
      price.value = props.productEdit.price;
      description.value = props.productEdit.description;
      imagePreview.value = props.productEdit.image;
    } else {
      resetForm();
    }
  }
);
</script>
<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.5);
  border-radius: 3px;
}
</style>
