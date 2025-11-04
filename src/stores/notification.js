// stores/notification.js
import { defineStore } from "pinia";
import { inject, ref } from "vue";
import axiosClient from "../axiosClient";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref([]);
  const lastNotifications = ref([]);
  const lastNotificationUnreadCount = ref(0);
  const loading = ref(false);
  const status = ref(400);
  const errors = ref({});
  const emitter = inject("emitter");
  const addNotification = async (productId, type, price) => {
    try {
      loading.value = true;
      const response = await axiosClient.post("/notifications", {
        product_id: productId,
        type: type,
        target_price: price,
      });
      
      if (response.status === 201) {
        status.value = 201;
        await fetchNotification();
        
        // Check if there are existing matches
        const existingMatches = response.data.existing_matches;
        
        if (existingMatches && existingMatches.length > 0) {
          // Show detailed notification about existing matches
          const firstMatch = existingMatches[0];
          const matchCount = existingMatches.length;
          const priceText = type === 'lt' ? 'أقل' : 'أكبر';
          
          let message = matchCount === 1
            ? `وجدنا ${firstMatch.product_name} بسعر ${firstMatch.current_price}₪ في ${firstMatch.store_name}!`
            : `وجدنا ${matchCount} عروض ${priceText} من ${price}₪!`;
          
          emitter.emit("showNotificationAlert", [
            "success",
            message,
            7000 // Show for 7 seconds since it's important info
          ]);
          
          // Also show the list of matches if more than one
          if (matchCount > 1) {
            setTimeout(() => {
              const matchList = existingMatches.slice(0, 3).map(m => 
                `${m.product_name} - ${m.current_price}₪ في ${m.store_name}`
              ).join(' | ');
              
              emitter.emit("showNotificationAlert", [
                "info",
                matchList,
                8000
              ]);
            }, 1000);
          }
        } else {
          // No existing matches, just show success
          emitter.emit("showNotificationAlert", [
            "success",
            "تم اضافة تنبيه جديد بنجاح!",
            5000
          ]);
        }
      }
    } catch (e) {
      emitter.emit("showNotificationAlert", [
        "error",
        "فشل اضافة التنبيه، حاول مرة أخرى",
      ]);
    } finally {
      loading.value = false;
    }
  };

  const fetchNotification = async () => {
    try {
      const response = await axiosClient.get("/notifications");
      notifications.value = response.data.notifications;
    } catch (e) {
    }
  };

  const fetchLastNotifications = async () => {
    try {
      const response = await axiosClient.get("/active-notifications");
      if (response.status == 200) {
        lastNotificationUnreadCount.value = response.data.unread_count;
        lastNotifications.value = response.data.notifications;
      }
    } catch (e) {
    }
  };
  const markAsRead = async () => {
    try {
      const response = await axiosClient.patch("/notifications/mark-as-read");
      if (response.status == 200) {
        lastNotificationUnreadCount.value = 0;
      }
    } catch (e) {
    }
  };

  const addLiveNotification = (notification) => {
    // Laravel broadcasts notifications with data nested in 'data' property
    // But also provides direct access, so we handle both formats
    const notificationData = notification.data || notification;
    const notificationId = notification.id || notificationData.id;
    const alertId = notificationData.alert_id;
    const title = notificationData.title || notificationData.data?.title || "إشعار جديد";
    const status = notificationData.status || notificationData.data?.status || "info";
    
    // Prevent duplicate notifications by checking if this notification ID already exists
    if (notificationId) {
      const existingNotification = lastNotifications.value?.data?.find(n => n.id === notificationId) ||
                                  (Array.isArray(lastNotifications.value) && lastNotifications.value.find(n => n.id === notificationId));
      if (existingNotification) {
        // Notification already processed, skip duplicate
        return;
      }
    }
    
    // If this notification has an alert_id, it means an alert was triggered
    // Update the corresponding alert in the notifications array
    if (alertId && notifications.value) {
      const alertIndex = notifications.value.findIndex(n => n.id === alertId);
      if (alertIndex !== -1) {
        // Update the alert to show it's been triggered and paused
        notifications.value[alertIndex].is_triggered = true;
        notifications.value[alertIndex].status = 'inactive';
      }
    }

    // Create notification object matching the expected structure
    const newNotification = {
      id: notificationId || Date.now(),
      type: notificationData.type || 'user_notification',
      data: {
        title: title,
        status: status,
        type: notificationData.type || 'user_notification'
      },
      created_at: new Date().toISOString(),
      read_at: null,
    };

    // Add to the beginning of lastNotifications array (most recent first)
    if (lastNotifications.value?.data) {
      lastNotifications.value.data.unshift(newNotification);
    } else if (Array.isArray(lastNotifications.value)) {
      lastNotifications.value.unshift(newNotification);
    } else {
      lastNotifications.value = { data: [newNotification] };
    }

    // Increment unread count
    lastNotificationUnreadCount.value += 1;

    // Show toast notification to user
    if (emitter) {
      let type = "info";
      
      // Determine notification type based on status
      if (status === "lt") {
        type = "success"; // Price decreased
      } else if (status === "gt") {
        type = "warning"; // Price increased
      } else if (status === "offer") {
        type = "info"; // New offer
      }

      emitter.emit("showNotificationAlert", [type, title, 5000]);
    }
  };

  return {
    notifications,
    loading,
    errors,
    status,
    lastNotificationUnreadCount,
    lastNotifications,
    markAsRead,
    addNotification,
    fetchNotification,
    fetchLastNotifications,
    addLiveNotification,
  };
});
