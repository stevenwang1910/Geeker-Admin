/**
 * 定时任务模块类型定义
 * @author
 * @since 2024-05-20
 */

/**
 * 定时任务优先级
 */
export type TaskPriority = 'high' | 'medium' | 'low'

/**
 * 任务状态
 */
export type TaskStatus = 'running' | 'paused' | 'stopped'

/**
 * 任务类型
 */
export type TaskType = 'http' | 'script' | 'custom'

/**
 * 调度类型
 */
export type ScheduleType = 'cron' | 'interval'

/**
 * 间隔时间单位
 */
export type IntervalUnit = 'seconds' | 'minutes' | 'hours' | 'days'

/**
 * 定时任务接口
 */
export interface TimingTask {
  /** 任务ID */
  id?: number | string
  /** 任务名称 */
  name: string
  /** 任务类型 */
  type: TaskType
  /** 任务优先级 */
  priority: TaskPriority
  /** 调度类型 */
  scheduleType: ScheduleType
  /** Cron表达式 */
  cronExpression?: string
  /** 间隔时间 */
  interval?: number
  /** 间隔时间单位 */
  intervalUnit?: IntervalUnit
  /** 任务配置JSON */
  config: string
  /** 重试次数 */
  retryCount?: number
  /** 重试间隔(秒) */
  retryInterval?: number
  /** 任务状态 */
  status?: TaskStatus
  /** 上次执行时间 */
  lastExecuteTime?: string
  /** 下次执行时间 */
  nextExecuteTime?: string
  /** 执行次数 */
  executeCount?: number
  /** 成功次数 */
  successCount?: number
  /** 失败次数 */
  failCount?: number
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 备注 */
  remark?: string
}

/**
 * 定时任务日志接口
 */
export interface TimingTaskLog {
  /** 日志ID */
  id: number | string
  /** 任务ID */
  taskId: number | string
  /** 执行时间 */
  executeTime: string
  /** 执行状态 */
  status: 'success' | 'fail'
  /** 执行时长(ms) */
  duration: number
  /** 执行信息 */
  message?: string
  /** 错误信息 */
  error?: string
  /** 创建时间 */
  createTime?: string
}

/**
 * Cron表达式验证结果
 */
export interface CronValidationResult {
  /** 是否有效 */
  valid: boolean
  /** 错误信息 */
  errorMessage?: string
  /** 下次执行时间列表 */
  nextExecutionTimes?: string[]
}