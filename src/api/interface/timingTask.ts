/**
 * 定时任务模块类型定义
 */

export namespace TimingTask {
  // 定时任务类型
  export type TaskType = 'database_backup' | 'email_send' | 'data_sync' | 'log_clean' | 'other';
  
  // 定时任务状态
  export type TaskStatus = 'running' | 'paused' | 'completed' | 'failed';
  
  // 定时任务执行状态
  export type ExecuteStatus = 'success' | 'failed' | null;
  
  // 定时任务请求参数（分页）
  export interface ReqTimingTaskParams extends ReqPage {
    taskName?: string; // 任务名称（模糊搜索）
    taskType?: TaskType; // 任务类型
    taskStatus?: TaskStatus; // 任务状态
    creator?: string; // 创建者（模糊搜索）
    startTime?: string; // 创建开始时间
    endTime?: string; // 创建结束时间
  }
  
  // 定时任务响应数据
  export interface ResTimingTaskList {
    id: string; // 任务ID
    taskName: string; // 任务名称
    taskDescription?: string; // 任务描述
    taskType: TaskType; // 任务类型
    cronExpression: string; // Cron表达式
    taskStatus: TaskStatus; // 任务状态
    lastExecuteTime: string | null; // 上次执行时间
    lastExecuteStatus: ExecuteStatus; // 上次执行状态
    nextExecuteTime: string; // 下次执行时间
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
    creator: string; // 创建者
    updater: string; // 更新者
  }
  
  // 新增定时任务请求参数
  export interface ReqAddTimingTask {
    taskName: string; // 任务名称
    taskDescription?: string; // 任务描述
    taskType: TaskType; // 任务类型
    cronExpression: string; // Cron表达式
  }
  
  // 编辑定时任务请求参数
  export interface ReqEditTimingTask {
    id: string; // 任务ID
    taskName?: string; // 任务名称
    taskDescription?: string; // 任务描述
    taskType?: TaskType; // 任务类型
    cronExpression?: string; // Cron表达式
    taskStatus?: TaskStatus; // 任务状态
  }
}

// 导入公共类型定义
type ReqPage = import('./index').ReqPage;