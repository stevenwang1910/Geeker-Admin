import request from '@/api/config/request'

// 获取定时任务列表
export const getTimingTaskList = (params: any) => {
  return request({
    url: '/timingTask/list',
    method: 'get',
    params
  })
}

// 创建定时任务
export const createTimingTask = (data: any) => {
  return request({
    url: '/timingTask/create',
    method: 'post',
    data
  })
}

// 更新定时任务
export const updateTimingTask = (data: any) => {
  return request({
    url: '/timingTask/update',
    method: 'put',
    data
  })
}

// 删除定时任务
export const deleteTimingTask = (id: number) => {
  return request({
    url: `/timingTask/delete/${id}`,
    method: 'delete'
  })
}

// 批量删除定时任务
export const batchDeleteTimingTask = (ids: number[]) => {
  return request({
    url: '/timingTask/batchDelete',
    method: 'delete',
    data: ids
  })
}

// 启动定时任务
export const startTimingTask = (id: number) => {
  return request({
    url: `/timingTask/start/${id}`,
    method: 'put'
  })
}

// 停止定时任务
export const stopTimingTask = (id: number) => {
  return request({
    url: `/timingTask/stop/${id}`,
    method: 'put'
  })
}";
