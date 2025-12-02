// 定时任务模块
export namespace TimingTask {
  // 定时任务类型枚举
  export enum TaskType {
    CRON = 'cron',
    INTERVAL = 'interval',
    ONCE = 'once'
  }

  // 任务状态枚举
  export enum TaskStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
  }

  // 任务优先级枚举
  export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
  }

  // 定时任务请求参数
  export interface ReqTimingTask {
    id?: string;
    name: string;
    description?: string;
    type: TaskType;
    cronExpression?: string;
    interval?: number; // 毫秒数
    executeTime?: string; // ISO时间格式
    priority: TaskPriority;
    maxRetries: number;
    retryDelay: number; // 毫秒数
    isEnabled: boolean;
    taskData?: Record<string, any>;
  }

  // 定时任务响应数据
  export interface ResTimingTask {
    id: string;
    name: string;
    description?: string;
    type: TaskType;
    cronExpression?: string;
    interval?: number;
    executeTime?: string;
    priority: TaskPriority;
    maxRetries: number;
    retryDelay: number;
    isEnabled: boolean;
    status: TaskStatus;
    lastExecutionTime?: string;
    nextExecutionTime?: string;
    executionCount: number;
    failureCount: number;
    taskData?: Record<string, any>;
    createTime: string;
    updateTime: string;
    createdBy: string;
    updatedBy: string;
  }

  // 任务执行日志
  export interface ResTaskLog {
    id: string;
    taskId: string;
    taskName: string;
    status: TaskStatus;
    startTime: string;
    endTime?: string;
    duration?: number; // 毫秒数
    errorMessage?: string;
    errorStack?: string;
    executionData?: Record<string, any>;
    retryCount: number;
    createTime: string;
  }

  // 任务统计信息
  export interface ResTaskStats {
    totalTasks: number;
    runningTasks: number;
    completedTasks: number;
    failedTasks: number;
    pendingTasks: number;
    executionRate: number;
    failureRate: number;
    averageDuration: number;
  }

  // 分页请求参数
  export interface ReqTaskParams {
    pageNum: number;
    pageSize: number;
    name?: string;
    status?: TaskStatus;
    type?: TaskType;
    priority?: TaskPriority;
    createTime?: string[];
  }

  // 日志分页请求参数
  export interface ReqLogParams {
    pageNum: number;
    pageSize: number;
    taskId?: string;
    status?: TaskStatus;
    startTime?: string;
    endTime?: string;
  }
}