import type { ReqPage, ResPage, ResultData } from "@/api/interface";
import type { TimingTask } from "./interface/timingTask";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import logger from "@/utils/logger";

// 模拟定时任务数据（实际项目中应该从服务端获取）
const mockTimingTasks: TimingTask.ResTimingTaskList[] = [
  {
    id: "1",
    taskName: "数据备份任务",
    taskDescription: "每日凌晨3点备份数据库数据",
    taskType: "database_backup",
    cronExpression: "0 0 3 * * ?",
    taskStatus: "running",
    lastExecuteTime: "2024-01-15 03:00:00",
    lastExecuteStatus: "success",
    nextExecuteTime: "2024-01-16 03:00:00",
    createTime: "2024-01-01 10:00:00",
    updateTime: "2024-01-10 14:30:00",
    creator: "admin",
    updater: "admin"
  },
  {
    id: "2",
    taskName: "邮件发送任务",
    taskDescription: "每周一上午9点发送周报邮件",
    taskType: "email_send",
    cronExpression: "0 0 9 ? * MON",
    taskStatus: "paused",
    lastExecuteTime: "2024-01-15 09:00:00",
    lastExecuteStatus: "success",
    nextExecuteTime: "2024-01-22 09:00:00",
    createTime: "2024-01-02 11:30:00",
    updateTime: "2024-01-12 16:45:00",
    creator: "testuser",
    updater: "testuser"
  },
  {
    id: "3",
    taskName: "数据同步任务",
    taskDescription: "每小时同步一次外部系统数据",
    taskType: "data_sync",
    cronExpression: "0 0 * * * ?",
    taskStatus: "running",
    lastExecuteTime: "2024-01-15 14:00:00",
    lastExecuteStatus: "success",
    nextExecuteTime: "2024-01-15 15:00:00",
    createTime: "2024-01-03 14:00:00",
    updateTime: "2024-01-14 10:15:00",
    creator: "admin",
    updater: "admin"
  },
  {
    id: "4",
    taskName: "日志清理任务",
    taskDescription: "每月1号清理过期日志",
    taskType: "log_clean",
    cronExpression: "0 0 0 1 * ?",
    taskStatus: "running",
    lastExecuteTime: "2024-01-01 00:00:00",
    lastExecuteStatus: "success",
    nextExecuteTime: "2024-02-01 00:00:00",
    createTime: "2024-01-04 09:30:00",
    updateTime: "2024-01-15 13:20:00",
    creator: "admin",
    updater: "admin"
  }
];

/**
 * @name 定时任务模块
 */

// 获取定时任务列表
export const getTimingTaskListApi = async (params: TimingTask.ReqTimingTaskParams) => {
  logger.info("获取定时任务列表", { params });

  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === "development") {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      // 过滤任务数据
      let filteredTasks = [...mockTimingTasks];

      // 根据条件过滤
      if (params.taskName) {
        filteredTasks = filteredTasks.filter(task => task.taskName.includes(params.taskName));
      }
      if (params.taskType) {
        filteredTasks = filteredTasks.filter(task => task.taskType === params.taskType);
      }
      if (params.taskStatus) {
        filteredTasks = filteredTasks.filter(task => task.taskStatus === params.taskStatus);
      }
      if (params.creator) {
        filteredTasks = filteredTasks.filter(task => task.creator.includes(params.creator));
      }
      if (params.startTime && params.endTime) {
        filteredTasks = filteredTasks.filter(task => task.createTime >= params.startTime && task.createTime <= params.endTime);
      }

      // 分页处理
      const startIndex = (params.pageNum - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const pageTasks = filteredTasks.slice(startIndex, endIndex);

      const result: ResPage<TimingTask.ResTimingTaskList> = {
        list: pageTasks,
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        total: filteredTasks.length
      };

      logger.info("获取定时任务列表成功", {
        total: result.total,
        page: result.pageNum,
        pageSize: result.pageSize
      });

      return Promise.resolve({
        code: "200",
        msg: "success",
        data: result
      });
    }

    // 生产环境请求实际接口
    return http.post<ResPage<TimingTask.ResTimingTaskList>>(PORT1 + "/timingTask/list", params);
  } catch (error) {
    logger.error("获取定时任务列表失败", error as Error, { params });
    throw error;
  }
};

// 获取定时任务详情
export const getTimingTaskDetailApi = async (id: string) => {
  logger.info("获取定时任务详情", { id });

  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === "development") {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      const task = mockTimingTasks.find(task => task.id === id);

      if (!task) {
        throw new Error("定时任务不存在");
      }

      logger.info("获取定时任务详情成功", { id });

      return Promise.resolve({
        code: "200",
        msg: "success",
        data: task
      });
    }

    // 生产环境请求实际接口
    return http.get<ResultData<TimingTask.ResTimingTaskList>>(PORT1 + `/timingTask/detail/${id}`);
  } catch (error) {
    logger.error("获取定时任务详情失败", error as Error, { id });
    throw error;
  }
};

// 新增定时任务
export const addTimingTaskApi = async (params: TimingTask.ReqAddTimingTask) => {
  logger.info("新增定时任务", { params });

  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === "development") {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      const newTask: TimingTask.ResTimingTaskList = {
        id: Date.now().toString(),
        taskName: params.taskName,
        taskDescription: params.taskDescription || "",
        taskType: params.taskType,
        cronExpression: params.cronExpression,
        taskStatus: "running",
        lastExecuteTime: null,
        lastExecuteStatus: null,
        nextExecuteTime: new Date().toISOString().slice(0, 19).replace("T", " "),
        createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
        updateTime: new Date().toISOString().slice(0, 19).replace("T", " "),
        creator: "admin",
        updater: "admin"
      };

      mockTimingTasks.push(newTask);

      logger.info("新增定时任务成功", { id: newTask.id });

      return Promise.resolve({
        code: "200",
        msg: "新增成功",
        data: newTask
      });
    }

    // 生产环境请求实际接口
    return http.post<ResultData<TimingTask.ResTimingTaskList>>(PORT1 + "/timingTask/add", params);
  } catch (error) {
    logger.error("新增定时任务失败", error as Error, { params });
    throw error;
  }
};

// 编辑定时任务
export const editTimingTaskApi = async (params: TimingTask.ReqEditTimingTask) => {
  logger.info("编辑定时任务", { params });

  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === "development") {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      const taskIndex = mockTimingTasks.findIndex(task => task.id === params.id);

      if (taskIndex === -1) {
        throw new Error("定时任务不存在");
      }

      mockTimingTasks[taskIndex] = {
        ...mockTimingTasks[taskIndex],
        ...params,
        updateTime: new Date().toISOString().slice(0, 19).replace("T", " "),
        updater: "admin"
      };

      logger.info("编辑定时任务成功", { id: params.id });

      return Promise.resolve({
        code: "200",
        msg: "编辑成功",
        data: mockTimingTasks[taskIndex]
      });
    }

    // 生产环境请求实际接口
    return http.put<ResultData<TimingTask.ResTimingTaskList>>(PORT1 + "/timingTask/edit", params);
  } catch (error) {
    logger.error("编辑定时任务失败", error as Error, { params });
    throw error;
  }
};

// 删除定时任务
export const deleteTimingTaskApi = async (id: string) => {
  logger.info("删除定时任务", { id });

  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === "development") {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      const taskIndex = mockTimingTasks.findIndex(task => task.id === id);

      if (taskIndex === -1) {
        throw new Error("定时任务不存在");
      }

      mockTimingTasks.splice(taskIndex, 1);

      logger.info("删除定时任务成功", { id });

      return Promise.resolve({
        code: "200",
        msg: "删除成功"
      });
    }

    // 生产环境请求实际接口
    return http.delete<ResultData>(PORT1 + `/timingTask/delete/${id}`);
  } catch (error) {
    logger.error("删除定时任务失败", error as Error, { id });
    throw error;
  }
};

// 启动定时任务
export const startTimingTaskApi = async (id: string) => {
  logger.info("启动定时任务", { id });

  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === "development") {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      const task = mockTimingTasks.find(task => task.id === id);

      if (!task) {
        throw new Error("定时任务不存在");
      }

      task.taskStatus = "running";
      task.updateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
      task.updater = "admin";

      logger.info("启动定时任务成功", { id });

      return Promise.resolve({
        code: "200",
        msg: "启动成功"
      });
    }

    // 生产环境请求实际接口
    return http.post<ResultData>(PORT1 + `/timingTask/start/${id}`);
  } catch (error) {
    logger.error("启动定时任务失败", error as Error, { id });
    throw error;
  }
};

// 暂停定时任务
export const pauseTimingTaskApi = async (id: string) => {
  logger.info("暂停定时任务", { id });

  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === "development") {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      const task = mockTimingTasks.find(task => task.id === id);

      if (!task) {
        throw new Error("定时任务不存在");
      }

      task.taskStatus = "paused";
      task.updateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
      task.updater = "admin";

      logger.info("暂停定时任务成功", { id });

      return Promise.resolve({
        code: "200",
        msg: "暂停成功"
      });
    }

    // 生产环境请求实际接口
    return http.post<ResultData>(PORT1 + `/timingTask/pause/${id}`);
  } catch (error) {
    logger.error("暂停定时任务失败", error as Error, { id });
    throw error;
  }
};

// 立即执行定时任务
export const executeTimingTaskApi = async (id: string) => {
  logger.info("立即执行定时任务", { id });

  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === "development") {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      const task = mockTimingTasks.find(task => task.id === id);

      if (!task) {
        throw new Error("定时任务不存在");
      }

      task.lastExecuteTime = new Date().toISOString().slice(0, 19).replace("T", " ");
      task.lastExecuteStatus = "success";
      task.updateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
      task.updater = "admin";

      logger.info("立即执行定时任务成功", { id });

      return Promise.resolve({
        code: "200",
        msg: "执行成功"
      });
    }

    // 生产环境请求实际接口
    return http.post<ResultData>(PORT1 + `/timingTask/execute/${id}`);
  } catch (error) {
    logger.error("立即执行定时任务失败", error as Error, { id });
    throw error;
  }
};
