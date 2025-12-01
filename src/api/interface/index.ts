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

// 字典管理模块
export namespace Dict {
  // 字典类型请求参数
  export interface ReqDictTypeParams extends ReqPage {
    dictName: string;
    dictType: string;
    status: number;
    createTime: string[];
  }
  // 字典类型响应数据
  export interface ResDictTypeList {
    id: string;
    dictName: string;
    dictType: string;
    status: number;
    remark: string;
    createTime: string;
    updateTime: string;
  }
  // 字典项请求参数
  export interface ReqDictItemParams extends ReqPage {
    dictId: string;
    dictLabel: string;
    dictValue: string;
    status: number;
  }
  // 字典项响应数据
  export interface ResDictItemList {
    id: string;
    dictId: string;
    dictLabel: string;
    dictValue: string;
    status: number;
    sort: number;
    parentId: string;
    remark: string;
    createTime: string;
    updateTime: string;
    children?: ResDictItemList[];
  }
  // 字典变更历史响应数据
  export interface ResDictHistory {
    id: string;
    dictType: string;
    operateType: string;
    operateContent: string;
    operator: string;
    operateTime: string;
  }
}
