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
    typeName: string;
    typeCode: string;
    status: number;
    createTime: string[];
  }
  // 字典类型响应参数
  export interface ResDictTypeList {
    id: string;
    typeName: string;
    typeCode: string;
    description: string;
    status: number;
    createTime: string;
    updateTime: string;
  }
  // 新增字典类型请求参数
  export interface ReqAddDictType {
    typeName: string;
    typeCode: string;
    description: string;
    status: number;
  }
  // 编辑字典类型请求参数
  export interface ReqEditDictType extends ReqAddDictType {
    id: string;
  }
  // 字典项请求参数
  export interface ReqDictItemParams extends ReqPage {
    typeId: string;
    itemName: string;
    itemValue: string;
    status: number;
    createTime: string[];
  }
  // 字典项响应参数
  export interface ResDictItemList {
    id: string;
    typeId: string;
    typeCode: string;
    itemName: string;
    itemValue: string;
    parentId: string;
    sort: number;
    description: string;
    status: number;
    createTime: string;
    updateTime: string;
    children?: ResDictItemList[];
  }
  // 字典项树形响应参数
  export interface ResDictItemTree extends ResDictItemList {
    children?: ResDictItemTree[];
  }
  // 新增字典项请求参数
  export interface ReqAddDictItem {
    typeId: string;
    itemName: string;
    itemValue: string;
    parentId: string;
    sort: number;
    description: string;
    status: number;
  }
  // 编辑字典项请求参数
  export interface ReqEditDictItem extends ReqAddDictItem {
    id: string;
  }
  // 字典历史记录请求参数
  export interface ReqDictHistoryParams extends ReqPage {
    dictId: string;
    dictType: string;
    operator: string;
    createTime: string[];
  }
  // 字典历史记录响应参数
  export interface ResDictHistory {
    id: string;
    dictId: string;
    dictType: string;
    beforeData: string;
    afterData: string;
    operator: string;
    operateTime: string;
    description: string;
  }
  // 字典权限响应参数
  export interface ResDictPermission {
    id: string;
    dictId: string;
    roleId: string;
    roleName: string;
    permissionType: string;
    createTime: string;
  }
  // 设置字典权限请求参数
  export interface ReqSetDictPermission {
    dictId: string;
    roleIds: string[];
    permissionType: string;
  }
}
