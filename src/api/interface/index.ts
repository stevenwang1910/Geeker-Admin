// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    access_token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}

// 系统日志模块
export namespace SystemLog {
  // 日志级别类型
  export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
  
  // 操作类型
  export type OperationType = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'query' | 'export' | 'import';
  
  // 日志请求参数
  export interface ReqLogParams extends ReqPage {
    level?: LogLevel;
    operationType?: OperationType;
    userId?: string;
    username?: string;
    startTime?: string;
    endTime?: string;
    requestUrl?: string;
  }
  
  // 日志响应数据
  export interface ResLogList {
    id: string;
    level: LogLevel;
    operationType: OperationType;
    userId: string;
    username: string;
    requestUrl: string;
    requestMethod: string;
    requestParams?: Record<string, any>;
    responseData?: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    operationTime: string;
    executionTime?: number; // 执行时间(ms)
    statusCode?: number;
    errorMessage?: string;
    module?: string; // 模块名称
  }
  
  // 日志记录参数（用于服务端记录）
  export interface ReqLogRecord {
    level: LogLevel;
    operationType: OperationType;
    message: string;
    userId?: string;
    username?: string;
    requestUrl?: string;
    requestMethod?: string;
    requestParams?: Record<string, any>;
    responseData?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    executionTime?: number;
    statusCode?: number;
    errorMessage?: string;
    module?: string;
  }
}

// 定时任务模块
export * from './timingTask';
