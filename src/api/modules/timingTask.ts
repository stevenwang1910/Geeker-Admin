import { ResPage, ResultData } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { TimingTask } from "@/api/interface/timingTask";

/**
 * @name 定时任务模块
 */

// 获取定时任务列表
export const getTimingTaskList = (params: TimingTask.ReqTaskParams) => {
  return http.post<ResPage<TimingTask.ResTimingTask>>(PORT1 + `/timingTask/list`, params);
};

// 获取定时任务详情
export const getTimingTaskDetail = (id: string) => {
  return http.get<TimingTask.ResTimingTask>(PORT1 + `/timingTask/${id}`);
};

// 创建定时任务
export const createTimingTask = (params: TimingTask.ReqTimingTask) => {
  return http.post<ResultData>(PORT1 + `/timingTask`, params);
};

// 更新定时任务
export const updateTimingTask = (id: string, params: TimingTask.ReqTimingTask) => {
  return http.put<ResultData>(PORT1 + `/timingTask/${id}`, params);
};

// 删除定时任务
export const deleteTimingTask = (id: string) => {
  return http.delete<ResultData>(PORT1 + `/timingTask/${id}`);
};

// 批量删除定时任务
export const batchDeleteTimingTask = (ids: string[]) => {
  return http.delete<ResultData>(PORT1 + `/timingTask/batch`, { data: { ids } });
};

// 启用定时任务
export const enableTimingTask = (id: string) => {
  return http.put<ResultData>(PORT1 + `/timingTask/${id}/enable`);
};

// 禁用定时任务
export const disableTimingTask = (id: string) => {
  return http.put<ResultData>(PORT1 + `/timingTask/${id}/disable`);
};

// 立即执行定时任务
export const executeTimingTask = (id: string) => {
  return http.post<ResultData>(PORT1 + `/timingTask/${id}/execute`);
};

// 取消定时任务执行
export const cancelTimingTask = (id: string) => {
  return http.put<ResultData>(PORT1 + `/timingTask/${id}/cancel`);
};

// 获取任务执行日志
export const getTaskLogList = (params: TimingTask.ReqLogParams) => {
  return http.post<ResPage<TimingTask.ResTaskLog>>(PORT1 + `/timingTask/log/list`, params);
};

// 获取任务统计信息
export const getTaskStats = () => {
  return http.get<TimingTask.ResTaskStats>(PORT1 + `/timingTask/stats`);
};

// 获取任务类型字典
export const getTaskTypeDict = () => {
  return http.get<{ label: string; value: string }[]>(PORT1 + `/timingTask/type/dict`);
};

// 获取任务状态字典
export const getTaskStatusDict = () => {
  return http.get<{ label: string; value: string }[]>(PORT1 + `/timingTask/status/dict`);
};

// 获取任务优先级字典
export const getTaskPriorityDict = () => {
  return http.get<{ label: string; value: string }[]>(PORT1 + `/timingTask/priority/dict`);
};

// 导出任务数据
export const exportTaskData = (params: TimingTask.ReqTaskParams) => {
  return http.download(PORT1 + `/timingTask/export`, params);
};

// 导出任务日志
export const exportTaskLog = (params: TimingTask.ReqLogParams) => {
  return http.download(PORT1 + `/timingTask/log/export`, params);
};