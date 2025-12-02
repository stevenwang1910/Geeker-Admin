import type { SystemLog } from '@/api/interface';
import type { ResPage, ResultData } from '@/api/interface';
import { PORT1 } from '@/api/config/servicePort';
import http from '@/api';
import logger from '@/utils/logger';

// 模拟日志数据（实际项目中应该从服务端获取）
const mockLogs: SystemLog.ResLogList[] = [
  {
    id: '1',
    level: 'info',
    operationType: 'login',
    userId: 'user_123',
    username: 'admin',
    requestUrl: '/api/login',
    requestMethod: 'POST',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
    operationTime: '2024-01-15 10:30:00',
    executionTime: 150,
    statusCode: 200,
    module: '用户认证',
  },
  {
    id: '2',
    level: 'warn',
    operationType: 'query',
    userId: 'user_456',
    username: 'testuser',
    requestUrl: '/api/users/list',
    requestMethod: 'GET',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
    operationTime: '2024-01-15 11:20:00',
    executionTime: 200,
    statusCode: 200,
    module: '用户管理',
  },
  {
    id: '3',
    level: 'error',
    operationType: 'create',
    userId: 'user_123',
    username: 'admin',
    requestUrl: '/api/users/create',
    requestMethod: 'POST',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
    operationTime: '2024-01-15 14:15:00',
    executionTime: 300,
    statusCode: 500,
    errorMessage: '数据库连接失败',
    module: '用户管理',
  },
  {
    id: '4',
    level: 'info',
    operationType: 'logout',
    userId: 'user_123',
    username: 'admin',
    requestUrl: '/api/logout',
    requestMethod: 'POST',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
    operationTime: '2024-01-15 16:45:00',
    executionTime: 80,
    statusCode: 200,
    module: '用户认证',
  },
];

/**
 * @name 系统日志模块
 */

// 获取系统日志列表
export const getSystemLogListApi = async (params: SystemLog.ReqLogParams) => {
  logger.info('获取系统日志列表', { params });
  
  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === 'development') {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 过滤日志数据
      let filteredLogs = [...mockLogs];
      
      // 根据条件过滤
      if (params.level) {
        filteredLogs = filteredLogs.filter(log => log.level === params.level);
      }
      if (params.operationType) {
        filteredLogs = filteredLogs.filter(log => log.operationType === params.operationType);
      }
      if (params.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId.includes(params.userId));
      }
      if (params.username) {
        filteredLogs = filteredLogs.filter(log => 
          log.username.toLowerCase().includes(params.username.toLowerCase())
        );
      }
      if (params.requestUrl) {
        filteredLogs = filteredLogs.filter(log => 
          log.requestUrl.toLowerCase().includes(params.requestUrl.toLowerCase())
        );
      }
      if (params.startTime) {
        filteredLogs = filteredLogs.filter(log => 
          log.operationTime >= params.startTime
        );
      }
      if (params.endTime) {
        filteredLogs = filteredLogs.filter(log => 
          log.operationTime <= params.endTime
        );
      }
      
      // 分页处理
      const startIndex = (params.pageNum - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const pageLogs = filteredLogs.slice(startIndex, endIndex);
      
      const result: ResPage<SystemLog.ResLogList> = {
        list: pageLogs,
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        total: filteredLogs.length,
      };
      
      logger.info('获取系统日志列表成功', {
        total: result.total,
        page: result.pageNum,
        pageSize: result.pageSize,
      });
      
      return Promise.resolve({
        code: '200',
        msg: 'success',
        data: result,
      });
    }
    
    // 生产环境请求实际接口
    return http.post<ResPage<SystemLog.ResLogList>>(
      PORT1 + '/system/log/list',
      params
    );
  } catch (error) {
    logger.error('获取系统日志列表失败', error as Error, { params });
    throw error;
  }
};

// 导出系统日志
export const exportSystemLogApi = async (params: SystemLog.ReqLogParams) => {
  logger.info('导出系统日志', { params });
  
  try {
    // 如果是开发环境，返回模拟导出数据
    if (import.meta.env.MODE === 'development') {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('导出系统日志成功', {
        total: mockLogs.length,
        params,
      });
      
      return Promise.resolve({
        code: '200',
        msg: '导出成功',
        data: {
          fileUrl: 'https://example.com/logs_export.xlsx',
          fileName: `system_logs_${Date.now()}.xlsx`,
        },
      });
    }
    
    // 生产环境请求实际接口
    return http.post<ResultData<{ fileUrl: string; fileName: string }>>(
      PORT1 + '/system/log/export',
      params,
      { responseType: 'blob' }
    );
  } catch (error) {
    logger.error('导出系统日志失败', error as Error, { params });
    throw error;
  }
};

// 清空系统日志
export const clearSystemLogApi = async () => {
  logger.info('清空系统日志');
  
  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === 'development') {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      logger.info('清空系统日志成功');
      
      return Promise.resolve({
        code: '200',
        msg: '清空成功',
      });
    }
    
    // 生产环境请求实际接口
    return http.post(PORT1 + '/system/log/clear');
  } catch (error) {
    logger.error('清空系统日志失败', error as Error);
    throw error;
  }
};

// 删除系统日志
export const deleteSystemLogApi = async (ids: string[]) => {
  logger.info('删除系统日志', { ids });
  
  try {
    // 如果是开发环境，返回模拟数据
    if (import.meta.env.MODE === 'development') {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      logger.info('删除系统日志成功', { ids });
      
      return Promise.resolve({
        code: '200',
        msg: '删除成功',
      });
    }
    
    // 生产环境请求实际接口
    return http.post(PORT1 + '/system/log/delete', { ids });
  } catch (error) {
    logger.error('删除系统日志失败', error as Error, { ids });
    throw error;
  }
};