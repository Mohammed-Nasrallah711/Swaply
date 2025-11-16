// stores/auth.js
import { defineStore } from "pinia";
import axiosClient from "../../axiosClient";
import { useRouter } from "vue-router";
import axios from "axios";
import { computed, inject, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref({});
  const loading = ref(false);
  const backErrors = ref({});
  const redirect = ref(false);
  const isAuth = ref(false);
  const isCheckedAuth = ref(false);
  const emitter = inject("emitter");
  const forgotMessage = ref(null);
  const router = useRouter();
  const isCustomer = computed(() => {
    return user.value?.role == "customer";
  });
  const isMerchant = computed(() => {
    return user.value?.role == "merchant";
  });

  const login = async (credentials) => {
    loading.value = true;
    try {
      await getCsrfToken();
      const response = await axiosClient.post("/login", credentials);
      if (response.status === 200) {
        isAuth.value = true;
        redirect.value = true;
        user.value = response.data.user;
        backErrors.value = {};
        isCheckedAuth.value = true;
        if (user.value.role == "admin") {
          router.push({ name: "dashboard" });
          return;
        }

        router.push({ name: "home" });
        emitter.emit("showNotificationAlert", [
          "success",
          "تم تسجيل الدخول بنجاح!",
        ]);
      }
    } catch (e) {
      backErrors.value = e?.response?.data?.errors || {};
      const message = e?.response?.data?.message;
      if (message) {
        emitter.emit("showNotificationAlert", ["error", message]);
      }
    } finally {
      loading.value = false;
    }
  };
  const forgotPassword = async (credentials) => {
    await getCsrfToken();
    try {
      loading.value = true;
      const response = await axiosClient.post("/forgot-password", credentials);
      if (response.status === 200) {
        forgotMessage.value = credentials.email
          ? "تم ارسال رسالة إلى الإيميل الخاص بك"
          : "تم ارسال رسالة إلى رقم هاتفك";

        emitter.emit("showNotificationAlert", [
          "success",
          "تم إعادة ضبط كلمة المرور بنجاح",
        ]);

        setTimeout(() => {
          router.push({ name: "otp-verification" });
        }, 3000);
        isCheckedAuth.value = true;
      }
    } catch (error) {
      backErrors.value = error.response.data.errors;
    } finally {
      loading.value = false;
    }
  };

  const verifyOtp = async (identifier, otp) => {
    loading.value = true;
    try {
      const response = await axiosClient.post("/verify-otp", {
        otp: otp,
        identifier: identifier,
      });
      if (response.status == 200) {
        emitter.emit("showNotificationAlert", [
          "success",
          " تم التحقق من الكود بنجاح، يمكنك متابعة إعادة كلمة المرور",
        ]);
        router.push({
          name: "reset-password",
          query: { identifier, token: otp },
        });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "الكود غير صحيح، يرجى المحاولة مرة أخرى";
      emitter.emit("showNotificationAlert", [
        "error",
        errorMessage,
      ]);
      throw error; // Re-throw so component can handle it
    } finally {
      loading.value = false;
    }
  };
  const resetPassword = async (credentials) => {
    await getCsrfToken();
    try {
      loading.value = true;
      const response = await axiosClient.post("/reset-password", credentials);
      if (response.status === 200) {
        emitter.emit("showNotificationAlert", [
          "success",
          "تم اعادة ضبط كلمة المرور بنجاح",
        ]);
        router.push({ name: "login" });
      }
    } catch (error) {
      emitter.emit("showNotificationAlert", [
        "error",
        error?.response?.data?.message || "حدث خطأ أثناء إعادة ضبط كلمة المرور",
      ]);

      backErrors.value = error?.response?.data?.errors || {};
    } finally {
      loading.value = false;
    }
  };
  const register = async (credentials) => {
    await getCsrfToken();
    try {
      loading.value = true;
      const response = await axiosClient.post("/register", credentials);
      if (response.status === 201) {
        isAuth.value = true;
        user.value = response.data.user;
        backErrors.value = null;
        router.push({ name: "home" });

        emitter.emit("showNotificationAlert", [
          "success",
          "تم تسجيل الدخول بنجاح!",
        ]);
        isCheckedAuth.value = true;
      }
    } catch (error) {
      backErrors.value = error?.response?.data?.errors;
    } finally {
      loading.value = false;
    }
  };
  const logout = async () => {
    await getCsrfToken();
    await axiosClient.post("/logout").then((response) => {
      if (response.status === 204) {
        user.value = null;
        isAuth.value = false;
        redirect.value = true;
        loading.value = false;
        if (router.currentRoute.value.name != "home")
          router.push({ name: "home" });
      }
    });
  };
  const getCsrfToken = async () => {
    await axios
      .get("/sanctum/csrf-cookie", {
        withCredentials: true,
      })
      .then((response) => {});
  };
  const loginWith = async (driver) => {
    await getCsrfToken();
    axiosClient
      .get(`/api/auth/${driver}/redirect`)
      .then((response) => {
        if (response.status === 200) {
          isAuth.value = true;
          redirect.value = true;
        }
      })
      .catch((e) => {});
  };
  const checkAuth = async () => {
    if (isCheckedAuth.value) return;

    loading.value = true;
    try {
      await getCsrfToken();
      const response = await axiosClient.get("/auth/user", {
        validateStatus: (status) => status === 200 || status === 401
      });
      
      if (response.status === 200 && response.data) {
        user.value = response.data;
        isAuth.value = true;
      } else {
        user.value = null;
        isAuth.value = false;
      }
    } catch (error) {
      user.value = null;
      isAuth.value = false;
    } finally {
      isCheckedAuth.value = true;
      loading.value = false;
    }
  };
  const update = async (data, isShowAlert = true) => {
    try {
      const response = await axiosClient.put("/user", data);
      if (response.status == 200 && isShowAlert && isAuth.value) {
        emitter.emit("showNotificationAlert", [
          "success",
          "تم تحديث بيانات الحساب بنجاح!",
        ]);
      }
    } catch (error) {
      if (isAuth.value) {
        emitter.emit("showNotificationAlert", [
          "error",
          error.response.data.message || "حدث خطأ ما، يرجى المحاولة لاحقاً.",
        ]);
      }
    }
  };

  const deleteAccount = async (current_password) => {
    try {
      const response = await axiosClient.delete("/user/delete-account", {
        data: { current_password },
      });
      if (response.status == 204) {
        user.value = null;
        isAuth.value = false;
        redirect.value = true;
        loading.value = false;
        if (router.currentRoute.value.name != "home")
          router.push({ name: "home" });
        emitter.emit("showNotificationAlert", [
          "success",
          "تم حذف الحساب بنجاح!",
        ]);
      }
    } catch (error) {
      emitter.emit("showNotificationAlert", [
        "error",
        error.response.data.message || "حدث خطأ ما، يرجى المحاولة لاحقاً.",
      ]);
    }
  };

  const firstError = (field) => {
    return Array.isArray(backErrors.value?.[field])
      ? backErrors.value[field][0]
      : null;
  };

  return {
    user,
    loading,
    backErrors,
    redirect,
    isAuth,
    isCustomer,
    isMerchant,
    forgotMessage,
    verifyOtp,
    update,
    deleteAccount,
    forgotPassword,
    login,
    checkAuth,
    loginWith,
    logout,
    firstError,
    register,
    resetPassword,
  };
});
