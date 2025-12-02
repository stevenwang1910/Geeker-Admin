import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { TimingTask } from "@/api/interface/timingTask";
import {
  getTimingTaskList,
  getTimingTaskDetail,
  createTimingTask,
  updateTimingTask,
  deleteTimingTask,
  batchDeleteTimingTask,
  enableTimingTask,
  disableTimingTask,
  executeTimingTask,
  cancelTimingTask,
  getTaskLogList,
  getTaskStats,
  getTaskTypeDict,
  getTaskStatusDict,
  getTaskPriorityDict
} from "@/api/modules/timingTask";

export const useTimingTaskStore = defineStore("timingTask", () => {
  // 定时任务列表
  const taskList = ref<TimingTask.ResTimingTask[]>([]);
  // 任务日志列表
  const taskLogList = ref<TimingTask.ResTaskLog[]>([]);
  // 任务统计信息
  const taskStats = ref<TimingTask.ResTaskStats | null>(null);
  // 任务类型字典
  const taskTypeDict = ref<{ label: string; value: string }[]>([]);
  // 任务状态字典
  const taskStatusDict = ref<{ label: string; value: string }[]>([]);
  // 任务优先级字典
  const taskPriorityDict = ref<{ label: string; value: string }[]>([]);
  // 分页信息
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0
  });
  // 日志分页信息
  const logPagination = ref({
    current: 1,
    pageSize: 10,
    total: 0
  });
  // 加载状态
  const loading = ref(false);
  const logLoading = ref(false);

  // 计算属性
  const runningTasks = computed(() => {
    return taskList.value.filter(task => task.status === TimingTask.TaskStatus.RUNNING);
  });

  const completedTasks = computed(() => {
    return taskList.value.filter(task => task.status === TimingTask.TaskStatus.COMPLETED);
  });

  const failedTasks = computed(() => {
    return taskList.value.filter(task => task.status === TimingTask.TaskStatus.FAILED);
  });

  // 获取定时任务列表
  const fetchTaskList = async (params: TimingTask.ReqTaskParams) => {
    loading.value = true;
    try {
      const response = await getTimingTaskList(params);
      taskList.value = response.data.list;
      pagination.value = {
        current: response.data.pageNum,
        pageSize: response.data.pageSize,
        total: response.data.total
      };
      return response;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 获取定时任务详情
  const fetchTaskDetail = async (id: string) => {
    try {
      const response = await getTimingTaskDetail(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // 创建定时任务
  const createTask = async (params: TimingTask.ReqTimingTask) => {
    try {
      const response = await createTimingTask(params);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 更新定时任务
  const updateTask = async (id: string, params: TimingTask.ReqTimingTask) => {
    try {
      const response = await updateTimingTask(id, params);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 删除定时任务
  const deleteTask = async (id: string) => {
    try {
      const response = await deleteTimingTask(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 批量删除定时任务
  const batchDeleteTask = async (ids: string[]) => {
    try {
      const response = await batchDeleteTimingTask(ids);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 启用定时任务
  const enableTask = async (id: string) => {
    try {
      const response = await enableTimingTask(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 禁用定时任务
  const disableTask = async (id: string) => {
    try {
      const response = await disableTimingTask(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 立即执行定时任务
  const executeTask = async (id: string) => {
    try {
      const response = await executeTimingTask(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 取消定时任务执行
  const cancelTask = async (id: string) => {
    try {
      const response = await cancelTimingTask(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 获取任务执行日志
  const fetchTaskLogList = async (params: TimingTask.ReqLogParams) => {
    logLoading.value = true;
    try {
      const response = await getTaskLogList(params);
      taskLogList.value = response.data.list;
      logPagination.value = {
        current: response.data.pageNum,
        pageSize: response.data.pageSize,
        total: response.data.total
      };
      return response;
    } catch (error) {
      throw error;
    } finally {
      logLoading.value = false;
    }
  };

  // 获取任务统计信息
  const fetchTaskStats = async () => {
    try {
      const response = await getTaskStats();
      taskStats.value = response.data;
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 获取任务类型字典
  const fetchTaskTypeDict = async () => {
    try {
      const response = await getTaskTypeDict();
      taskTypeDict.value = response.data;
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 获取任务状态字典
  const fetchTaskStatusDict = async () => {
    try {
      const response = await getTaskStatusDict();
      taskStatusDict.value = response.data;
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 获取任务优先级字典
  const fetchTaskPriorityDict = async () => {
    try {
      const response = await getTaskPriorityDict();
      taskPriorityDict.value = response.data;
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 重置状态
  const resetState = () => {
    taskList.value = [];
    taskLogList.value = [];
    taskStats.value = null;
    pagination.value = {
      current: 1,
      pageSize: 10,
      total: 0
    };
    logPagination.value = {
      current: 1,
      pageSize: 10,
      total: 0
    };
    loading.value = false;
    logLoading.value = false;
  };

  return {
    // 状态
    taskList,
    taskLogList,
    taskStats,
    taskTypeDict,
    taskStatusDict,
    taskPriorityDict,
    pagination,
    logPagination,
    loading,
    logLoading,
    // 计算属性
    runningTasks,
    completedTasks,
    failedTasks,
    // 方法
    fetchTaskList,
    fetchTaskDetail,
    createTask,
    updateTask,
    deleteTask,
    batchDeleteTask,
    enableTask,
    disableTask,
    executeTask,
    cancelTask,
    fetchTaskLogList,
    fetchTaskStats,
    fetchTaskTypeDict,
    fetchTaskStatusDict,
    fetchTaskPriorityDict,
    resetState
  };
});