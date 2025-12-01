import { Dict } from "@/api/interface/index";
import { ResultData } from "@/api/interface/index";
import { ResPage } from "@/api/interface/index";

// 模拟字典类型数据
const mockDictTypes: Dict.ResDictTypeList[] = [
  {
    id: "1",
    typeName: "用户状态",
    typeCode: "user_status",
    description: "用户状态字典",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "2",
    typeName: "用户性别",
    typeCode: "user_gender",
    description: "用户性别字典",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "3",
    typeName: "部门类型",
    typeCode: "dept_type",
    description: "部门类型字典",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "4",
    typeName: "角色类型",
    typeCode: "role_type",
    description: "角色类型字典",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "5",
    typeName: "菜单类型",
    typeCode: "menu_type",
    description: "菜单类型字典",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  }
];

// 模拟字典项数据
const mockDictItems: Dict.ResDictItemList[] = [
  // 用户状态字典项
  {
    id: "1",
    typeId: "1",
    typeCode: "user_status",
    itemName: "正常",
    itemValue: "1",
    parentId: "",
    sort: 1,
    description: "用户正常状态",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "2",
    typeId: "1",
    typeCode: "user_status",
    itemName: "禁用",
    itemValue: "2",
    parentId: "",
    sort: 2,
    description: "用户禁用状态",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "3",
    typeId: "1",
    typeCode: "user_status",
    itemName: "删除",
    itemValue: "3",
    parentId: "",
    sort: 3,
    description: "用户删除状态",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  // 用户性别字典项
  {
    id: "4",
    typeId: "2",
    typeCode: "user_gender",
    itemName: "男",
    itemValue: "1",
    parentId: "",
    sort: 1,
    description: "男性用户",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "5",
    typeId: "2",
    typeCode: "user_gender",
    itemName: "女",
    itemValue: "2",
    parentId: "",
    sort: 2,
    description: "女性用户",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "6",
    typeId: "2",
    typeCode: "user_gender",
    itemName: "未知",
    itemValue: "3",
    parentId: "",
    sort: 3,
    description: "未知性别用户",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  // 部门类型字典项
  {
    id: "7",
    typeId: "3",
    typeCode: "dept_type",
    itemName: "总部",
    itemValue: "1",
    parentId: "",
    sort: 1,
    description: "公司总部",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "8",
    typeId: "3",
    typeCode: "dept_type",
    itemName: "分公司",
    itemValue: "2",
    parentId: "",
    sort: 2,
    description: "公司分公司",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "9",
    typeId: "3",
    typeCode: "dept_type",
    itemName: "办事处",
    itemValue: "3",
    parentId: "",
    sort: 3,
    description: "公司办事处",
    status: 1,
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  }
];

// 模拟字典历史记录数据
const mockDictHistory: Dict.ResDictHistory[] = [
  {
    id: "1",
    dictId: "1",
    dictType: "type",
    beforeData: JSON.stringify(mockDictTypes[0]),
    afterData: JSON.stringify({ ...mockDictTypes[0], description: "用户状态字典（修改后）" }),
    operator: "admin",
    operateTime: "2023-01-02 10:00:00",
    description: "修改用户状态字典描述"
  },
  {
    id: "2",
    dictId: "1",
    dictType: "item",
    beforeData: JSON.stringify(mockDictItems[0]),
    afterData: JSON.stringify({ ...mockDictItems[0], itemName: "正常（修改后）" }),
    operator: "admin",
    operateTime: "2023-01-03 10:00:00",
    description: "修改用户正常状态字典项名称"
  },
  {
    id: "3",
    dictId: "2",
    dictType: "type",
    beforeData: "",
    afterData: JSON.stringify(mockDictTypes[1]),
    operator: "admin",
    operateTime: "2023-01-01 10:00:00",
    description: "新增用户性别字典"
  }
];

// 模拟字典权限数据
const mockDictPermission: Dict.ResDictPermission[] = [
  {
    id: "1",
    dictId: "1",
    roleId: "1",
    roleName: "超级管理员",
    permissionType: "all",
    createTime: "2023-01-01 10:00:00"
  },
  {
    id: "2",
    dictId: "1",
    roleId: "2",
    roleName: "管理员",
    permissionType: "read",
    createTime: "2023-01-01 10:00:00"
  },
  {
    id: "3",
    dictId: "2",
    roleId: "1",
    roleName: "超级管理员",
    permissionType: "all",
    createTime: "2023-01-01 10:00:00"
  }
];

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟获取字典类型列表
export const mockGetDictTypeList = async (params: Dict.ReqDictTypeParams): Promise<ResultData<ResPage<Dict.ResDictTypeList>>> => {
  await delay(500);

  let filteredData = [...mockDictTypes];

  // 过滤条件
  if (params.typeName) {
    filteredData = filteredData.filter(item => item.typeName.includes(params.typeName));
  }
  if (params.typeCode) {
    filteredData = filteredData.filter(item => item.typeCode.includes(params.typeCode));
  }
  if (params.status !== undefined) {
    filteredData = filteredData.filter(item => item.status === params.status);
  }
  if (params.createTime && params.createTime.length === 2) {
    filteredData = filteredData.filter(item => {
      const createTime = new Date(item.createTime);
      const startDate = new Date(params.createTime[0]);
      const endDate = new Date(params.createTime[1]);
      return createTime >= startDate && createTime <= endDate;
    });
  }

  // 分页
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    code: "0",
    msg: "success",
    data: {
      list: paginatedData,
      pageNum,
      pageSize,
      total: filteredData.length
    }
  };
};

// 模拟新增字典类型
export const mockAddDictType = async (params: Dict.ReqAddDictType): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.typeName || !params.typeCode) {
    return {
      code: "1",
      msg: "字典名称和字典编码不能为空",
      data: null
    };
  }

  // 模拟字典编码重复
  if (mockDictTypes.some(item => item.typeCode === params.typeCode)) {
    return {
      code: "1",
      msg: "字典编码已存在",
      data: null
    };
  }

  // 模拟新增字典类型
  const newDictType: Dict.ResDictTypeList = {
    id: Date.now().toString(),
    typeName: params.typeName,
    typeCode: params.typeCode,
    description: params.description || "",
    status: params.status || 1,
    createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
    updateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
  };

  mockDictTypes.push(newDictType);

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟编辑字典类型
export const mockEditDictType = async (params: Dict.ReqEditDictType): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.id || !params.typeName || !params.typeCode) {
    return {
      code: "1",
      msg: "字典ID、字典名称和字典编码不能为空",
      data: null
    };
  }

  // 模拟字典编码重复（排除当前字典）
  if (mockDictTypes.some(item => item.typeCode === params.typeCode && item.id !== params.id)) {
    return {
      code: "1",
      msg: "字典编码已存在",
      data: null
    };
  }

  // 模拟编辑字典类型
  const index = mockDictTypes.findIndex(item => item.id === params.id);
  if (index === -1) {
    return {
      code: "1",
      msg: "字典类型不存在",
      data: null
    };
  }

  mockDictTypes[index] = {
    ...mockDictTypes[index],
    typeName: params.typeName,
    typeCode: params.typeCode,
    description: params.description || "",
    status: params.status || 1,
    updateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
  };

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟删除字典类型
export const mockDeleteDictType = async (params: { id: string[] }): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.id || params.id.length === 0) {
    return {
      code: "1",
      msg: "字典ID不能为空",
      data: null
    };
  }

  // 模拟删除字典类型
  for (const id of params.id) {
    const index = mockDictTypes.findIndex(item => item.id === id);
    if (index !== -1) {
      mockDictTypes.splice(index, 1);

      // 同时删除该字典类型下的所有字典项
      const itemIndices = mockDictItems.reduce((acc, item, index) => {
        if (item.typeId === id) {
          acc.push(index);
        }
        return acc;
      }, [] as number[]);

      // 从后往前删除，避免索引混乱
      for (const index of itemIndices.reverse()) {
        mockDictItems.splice(index, 1);
      }
    }
  }

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟切换字典类型状态
export const mockChangeDictTypeStatus = async (params: { id: string; status: number }): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.id || params.status === undefined) {
    return {
      code: "1",
      msg: "字典ID和状态不能为空",
      data: null
    };
  }

  // 模拟切换字典类型状态
  const index = mockDictTypes.findIndex(item => item.id === params.id);
  if (index === -1) {
    return {
      code: "1",
      msg: "字典类型不存在",
      data: null
    };
  }

  mockDictTypes[index].status = params.status;
  mockDictTypes[index].updateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

  // 同时切换该字典类型下的所有字典项状态
  for (const item of mockDictItems) {
    if (item.typeId === params.id) {
      item.status = params.status;
      item.updateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    }
  }

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟获取字典项列表
export const mockGetDictItemList = async (params: Dict.ReqDictItemParams): Promise<ResultData<ResPage<Dict.ResDictItemList>>> => {
  await delay(500);

  let filteredData = [...mockDictItems];

  // 过滤条件
  if (params.typeId) {
    filteredData = filteredData.filter(item => item.typeId === params.typeId);
  }
  if (params.itemName) {
    filteredData = filteredData.filter(item => item.itemName.includes(params.itemName));
  }
  if (params.itemValue) {
    filteredData = filteredData.filter(item => item.itemValue.includes(params.itemValue));
  }
  if (params.status !== undefined) {
    filteredData = filteredData.filter(item => item.status === params.status);
  }
  if (params.createTime && params.createTime.length === 2) {
    filteredData = filteredData.filter(item => {
      const createTime = new Date(item.createTime);
      const startDate = new Date(params.createTime[0]);
      const endDate = new Date(params.createTime[1]);
      return createTime >= startDate && createTime <= endDate;
    });
  }

  // 分页
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    code: "0",
    msg: "success",
    data: {
      list: paginatedData,
      pageNum,
      pageSize,
      total: filteredData.length
    }
  };
};

// 模拟获取字典项树形列表
export const mockGetDictItemTreeList = async (params: { typeId: string }): Promise<ResultData<Dict.ResDictItemTree[]>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.typeId) {
    return {
      code: "1",
      msg: "字典类型ID不能为空",
      data: []
    };
  }

  // 模拟获取字典项树形列表
  const filteredData = mockDictItems.filter(item => item.typeId === params.typeId);

  // 构建树形结构
  const buildTree = (data: Dict.ResDictItemList[], parentId: string = ""): Dict.ResDictItemTree[] => {
    return data
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildTree(data, item.id)
      }));
  };

  const treeData = buildTree(filteredData);

  return {
    code: "0",
    msg: "success",
    data: treeData
  };
};

// 模拟新增字典项
export const mockAddDictItem = async (params: Dict.ReqAddDictItem): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.typeId || !params.itemName || !params.itemValue) {
    return {
      code: "1",
      msg: "字典类型ID、字典项名称和字典项值不能为空",
      data: null
    };
  }

  // 模拟字典项值重复（同一字典类型下）
  if (mockDictItems.some(item => item.typeId === params.typeId && item.itemValue === params.itemValue)) {
    return {
      code: "1",
      msg: "字典项值已存在",
      data: null
    };
  }

  // 模拟新增字典项
  const newDictItem: Dict.ResDictItemList = {
    id: Date.now().toString(),
    typeId: params.typeId,
    typeCode: mockDictTypes.find(item => item.id === params.typeId)?.typeCode || "",
    itemName: params.itemName,
    itemValue: params.itemValue,
    parentId: params.parentId || "",
    sort: params.sort || 0,
    description: params.description || "",
    status: params.status || 1,
    createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
    updateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
  };

  mockDictItems.push(newDictItem);

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟编辑字典项
export const mockEditDictItem = async (params: Dict.ReqEditDictItem): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.id || !params.typeId || !params.itemName || !params.itemValue) {
    return {
      code: "1",
      msg: "字典项ID、字典类型ID、字典项名称和字典项值不能为空",
      data: null
    };
  }

  // 模拟字典项值重复（同一字典类型下，排除当前字典项）
  if (mockDictItems.some(item => item.typeId === params.typeId && item.itemValue === params.itemValue && item.id !== params.id)) {
    return {
      code: "1",
      msg: "字典项值已存在",
      data: null
    };
  }

  // 模拟编辑字典项
  const index = mockDictItems.findIndex(item => item.id === params.id);
  if (index === -1) {
    return {
      code: "1",
      msg: "字典项不存在",
      data: null
    };
  }

  mockDictItems[index] = {
    ...mockDictItems[index],
    typeId: params.typeId,
    typeCode: mockDictTypes.find(item => item.id === params.typeId)?.typeCode || "",
    itemName: params.itemName,
    itemValue: params.itemValue,
    parentId: params.parentId || "",
    sort: params.sort || 0,
    description: params.description || "",
    status: params.status || 1,
    updateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
  };

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟删除字典项
export const mockDeleteDictItem = async (params: { id: string[] }): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.id || params.id.length === 0) {
    return {
      code: "1",
      msg: "字典项ID不能为空",
      data: null
    };
  }

  // 模拟删除字典项
  for (const id of params.id) {
    const index = mockDictItems.findIndex(item => item.id === id);
    if (index !== -1) {
      mockDictItems.splice(index, 1);

      // 同时删除该字典项的所有子项
      const itemIndices = mockDictItems.reduce((acc, item, index) => {
        if (item.parentId === id) {
          acc.push(index);
        }
        return acc;
      }, [] as number[]);

      // 从后往前删除，避免索引混乱
      for (const index of itemIndices.reverse()) {
        mockDictItems.splice(index, 1);
      }
    }
  }

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟切换字典项状态
export const mockChangeDictItemStatus = async (params: { id: string; status: number }): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.id || params.status === undefined) {
    return {
      code: "1",
      msg: "字典项ID和状态不能为空",
      data: null
    };
  }

  // 模拟切换字典项状态
  const index = mockDictItems.findIndex(item => item.id === params.id);
  if (index === -1) {
    return {
      code: "1",
      msg: "字典项不存在",
      data: null
    };
  }

  mockDictItems[index].status = params.status;
  mockDictItems[index].updateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

  // 同时切换该字典项的所有子项状态
  for (const item of mockDictItems) {
    if (item.parentId === params.id) {
      item.status = params.status;
      item.updateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    }
  }

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟导入字典数据
export const mockImportDictData = async (params: FormData): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.get("file")) {
    return {
      code: "1",
      msg: "导入文件不能为空",
      data: null
    };
  }

  // 模拟导入字典数据
  // 这里只是模拟，实际项目中需要解析导入的文件并处理数据

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟导出字典数据
export const mockExportDictData = async (params: { typeId?: string }): Promise<ResultData<BlobPart>> => {
  await delay(500);

  // 模拟导出字典数据
  // 这里只是模拟，实际项目中需要根据参数生成导出文件
  // 使用params参数以避免TypeScript错误
  const { typeId } = params;
  console.log("Exporting dict data for typeId:", typeId);

  const blob = new Blob([JSON.stringify(mockDictItems, null, 2)], { type: "application/json" });

  return {
    code: "0",
    msg: "success",
    data: blob
  };
};

// 模拟获取字典变更历史
export const mockGetDictHistory = async (
  params: Dict.ReqDictHistoryParams
): Promise<ResultData<ResPage<Dict.ResDictHistory>>> => {
  await delay(500);

  let filteredData = [...mockDictHistory];

  // 过滤条件
  if (params.dictId) {
    filteredData = filteredData.filter(item => item.dictId === params.dictId);
  }
  if (params.dictType) {
    filteredData = filteredData.filter(item => item.dictType === params.dictType);
  }
  if (params.operator) {
    filteredData = filteredData.filter(item => item.operator.includes(params.operator));
  }
  if (params.createTime && params.createTime.length === 2) {
    filteredData = filteredData.filter(item => {
      const operateTime = new Date(item.operateTime);
      const startDate = new Date(params.createTime[0]);
      const endDate = new Date(params.createTime[1]);
      return operateTime >= startDate && operateTime <= endDate;
    });
  }

  // 分页
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    code: "0",
    msg: "success",
    data: {
      list: paginatedData,
      pageNum,
      pageSize,
      total: filteredData.length
    }
  };
};

// 模拟获取字典权限列表
export const mockGetDictPermission = async (params: { dictId: string }): Promise<ResultData<Dict.ResDictPermission[]>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.dictId) {
    return {
      code: "1",
      msg: "字典ID不能为空",
      data: []
    };
  }

  // 模拟获取字典权限列表
  const filteredData = mockDictPermission.filter(item => item.dictId === params.dictId);

  return {
    code: "0",
    msg: "success",
    data: filteredData
  };
};

// 模拟设置字典权限
export const mockSetDictPermission = async (params: Dict.ReqSetDictPermission): Promise<ResultData<null>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.dictId || !params.roleIds || params.roleIds.length === 0 || !params.permissionType) {
    return {
      code: "1",
      msg: "字典ID、角色ID列表和权限类型不能为空",
      data: null
    };
  }

  // 模拟设置字典权限
  // 先删除该字典的所有现有权限
  const existingIndices = mockDictPermission.reduce((acc, item, index) => {
    if (item.dictId === params.dictId) {
      acc.push(index);
    }
    return acc;
  }, [] as number[]);

  // 从后往前删除，避免索引混乱
  for (const index of existingIndices.reverse()) {
    mockDictPermission.splice(index, 1);
  }

  // 再添加新的权限
  for (const roleId of params.roleIds) {
    const newPermission: Dict.ResDictPermission = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      dictId: params.dictId,
      roleId: roleId,
      roleName: `角色${roleId}`, // 这里只是模拟，实际项目中需要根据角色ID获取角色名称
      permissionType: params.permissionType,
      createTime: new Date().toISOString().slice(0, 19).replace("T", " ")
    };

    mockDictPermission.push(newPermission);
  }

  return {
    code: "0",
    msg: "success",
    data: null
  };
};

// 模拟获取所有字典类型（用于下拉选择）
export const mockGetAllDictTypes = async (): Promise<ResultData<Dict.ResDictTypeList[]>> => {
  await delay(500);

  return {
    code: "0",
    msg: "success",
    data: mockDictTypes.filter(item => item.status === 1)
  };
};

// 模拟根据字典类型获取字典项（用于下拉选择）
export const mockGetDictItemsByType = async (params: { typeCode: string }): Promise<ResultData<Dict.ResDictItemList[]>> => {
  await delay(500);

  // 模拟参数验证
  if (!params.typeCode) {
    return {
      code: "1",
      msg: "字典类型编码不能为空",
      data: []
    };
  }

  // 模拟根据字典类型获取字典项
  const filteredData = mockDictItems.filter(item => item.typeCode === params.typeCode && item.status === 1);

  return {
    code: "0",
    msg: "success",
    data: filteredData
  };
};
