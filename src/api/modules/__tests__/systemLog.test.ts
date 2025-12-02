import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { 
  getSystemLogListApi, 
  exportSystemLogApi, 
  clearSystemLogApi, 
  deleteSystemLogApi 
} from '../systemLog';

describe('System Log API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 设置Pinia测试环境
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('getSystemLogListApi', () => {
    it('should return log list without parameters', async () => {
      const result = await getSystemLogListApi();
      
      expect(result).toHaveProperty('code', 200);
      expect(result).toHaveProperty('data');
      expect(result.data).toBeInstanceOf(Array);
    });

    it('should filter logs by log level', async () => {
      const params = { logLevel: 'WARN' };
      const result = await getSystemLogListApi(params);
      
      expect(result).toHaveProperty('code', 200);
      expect(result.data).toBeInstanceOf(Array);
      // All returned logs should have level 'WARN'
      result.data.forEach((log: any) => {
        expect(log.logLevel).toBe('WARN');
      });
    });

    it('should filter logs by operation type', async () => {
      const params = { operationType: 'API_REQUEST' };
      const result = await getSystemLogListApi(params);
      
      expect(result).toHaveProperty('code', 200);
      expect(result.data).toBeInstanceOf(Array);
      // All returned logs should have operationType 'API_REQUEST'
      result.data.forEach((log: any) => {
        expect(log.operationType).toBe('API_REQUEST');
      });
    });

    it('should filter logs by username', async () => {
      const params = { username: 'admin' };
      const result = await getSystemLogListApi(params);
      
      expect(result).toHaveProperty('code', 200);
      expect(result.data).toBeInstanceOf(Array);
      // All returned logs should match username 'admin'
      result.data.forEach((log: any) => {
        expect(log.username).toBe('admin');
      });
    });

    it('should filter logs by date range', async () => {
      const params = { startTime: '2024-01-01', endTime: '2024-01-31' };
      const result = await getSystemLogListApi(params);
      
      expect(result).toHaveProperty('code', 200);
      expect(result.data).toBeInstanceOf(Array);
      // All returned logs should be within the date range
      result.data.forEach((log: any) => {
        expect(new Date(log.timestamp) >= new Date(params.startTime)).toBe(true);
        expect(new Date(log.timestamp) <= new Date(params.endTime)).toBe(true);
      });
    });

    it('should handle combined filters correctly', async () => {
      const params = { 
        logLevel: 'ERROR', 
        username: 'admin',
        startTime: '2024-01-01',
        endTime: '2024-01-31'
      };
      const result = await getSystemLogListApi(params);
      
      expect(result).toHaveProperty('code', 200);
      expect(result.data).toBeInstanceOf(Array);
      // All returned logs should match all filters
      result.data.forEach((log: any) => {
        expect(log.logLevel).toBe('ERROR');
        expect(log.username).toBe('admin');
        expect(new Date(log.timestamp) >= new Date(params.startTime)).toBe(true);
        expect(new Date(log.timestamp) <= new Date(params.endTime)).toBe(true);
      });
    });
  });

  describe('exportSystemLogApi', () => {
    it('should return export success message', async () => {
      const params = { logLevel: 'INFO' };
      const result = await exportSystemLogApi(params);
      
      expect(result).toHaveProperty('code', 200);
      expect(result).toHaveProperty('message', '日志导出成功');
    });

    it('should export all logs when no parameters provided', async () => {
      const result = await exportSystemLogApi();
      
      expect(result).toHaveProperty('code', 200);
      expect(result).toHaveProperty('message', '日志导出成功');
    });
  });

  describe('clearSystemLogApi', () => {
    it('should return clear success message', async () => {
      const result = await clearSystemLogApi();
      
      expect(result).toHaveProperty('code', 200);
      expect(result).toHaveProperty('message', '系统日志已清空');
    });
  });

  // describe('deleteSystemLogApi', () => {
  //   it('should return delete success message for single log', async () => {
  //     const logIds = ['log-1'];
  //     const result = await deleteSystemLogApi(logIds);

  //     expect(result).toHaveProperty('code', 200);
  //     expect(result).toHaveProperty('message', '删除系统日志成功');
  //   });

  //   it('should return delete success message for multiple logs', async () => {
  //     const logIds = ['log-1', 'log-2', 'log-3'];
  //     const result = await deleteSystemLogApi(logIds);

  //     expect(result).toHaveProperty('code', 200);
  //     expect(result).toHaveProperty('message', '删除系统日志成功');
  //   });
  // });
});