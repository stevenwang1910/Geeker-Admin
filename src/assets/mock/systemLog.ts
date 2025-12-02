// 系统日志Mock数据
import { ReqSystemLogList, ResSystemLogList } from '@/api/modules/systemLog';

// 模拟系统日志数据
const mockSystemLogs = [
  {
    id: '1',
    userId: '1',
    username: 'admin',
    operation: '登录系统',
    level: 'info',
    ip: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    requestUrl: '/api/auth/login',
    requestMethod: 'POST',
    requestParams: '{"username":"admin","password":"123456"}',
    responseData: '{"code":0,"msg":"登录成功","data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}}',
    errorMsg: '',
    createdAt: '2024-05-20 10:00:00',
    updatedAt: '2024-05-20 10:00:00'
  },
  {
    id: '2',
    userId: '1',
    username: 'admin',
    operation: '查询用户列表',
    level: 'info',
    ip: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    requestUrl: '/api/user/list',
    requestMethod: 'GET',
    requestParams: '{"pageNum":1,"pageSize":10}',
    responseData: '{"code":0,"msg":"查询成功","data":{"list":[],"total":0}}',
    errorMsg: '',
    createdAt: '2024-05-20 10:05:00',
    updatedAt: '2024-05-20 10:05:00'
  },
  {
    id: '3',
    userId: '1',
    username: 'admin',
    operation: '修改用户信息',
    level: 'warn',
    ip: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    requestUrl: '/api/user/update',
    requestMethod: 'POST',
    requestParams: '{"id":"1","username":"admin","email":"admin@example.com"}',
    responseData: '{"code":0,"msg":"修改成功"}',
    errorMsg: '',
    createdAt: '2024-05-20 10:10:00',
    updatedAt: '2024-05-20 10:10:00'
  },
  {
    id: '4',
    userId: '2',
    username: 'user1',
    operation: '删除用户',
    level: 'error',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    requestUrl: '/api/user/delete',
    requestMethod: 'POST',
    requestParams: '{"id":"3"}',
    responseData: '{"code":1,"msg":"无权限删除用户"}',
    errorMsg: '无权限删除用户',
    createdAt: '2024-05-20 10:15:00',
    updatedAt: '2024-05-20 10:15:00'
  }
];

// 模拟获取系统日志列表
export const mockGetSystemLogList = (params: ReqSystemLogList): ResSystemLogList => {
  let filteredLogs = mockSystemLogs;

  // 按照用户名筛选
  if (params.username) {
    filteredLogs = filteredLogs.filter(log => log.username.includes(params.username));
  }

  // 按照操作类型筛选
  if (params.operation) {
    filteredLogs = filteredLogs.filter(log => log.operation.includes(params.operation));
  }

  // 按照日志级别筛选
  if (params.level) {
    filteredLogs = filteredLogs.filter(log => log.level === params.level);
  }

  // 分页处理
  const startIndex = (params.pageNum - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  return {
    list: paginatedLogs,
    total: filteredLogs.length
  };
};

// 模拟删除系统日志
export const mockDeleteSystemLog = (params: { id: string[] }): boolean => {
  // 这里只是模拟删除，实际上并没有修改mock数据
  return true;
};

// 模拟清空系统日志
export const mockClearSystemLog = (): boolean => {
  // 这里只是模拟清空，实际上并没有修改mock数据
  return true;
};

// 模拟导出系统日志
export const mockExportSystemLog = (params: ReqSystemLogList): Blob => {
  // 这里只是模拟导出，实际上并没有生成真实的文件
  const data = JSON.stringify(mockGetSystemLogList(params), null, 2);
  return new Blob([data], { type: 'application/json' });
};
