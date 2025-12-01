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

// SKU管理模块
export namespace Sku {
  // SKU列表查询参数
  export interface ReqSkuListParams extends ReqPage {
    product_id?: string;
    keyword?: string;
    status?: number;
  }
  // SKU详情参数
  export interface ReqSkuDetailParams {
    id: string;
  }
  // SKU保存参数
  export interface ReqSkuSaveParams {
    id?: string;
    productId: string;
    skuCode: string;
    skuName: string;
    status: number;
    sort?: number;
    remark?: string;
    specGroups: {
      name: string;
      values: string[];
    }[];
    skuCombinations: {
      specs: { [key: string]: string };
      imageUrl?: string;
      price: number;
      stock: number;
    }[];
  }
  // SKU状态切换参数
  export interface ReqSkuStatusParams {
    id: string;
    status: number;
  }
  // SKU列表响应数据
  export interface ResSkuList {
    id: string;
    skuCode: string;
    skuName: string;
    productName: string;
    status: number;
    price: number;
    stock: number;
    createTime: string;
  }
  // SKU详情响应数据
  export interface ResSkuDetail {
    id: string;
    productId: string;
    productName: string;
    skuCode: string;
    skuName: string;
    status: number;
    sort: number;
    remark: string;
    specGroups: {
      name: string;
      values: string[];
    }[];
    skuCombinations: {
      id?: string;
      specs: { [key: string]: string };
      imageUrl?: string;
      price: number;
      stock: number;
    }[];
  }
}
