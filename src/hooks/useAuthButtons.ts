import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

/**
 * @description 页面按钮权限
 * */
export const useAuthButtons = () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const authButtons = authStore.authButtonListGet[route.name as string] || [];

  const BUTTONS = computed(() => {
    let currentPageAuthButton: { [key: string]: boolean } = {};
    authButtons.forEach(item => (currentPageAuthButton[item] = true));
    return currentPageAuthButton;
  });

  /**
   * @description 检查是否有权限
   * @param permission 权限标识
   * @returns boolean
   */
  const hasPermission = (permission: string): boolean => {
    return authButtons.includes(permission);
  };

  return {
    BUTTONS,
    hasPermission
  };
};
