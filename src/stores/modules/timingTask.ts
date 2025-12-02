import { defineStore } from "pinia";
import {
  timingTaskApi,
  TimingTask,
  TaskExecutionLog,
  TaskPageParams,
  TaskLogPageParams,
  CreateTaskParams,
  UpdateTaskParams
} from "@/api/modules/timingTask";
import { BasicFetchResult } from "@/api/interface";
import { ElMessage } from "element-plus";

// 定时任务状态接口
export interface TimingTaskState {
  // 定时任务列表
  taskList: TimingTask[];
  // 定时任务总数
  taskTotal: number;
  // 定时任务执行日志列表
  logList: TaskExecutionLog[];
  // 定时任务执行日志总数
  logTotal: number;
  // 支持的任务类型
  taskTypes: { value: string; label: string; description: string }[];
  // 加载状态
  loading: {
    task: boolean;
    log: boolean;
    operation: boolean;
  };
}

// 定义定时任务存储模块
export const useTimingTaskStore = defineStore("timingTask", {
  state: (): TimingTaskState => ({
    taskList: [],
    taskTotal: 0,
    logList: [],
    logTotal: 0,
    taskTypes: [],
    loading: {
      task: false,
      log: false,
      operation: false
    }
  }),

  getters: {
    // 获取所有定时任务
    getAllTasks: state => state.taskList,
    // 获取定时任务总数
    getTaskTotal: state => state.taskTotal,
    // 获取定时任务执行日志
    getAllLogs: state => state.logList,
    // 获取定时任务执行日志总数
    getLogTotal: state => state.logTotal,
    // 获取支持的任务类型
    getTaskTypes: state => state.taskTypes,
    // 获取任务加载状态
    isTaskLoading: state => state.loading.task,
    // 获取日志加载状态
    isLogLoading: state => state.loading.log,
    // 获取操作加载状态
    isOperationLoading: state => state.loading.operation
  },

  actions: {
    // 设置任务列表
    setTaskList(list: TimingTask[], total: number) {
      this.taskList = list;
      this.taskTotal = total;
    },

    // 设置日志列表
    setLogList(list: TaskExecutionLog[], total: number) {
      this.logList = list;
      this.logTotal = total;
    },

    // 设置任务类型
    setTaskTypes(types: { value: string; label: string; description: string }[]) {
      this.taskTypes = types;
    },

    // 设置加载状态
    setLoading(type: "task" | "log" | "operation", loading: boolean) {
      this.loading[type] = loading;
    },

    // 获取定时任务列表（分页）
    async getTaskList(params: TaskPageParams) {
      this.setLoading("task", true);
      try {
        const response = await timingTaskApi.getTaskList(params);
        if (response.code === 200) {
          this.setTaskList(response.data.list, response.data.total);
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "获取定时任务列表失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("获取定时任务列表失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("task", false);
      }
    },

    // 获取定时任务详情
    async getTaskDetail(id: string) {
      try {
        const response = await timingTaskApi.getTaskDetail(id);
        if (response.code === 200) {
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "获取定时任务详情失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("获取定时任务详情失败");
        return Promise.reject(error);
      }
    },

    // 创建定时任务
    async createTask(data: CreateTaskParams) {
      this.setLoading("operation", true);
      try {
        const response = await timingTaskApi.createTask(data);
        if (response.code === 200) {
          ElMessage.success("创建定时任务成功");
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "创建定时任务失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("创建定时任务失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("operation", false);
      }
    },

    // 更新定时任务
    async updateTask(data: UpdateTaskParams) {
      this.setLoading("operation", true);
      try {
        const response = await timingTaskApi.updateTask(data);
        if (response.code === 200) {
          ElMessage.success("更新定时任务成功");
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "更新定时任务失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("更新定时任务失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("operation", false);
      }
    },

    // 删除定时任务
    async deleteTask(id: string) {
      this.setLoading("operation", true);
      try {
        const response = await timingTaskApi.deleteTask(id);
        if (response.code === 200) {
          ElMessage.success("删除定时任务成功");
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "删除定时任务失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("删除定时任务失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("operation", false);
      }
    },

    // 批量删除定时任务
    async batchDeleteTask(ids: string[]) {
      this.setLoading("operation", true);
      try {
        const response = await timingTaskApi.batchDeleteTask(ids);
        if (response.code === 200) {
          ElMessage.success("批量删除定时任务成功");
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "批量删除定时任务失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("批量删除定时任务失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("operation", false);
      }
    },

    // 启动定时任务
    async startTask(id: string) {
      this.setLoading("operation", true);
      try {
        const response = await timingTaskApi.startTask(id);
        if (response.code === 200) {
          ElMessage.success("启动定时任务成功");
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "启动定时任务失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("启动定时任务失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("operation", false);
      }
    },

    // 暂停定时任务
    async pauseTask(id: string) {
      this.setLoading("operation", true);
      try {
        const response = await timingTaskApi.pauseTask(id);
        if (response.code === 200) {
          ElMessage.success("暂停定时任务成功");
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "暂停定时任务失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("暂停定时任务失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("operation", false);
      }
    },

    // 立即执行定时任务
    async executeTask(id: string) {
      this.setLoading("operation", true);
      try {
        const response = await timingTaskApi.executeTask(id);
        if (response.code === 200) {
          ElMessage.success("立即执行定时任务成功");
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "立即执行定时任务失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("立即执行定时任务失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("operation", false);
      }
    },

    // 获取定时任务执行日志（分页）
    async getTaskLogList(params: TaskLogPageParams) {
      this.setLoading("log", true);
      try {
        const response = await timingTaskApi.getTaskLogList(params);
        if (response.code === 200) {
          this.setLogList(response.data.list, response.data.total);
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "获取定时任务执行日志失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("获取定时任务执行日志失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("log", false);
      }
    },

    // 获取定时任务执行日志详情
    async getTaskLogDetail(id: string) {
      try {
        const response = await timingTaskApi.getTaskLogDetail(id);
        if (response.code === 200) {
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "获取定时任务执行日志详情失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("获取定时任务执行日志详情失败");
        return Promise.reject(error);
      }
    },

    // 清理定时任务执行日志
    async cleanTaskLog(params: { taskId?: string; days?: number }) {
      this.setLoading("operation", true);
      try {
        const response = await timingTaskApi.cleanTaskLog(params);
        if (response.code === 200) {
          ElMessage.success("清理定时任务执行日志成功");
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "清理定时任务执行日志失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("清理定时任务执行日志失败");
        return Promise.reject(error);
      } finally {
        this.setLoading("operation", false);
      }
    },

    // 获取支持的任务类型
    async getTaskTypes() {
      try {
        const response = await timingTaskApi.getTaskTypes();
        if (response.code === 200) {
          this.setTaskTypes(response.data);
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "获取支持的任务类型失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("获取支持的任务类型失败");
        return Promise.reject(error);
      }
    },

    // 验证cron表达式
    async validateCron(expression: string) {
      try {
        const response = await timingTaskApi.validateCron(expression);
        if (response.code === 200) {
          return Promise.resolve(response.data);
        } else {
          ElMessage.error(response.msg || "验证cron表达式失败");
          return Promise.reject(response.msg);
        }
      } catch (error) {
        ElMessage.error("验证cron表达式失败");
        return Promise.reject(error);
      }
    }
  }
});
