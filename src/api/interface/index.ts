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

// 工单管理模块
export namespace Ticket {
  // 工单优先级
  export enum Priority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    URGENT = 4
  }

  // 工单状态
  export enum Status {
    PENDING = 1,
    PROCESSING = 2,
    RESOLVED = 3,
    CLOSED = 4
  }

  // 工单查询参数
  export interface ReqTicketParams extends ReqPage {
    ticketNo?: string;
    customerName?: string;
    customerPhone?: string;
    priority?: Priority;
    status?: Status;
    createTime?: string[];
    assigneeId?: string;
  }

  // 工单基本信息
  export interface ResTicketList {
    id: string;
    ticketNo: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    priority: Priority;
    status: Status;
    title: string;
    description: string;
    attachments?: string[];
    assigneeId?: string;
    assigneeName?: string;
    createTime: string;
    updateTime: string;
    resolveTime?: string;
    closeTime?: string;
  }

  // 工单详情
  export interface ResTicketDetail extends ResTicketList {
    processingRecords: ProcessingRecord[];
  }

  // 处理记录
  export interface ProcessingRecord {
    id: string;
    ticketId: string;
    processorId: string;
    processorName: string;
    processTime: string;
    content: string;
    result?: string;
    attachments?: string[];
  }

  // 新增/编辑工单参数
  export interface ReqTicketForm {
    id?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    priority: Priority;
    title: string;
    description: string;
    attachments?: string[];
    assigneeId?: string;
  }

  // 处理工单参数
  export interface ReqProcessTicket {
    ticketId: string;
    status: Status;
    content: string;
    result?: string;
    attachments?: string[];
  }

  // 工单优先级字典
  export interface ResPriority {
    label: string;
    value: Priority;
  }

  // 工单状态字典
  export interface ResStatus {
    label: string;
    value: Status;
  }
}
