/**
 * 定时任务模块API
 * @author
 * @since 2024-05-20
 */

import http from '@/api'
import { TimingTask, TimingTaskLog } from '@/api/interface/timingTask'

/**
 * 获取定时任务列表
 * @param params 查询参数
 * @returns 任务列表
 */
export const getTimingTaskList = (params?: Partial<TimingTask>) => {
  return http.get<TimingTask[]>('/api/system/timingTask', params)
}

/**
 * 获取定时任务详情
 * @param id 任务ID
 * @returns 任务详情
 */
export const getTimingTaskDetail = (id: number | string) => {
  return http.get<TimingTask>(`/api/system/timingTask/${id}`)
}

/**
 * 新增定时任务
 * @param data 任务数据
 * @returns 新增的任务
 */
export const addTimingTask = (data: TimingTask) => {
  return http.post<TimingTask>('/api/system/timingTask', data)
}

/**
 * 更新定时任务
 * @param id 任务ID
 * @param data 更新的任务数据
 * @returns 更新后的任务
 */
export const updateTimingTask = (id: number | string, data: Partial<TimingTask>) => {
  return http.put<TimingTask>(`/api/system/timingTask/${id}`, data)
}

/**
 * 删除定时任务
 * @param id 任务ID
 * @returns 删除结果
 */
export const deleteTimingTask = (id: number | string) => {
  return http.delete(`/api/system/timingTask/${id}`)
}

/**
 * 执行定时任务
 * @param id 任务ID
 * @returns 执行结果
 */
export const runTimingTask = (id: number | string) => {
  return http.post(`/api/system/timingTask/${id}/run`)
}

/**
 * 暂停定时任务
 * @param id 任务ID
 * @returns 暂停结果
 */
export const pauseTimingTask = (id: number | string) => {
  return http.post(`/api/system/timingTask/${id}/pause`)
}

/**
 * 恢复定时任务
 * @param id 任务ID
 * @returns 恢复结果
 */
export const resumeTimingTask = (id: number | string) => {
  return http.post(`/api/system/timingTask/${id}/resume`)
}

/**
 * 获取定时任务日志
 * @param id 任务ID
 * @param params 查询参数
 * @returns 任务日志列表
 */
export const getTimingTaskLogs = (id: number | string, params?: any) => {
  return http.get<TimingTaskLog[]>(`/api/system/timingTask/${id}/logs`, params)
}

/**
 * 验证Cron表达式
 * @param cronExpression Cron表达式
 * @returns 验证结果
 */
export const validateCronExpression = (cronExpression: string) => {
  return http.post('/api/system/timingTask/validateCron', { cronExpression })
}