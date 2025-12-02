import { defHttp } from "@/api/helper/axios";
import { ResultData, ReqPage, ResPage } from "@/api/interface";

// 定时任务接口定义
export interface TimingTask {
  id?: string;
  name: string;
  description?: string;
  taskType: string;
  priority: number;
  cronExpression?: string;
  interval?: number;
  intervalUnit?: "second" | "minute" | "hour" | "day";
  status: "active" | "inactive" | "paused";
  lastExecutionTime?: string;
  nextExecutionTime?: string;
  executionCount: number;
  successCount: number;
  failureCount: number;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  executionParams?: Record<string, any>;
}

// 定时任务执行日志接口定义
export interface TaskExecutionLog {
  id: string;
  taskId: string;
  taskName: string;
  status: "success" | "failure" | "running";
  startTime: string;
  endTime?: string;
  duration?: number;
  result?: string;
  errorMessage?: string;
  createdAt: string;
}

// 创建定时任务参数
export interface CreateTaskParams {
  name: string;
  description: string;
  taskType: string;
  priority: number;
  cronExpression?: string;
  interval?: number;
  intervalUnit?: "second" | "minute" | "hour" | "day";
  executionParams?: Record<string, any>;
}

// 更新定时任务参数
export interface UpdateTaskParams extends Partial<CreateTaskParams> {
  id: string;
}

// 定时任务分页查询参数
export interface TaskPageParams extends ReqPage {
  name?: string;
  taskType?: string;
  status?: string;
  priority?: number;
}

// 定时任务执行日志分页查询参数
export interface TaskLogPageParams extends ReqPage {
  taskId?: string;
  taskName?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

// 定时任务API
export const timingTaskApi = {
  // 获取定时任务列表（分页）
  getTaskList: (params: TaskPageParams) =>
    new Promise<ResPage<TimingTask>>(resolve => {
      // Mock data
      setTimeout(() => {
        resolve({
          code: 200,
          msg: "success",
          data: {
            records: [
              {
                id: "1",
                name: "数据备份任务",
                description: "每天凌晨2点备份数据库",
                taskType: "database_backup",
                cronExpression: "0 2 * * *",
                status: "active",
                priority: 1,
                nextExecutionTime: new Date().toISOString(),
                lastExecutionTime: new Date(Date.now() - 86400000).toISOString(),
                executionCount: 10,
                maxExecutions: 0,
                concurrency: 1,
                createdBy: "admin",
                updatedBy: "admin",
                createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
                executionParams: { dbName: "example_db" }
              },
              {
                id: "2",
                name: "邮件发送任务",
                description: "每小时发送邮件提醒",
                taskType: "email_notification",
                cronExpression: "0 * * * *",
                status: "paused",
                priority: 2,
                nextExecutionTime: new Date().toISOString(),
                lastExecutionTime: new Date(Date.now() - 3600000).toISOString(),
                executionCount: 24,
                maxExecutions: 0,
                concurrency: 1,
                createdBy: "admin",
                updatedBy: "admin",
                createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
                executionParams: { templateId: "template_123" }
              }
            ],
            total: 2,
            size: 10,
            current: 1,
            pages: 1
          }
        });
      }, 100);
    }),

  // 获取定时任务详情
  getTaskDetail: (id: string) =>
    defHttp.get<TimingTask>({
      url: `/system/timingTask/detail/${id}`
    }),

  // 创建定时任务
  createTask: (data: CreateTaskParams) =>
    defHttp.post<TimingTask>({
      url: "/system/timingTask/create",
      data
    }),

  // 更新定时任务
  updateTask: (data: UpdateTaskParams) =>
    defHttp.put<TimingTask>({
      url: "/system/timingTask/update",
      data
    }),

  // 删除定时任务
  deleteTask: (id: string) =>
    defHttp.delete<boolean>({
      url: `/system/timingTask/delete/${id}`
    }),

  // 批量删除定时任务
  batchDeleteTask: (ids: string[]) =>
    defHttp.delete<boolean>({
      url: "/system/timingTask/batchDelete",
      data: ids
    }),

  // 启动定时任务
  startTask: (id: string) =>
    new Promise<boolean>(resolve => {
      // Mock data
      setTimeout(() => {
        resolve(true);
      }, 100);
    }),

  // 暂停定时任务
  pauseTask: (id: string) =>
    new Promise<boolean>(resolve => {
      // Mock data
      setTimeout(() => {
        resolve(true);
      }, 100);
    }),

  // 立即执行定时任务
  executeTask: (id: string) =>
    new Promise<boolean>(resolve => {
      // Mock data
      setTimeout(() => {
        resolve(true);
      }, 100);
    }),

  // 获取定时任务执行日志（分页）
  getTaskLogList: (params: TaskLogPageParams) =>
    new Promise<ResPage<TaskExecutionLog>>(resolve => {
      // Mock data
      setTimeout(() => {
        resolve({
          code: 200,
          msg: "success",
          data: {
            records: [
              {
                id: "log1",
                taskId: "1",
                taskName: "数据备份任务",
                status: "success",
                duration: 1200,
                startTime: new Date(Date.now() - 86400000).toISOString(),
                endTime: new Date(Date.now() - 86398800).toISOString(),
                result: "备份成功，共备份1000条记录",
                createdAt: new Date(Date.now() - 86400000).toISOString()
              },
              {
                id: "log2",
                taskId: "1",
                taskName: "数据备份任务",
                status: "success",
                duration: 1150,
                startTime: new Date(Date.now() - 2 * 86400000).toISOString(),
                endTime: new Date(Date.now() - 2 * 86400000 + 1150).toISOString(),
                result: "备份成功，共备份980条记录",
                createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
              },
              {
                id: "log3",
                taskId: "2",
                taskName: "邮件发送任务",
                status: "success",
                duration: 800,
                startTime: new Date(Date.now() - 3600000).toISOString(),
                endTime: new Date(Date.now() - 3599200).toISOString(),
                result: "邮件发送成功，共发送50封邮件",
                createdAt: new Date(Date.now() - 3600000).toISOString()
              }
            ],
            total: 3,
            size: 10,
            current: 1,
            pages: 1
          }
        });
      }, 100);
    }),

  // 获取定时任务执行日志详情
  getTaskLogDetail: (id: string) =>
    defHttp.get<TaskExecutionLog>({
      url: `/system/timingTask/log/detail/${id}`
    }),

  // 清理定时任务执行日志
  cleanTaskLog: (params: { taskId?: string; days?: number }) =>
    defHttp.delete<boolean>({
      url: "/system/timingTask/log/clean",
      params
    }),

  // 获取支持的任务类型
  getTaskTypes: () =>
    defHttp.get<{ value: string; label: string; description: string }[]>({
      url: "/system/timingTask/types"
    }),

  // 验证cron表达式
  validateCron: (expression: string) =>
    defHttp.get<{ valid: boolean; message?: string; nextExecutionTime?: string }>({
      url: "/system/timingTask/validateCron",
      params: { expression }
    })
};
