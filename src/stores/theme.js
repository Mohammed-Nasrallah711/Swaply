// stores/theme.js
import { defineStore, storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useAuthStore } from "./auth/auth";

export const useThemeStore = defineStore("theme", () => {
  // initialize from localStorage immediately (synchronous with inline script in index.html)
  const savedTheme = localStorage.getItem("theme");
  const currentTheme = ref(savedTheme === "dark" ? "dark" : "light");
  
  const authStore = useAuthStore();
  const { user, isAuth } = storeToRefs(authStore);

  const themes = [
    {
      label: "فاتح",
      id: "light",
    },
    {
      label: "داكن",
      id: "dark",
    },
  ];

  const applyTheme = (theme) => {
    // Only need to add/remove 'dark' class on <html> element for Tailwind
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const changeTheme = async (value, updateDatabase = false) => {
    const newTheme = value === "dark" ? "dark" : "light";
    currentTheme.value = newTheme;
    
    // Save to localStorage
    localStorage.setItem("theme", newTheme);
    
    // Apply CSS classes
    applyTheme(newTheme);
    
    // Update database only if user is authenticated and theme actually changed
    if (updateDatabase && isAuth.value && user.value?.theme !== newTheme) {
      await authStore.update({ theme: newTheme }, false);
    }
  };

  // Watch for theme changes (e.g., from settings page)
  watch(currentTheme, (newVal) => {
    applyTheme(newVal);
  });

  return { currentTheme, themes, changeTheme };
});
