<!-- App.vue -->
<template>
  <div 
    class="app min-h-screen bg-gray-100 dark:bg-gray-800"
    :class="{ 'overflow-hidden': isProfilePage }"
  >
    <router-view />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useThemeStore } from "./stores/theme";
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useAuthStore } from "./stores/auth/auth";
import { useNotificationStore } from "./stores/notification";
import { useRouter } from "vue-router";
import { echo } from "./echo";

const router = useRouter();
const themeStore = useThemeStore();  
const authStore = useAuthStore();
const { user, isAuth } = storeToRefs(authStore);
const notificationStore = useNotificationStore();

// Check if current route is personal_profile
const isProfilePage = computed(() => router.currentRoute.value.name === 'personal_profile');

// Setup real-time notification listener
let notificationChannel = null;

const setupNotificationListener = () => {
  if (!user.value?.id) return;
  
  // Prevent duplicate listener setup
  if (notificationChannel) {
    return;
  }
  
  // Subscribe to user's private notification channel
  notificationChannel = echo.private(`App.Models.User.${user.value.id}`);
  
  // Listen for all notification types
  notificationChannel.notification((notification) => {
    // Add the new notification to the store in real-time
    notificationStore.addLiveNotification(notification);
  });
};

const cleanupNotificationListener = () => {
  if (notificationChannel && user.value?.id) {
    echo.leave(`App.Models.User.${user.value.id}`);
    notificationChannel = null;
  }
};

watch(
  () => isAuth.value,
  async (newVal) => {
    if (newVal) {
      await notificationStore.fetchLastNotifications();
      // Setup real-time listener when user logs in
      setupNotificationListener();
    } else {
      // Cleanup when user logs out
      cleanupNotificationListener();
    }
  }
);

onMounted(async () => {
  // Check auth and sync user's theme from database if logged in
  await authStore.checkAuth();
  if (user.value?.theme) {
    themeStore.changeTheme(user.value.theme);
  }
  
  // Setup real-time notifications if already authenticated
  if (isAuth.value && user.value?.id) {
    setupNotificationListener();
  }
});

onUnmounted(() => {
  cleanupNotificationListener();
});
</script>


<style lang="scss">
#app {
  max-width: 100vw;
}

nav {
  a {
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
