// stores/search.js
import { defineStore } from "pinia";
import { ref} from "vue";
import axiosClient from "../axiosClient";

export const useSearchStore = defineStore("search", () => {
  const stores = ref([]);
  const current_page = ref(1);
  const last_page = ref(1);
  const loading = ref(false);
  const errors = ref({});

  const fetchAllStoresHasProdcut = async (productId, page = 1, filter = {}) => {
    try {
      loading.value = true;

      const response = await axiosClient.get(`/search/stores/${productId}`, {
        params: { page, filter },
      });

      if (page === 1) {
        stores.value = response.data.stores.data;
      } else {
        stores.value = [...stores.value, ...response.data.stores.data];
      }

      current_page.value = response.data.stores.current_page;
      last_page.value = response.data.stores.last_page;
    } catch (e) {
      errors.value = e;
    } finally {
      loading.value = false;
    }
  };

  const fetchAllStoresByCategory = async (categoryId, page = 1, filter = {}) => {
    try {
      loading.value = true;

      const response = await axiosClient.get(`/search/stores-by-category/${categoryId}`, {
        params: { page, filter },
      });

      if (page === 1) {
        stores.value = response.data.stores.data;
      } else {
        stores.value = [...stores.value, ...response.data.stores.data];
      }

      current_page.value = response.data.stores.current_page;
      last_page.value = response.data.stores.last_page;
    } catch (e) {
      errors.value = e;
    } finally {
      loading.value = false;
    }
  };

  return {
    stores,
    last_page,
    current_page,
    loading,
    errors,
    fetchAllStoresHasProdcut,
    fetchAllStoresByCategory,
  };
});
