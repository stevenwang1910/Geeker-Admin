import http from "@/api/index";
import { mockGetSystemLogList, mockDeleteSystemLog, mockClearSystemLog, mockExportSystemLog } from "@/assets/mock/systemLog";

// 系统日志接口
interface SystemLog {
  id: string;
  userId: string;
  username: string;
  operation: string;
  level: string;
  ip: string;
  userAgent: string;
  requestUrl: string;
  requestMethod: string;
  requestParams: string;
  responseData: string;
  errorMsg: string;
  createdAt: string;
  updatedAt: string;
}

// 系统日志列表请求参数
interface ReqSystemLogList {
  pageNum: number;
  pageSize: number;
  username?: string;
  operation?: string;
  level?: string;
  startTime?: string;
  endTime?: string;
}

// 系统日志列表响应
interface ResSystemLogList {
  list: SystemLog[];
  total: number;
}

// 获取系统日志列表
export const getSystemLogList = (params: ReqSystemLogList) => {
  // 使用mock数据
  return Promise.resolve({ code: 0, msg: "查询成功", data: mockGetSystemLogList(params) });
};

// 删除系统日志
export const deleteSystemLog = (params: { id: string[] }) => {
  // 使用mock数据
  mockDeleteSystemLog(params);
  return Promise.resolve({ code: 0, msg: "删除成功" });
};

// 清空系统日志
export const clearSystemLog = () => {
  // 使用mock数据
  mockClearSystemLog();
  return Promise.resolve({ code: 0, msg: "清空成功" });
};

// 导出系统日志
export const exportSystemLog = (params: ReqSystemLogList) => {
  // 使用mock数据
  const blob = mockExportSystemLog(params);
  return Promise.resolve({ code: 0, msg: "导出成功", data: blob });
};
