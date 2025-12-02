import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";
import { logger } from "@/utils";

export const useUserStore = defineStore({
  id: "geeker-user",
  state: (): UserState => ({
    token: "",
    userInfo: { name: "Geeker" }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
      // 记录登录/登出日志
      if (token) {
        logger.info("用户登录成功", {
          request: {
            username: this.userInfo.name
          }
        });
      } else {
        logger.info("用户登出成功", {
          request: {
            username: this.userInfo.name
          }
        });
      }
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
      // 记录用户信息更新日志
      logger.info("用户信息更新", {
        request: userInfo
      });
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
