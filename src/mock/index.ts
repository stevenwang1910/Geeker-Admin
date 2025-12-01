import { dictMock } from "./dict";

// 合并所有mock接口
export const mockModules = [...dictMock];

// 生产环境mock服务设置
export const setupProdMockServer = () => {
  if (import.meta.env.PROD) {
    // 生产环境下的mock服务设置
    // 这里可以根据实际情况进行配置
  }
};
