import { MockMethod } from "vite-plugin-mock";
import Mock from "mockjs";

// 字典类型列表数据
const dictTypeList = [
  {
    id: "1",
    dictName: "用户状态",
    dictType: "user_status",
    status: "1",
    remark: "用户状态字典",
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "2",
    dictName: "用户性别",
    dictType: "user_gender",
    status: "1",
    remark: "用户性别字典",
    createTime: "2023-01-02 10:00:00",
    updateTime: "2023-01-02 10:00:00"
  },
  {
    id: "3",
    dictName: "菜单类型",
    dictType: "menu_type",
    status: "1",
    remark: "菜单类型字典",
    createTime: "2023-01-03 10:00:00",
    updateTime: "2023-01-03 10:00:00"
  }
];

// 字典项列表数据
const dictItemList = [
  // 用户状态
  {
    id: "1",
    dictType: "user_status",
    dictLabel: "正常",
    dictValue: "0",
    parentId: "0",
    children: [],
    status: "1",
    sort: 1,
    remark: "用户正常状态",
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  {
    id: "2",
    dictType: "user_status",
    dictLabel: "禁用",
    dictValue: "1",
    parentId: "0",
    children: [],
    status: "1",
    sort: 2,
    remark: "用户禁用状态",
    createTime: "2023-01-01 10:00:00",
    updateTime: "2023-01-01 10:00:00"
  },
  // 用户性别
  {
    id: "3",
    dictType: "user_gender",
    dictLabel: "男",
    dictValue: "0",
    parentId: "0",
    children: [],
    status: "1",
    sort: 1,
    remark: "男性",
    createTime: "2023-01-02 10:00:00",
    updateTime: "2023-01-02 10:00:00"
  },
  {
    id: "4",
    dictType: "user_gender",
    dictLabel: "女",
    dictValue: "1",
    parentId: "0",
    children: [],
    status: "1",
    sort: 2,
    remark: "女性",
    createTime: "2023-01-02 10:00:00",
    updateTime: "2023-01-02 10:00:00"
  },
  {
    id: "5",
    dictType: "user_gender",
    dictLabel: "未知",
    dictValue: "2",
    parentId: "0",
    children: [],
    status: "1",
    sort: 3,
    remark: "未知性别",
    createTime: "2023-01-02 10:00:00",
    updateTime: "2023-01-02 10:00:00"
  },
  // 菜单类型
  {
    id: "6",
    dictType: "menu_type",
    dictLabel: "目录",
    dictValue: "0",
    parentId: "0",
    children: [],
    status: "1",
    sort: 1,
    remark: "菜单目录",
    createTime: "2023-01-03 10:00:00",
    updateTime: "2023-01-03 10:00:00"
  },
  {
    id: "7",
    dictType: "menu_type",
    dictLabel: "菜单",
    dictValue: "1",
    parentId: "0",
    children: [],
    status: "1",
    sort: 2,
    remark: "功能菜单",
    createTime: "2023-01-03 10:00:00",
    updateTime: "2023-01-03 10:00:00"
  },
  {
    id: "8",
    dictType: "menu_type",
    dictLabel: "按钮",
    dictValue: "2",
    parentId: "0",
    children: [],
    status: "1",
    sort: 3,
    remark: "权限按钮",
    createTime: "2023-01-03 10:00:00",
    updateTime: "2023-01-03 10:00:00"
  }
];

// 字典变更历史数据
const dictHistoryList = [
  {
    id: "1",
    dictType: "user_status",
    dictId: "1",
    changeType: "add",
    oldValue: "",
    newValue: JSON.stringify(dictItemList[0]),
    changeTime: "2023-01-01 10:00:00",
    changeUser: "admin"
  },
  {
    id: "2",
    dictType: "user_status",
    dictId: "2",
    changeType: "add",
    oldValue: "",
    newValue: JSON.stringify(dictItemList[1]),
    changeTime: "2023-01-01 10:05:00",
    changeUser: "admin"
  },
  {
    id: "3",
    dictType: "user_gender",
    dictId: "3",
    changeType: "add",
    oldValue: "",
    newValue: JSON.stringify(dictItemList[2]),
    changeTime: "2023-01-02 10:00:00",
    changeUser: "admin"
  }
];

// 字典类型相关mock接口
export const dictTypeMock: MockMethod[] = [
  // 获取字典类型列表
  {
    url: "/api/dict/type/list",
    method: "post",
    response: config => {
      const { pageNum = 1, pageSize = 10, dictName, dictType, status } = config.body;

      let filteredList = [...dictTypeList];

      // 过滤条件
      if (dictName) {
        filteredList = filteredList.filter(item => item.dictName.includes(dictName));
      }
      if (dictType) {
        filteredList = filteredList.filter(item => item.dictType.includes(dictType));
      }
      if (status) {
        filteredList = filteredList.filter(item => item.status === status);
      }

      // 分页
      const startIndex = (pageNum - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageList = filteredList.slice(startIndex, endIndex);

      return {
        code: 200,
        msg: "成功",
        data: {
          list: pageList,
          total: filteredList.length,
          pageNum,
          pageSize
        }
      };
    }
  },
  // 获取字典类型详情
  {
    url: "/api/dict/type/:id",
    method: "get",
    response: config => {
      const { id } = config.params;
      const dictType = dictTypeList.find(item => item.id === id);

      if (!dictType) {
        return {
          code: 404,
          msg: "字典类型不存在",
          data: null
        };
      }

      return {
        code: 200,
        msg: "成功",
        data: dictType
      };
    }
  },
  // 新增字典类型
  {
    url: "/api/dict/type",
    method: "post",
    response: config => {
      const { dictName, dictType, status, remark } = config.body;

      // 验证字典类型是否已存在
      const existingDictType = dictTypeList.find(item => item.dictType === dictType);
      if (existingDictType) {
        return {
          code: 400,
          msg: "字典类型已存在",
          data: null
        };
      }

      // 生成新的字典类型
      const newDictType = {
        id: Mock.mock("@id"),
        dictName,
        dictType,
        status,
        remark,
        createTime: Mock.mock("@datetime"),
        updateTime: Mock.mock("@datetime")
      };

      dictTypeList.push(newDictType);

      return {
        code: 200,
        msg: "成功",
        data: newDictType
      };
    }
  },
  // 修改字典类型
  {
    url: "/api/dict/type/:id",
    method: "put",
    response: config => {
      const { id } = config.params;
      const { dictName, dictType, status, remark } = config.body;

      const dictTypeIndex = dictTypeList.findIndex(item => item.id === id);
      if (dictTypeIndex === -1) {
        return {
          code: 404,
          msg: "字典类型不存在",
          data: null
        };
      }

      // 验证字典类型是否已存在（排除当前记录）
      const existingDictType = dictTypeList.find(item => item.dictType === dictType && item.id !== id);
      if (existingDictType) {
        return {
          code: 400,
          msg: "字典类型已存在",
          data: null
        };
      }

      // 更新字典类型
      dictTypeList[dictTypeIndex] = {
        ...dictTypeList[dictTypeIndex],
        dictName,
        dictType,
        status,
        remark,
        updateTime: Mock.mock("@datetime")
      };

      return {
        code: 200,
        msg: "成功",
        data: dictTypeList[dictTypeIndex]
      };
    }
  },
  // 删除字典类型
  {
    url: "/api/dict/type/:id",
    method: "delete",
    response: config => {
      const { id } = config.params;

      const dictTypeIndex = dictTypeList.findIndex(item => item.id === id);
      if (dictTypeIndex === -1) {
        return {
          code: 404,
          msg: "字典类型不存在",
          data: null
        };
      }

      // 检查是否存在关联的字典项
      const hasDictItems = dictItemList.some(item => item.dictType === dictTypeList[dictTypeIndex].dictType);
      if (hasDictItems) {
        return {
          code: 400,
          msg: "字典类型存在关联的字典项，无法删除",
          data: null
        };
      }

      // 删除字典类型
      dictTypeList.splice(dictTypeIndex, 1);

      return {
        code: 200,
        msg: "成功",
        data: null
      };
    }
  },
  // 批量删除字典类型
  {
    url: "/api/dict/type/batch",
    method: "delete",
    response: config => {
      const { ids } = config.body;

      if (!ids || ids.length === 0) {
        return {
          code: 400,
          msg: "请选择要删除的字典类型",
          data: null
        };
      }

      // 检查是否存在关联的字典项
      for (const id of ids) {
        const dictType = dictTypeList.find(item => item.id === id);
        if (dictType) {
          const hasDictItems = dictItemList.some(item => item.dictType === dictType.dictType);
          if (hasDictItems) {
            return {
              code: 400,
              msg: `字典类型"${dictType.dictName}"存在关联的字典项，无法删除`,
              data: null
            };
          }
        }
      }

      // 批量删除字典类型
      for (const id of ids) {
        const dictTypeIndex = dictTypeList.findIndex(item => item.id === id);
        if (dictTypeIndex !== -1) {
          dictTypeList.splice(dictTypeIndex, 1);
        }
      }

      return {
        code: 200,
        msg: "成功",
        data: null
      };
    }
  },
  // 导出字典类型
  {
    url: "/api/dict/type/export",
    method: "get",
    response: () => {
      return {
        code: 200,
        msg: "成功",
        data: "dict_type_export.xlsx"
      };
    }
  },
  // 导入字典类型
  {
    url: "/api/dict/type/import",
    method: "post",
    response: () => {
      return {
        code: 200,
        msg: "成功",
        data: null
      };
    }
  },
  // 切换字典类型状态
  {
    url: "/api/dict/type/status/:id",
    method: "put",
    response: config => {
      const { id } = config.params;

      const dictTypeIndex = dictTypeList.findIndex(item => item.id === id);
      if (dictTypeIndex === -1) {
        return {
          code: 404,
          msg: "字典类型不存在",
          data: null
        };
      }

      // 切换状态
      const newStatus = dictTypeList[dictTypeIndex].status === "1" ? "0" : "1";
      dictTypeList[dictTypeIndex] = {
        ...dictTypeList[dictTypeIndex],
        status: newStatus,
        updateTime: Mock.mock("@datetime")
      };

      return {
        code: 200,
        msg: "成功",
        data: dictTypeList[dictTypeIndex]
      };
    }
  }
];

// 字典项相关mock接口
export const dictItemMock: MockMethod[] = [
  // 获取字典项树形列表
  {
    url: "/api/dict/item/tree/:dictType",
    method: "get",
    response: config => {
      const { dictType } = config.params;

      // 过滤指定字典类型的字典项
      const filteredItems = dictItemList.filter(item => item.dictType === dictType);

      // 构建树形结构
      const buildTree = (items: any[], parentId: string = "0") => {
        const tree: any[] = [];
        items.forEach(item => {
          if (item.parentId === parentId) {
            const children = buildTree(items, item.id);
            if (children.length > 0) {
              item.children = children;
            }
            tree.push(item);
          }
        });
        return tree;
      };

      const treeList = buildTree(filteredItems);

      return {
        code: 200,
        msg: "成功",
        data: treeList
      };
    }
  },
  // 获取字典项列表
  {
    url: "/api/dict/item/list/:dictType",
    method: "get",
    response: config => {
      const { dictType } = config.params;
      const { pageNum = 1, pageSize = 10, dictLabel, status } = config.query;

      // 过滤指定字典类型的字典项
      let filteredItems = dictItemList.filter(item => item.dictType === dictType);

      // 过滤条件
      if (dictLabel) {
        filteredItems = filteredItems.filter(item => item.dictLabel.includes(dictLabel));
      }
      if (status) {
        filteredItems = filteredItems.filter(item => item.status === status);
      }

      // 分页
      const startIndex = (pageNum - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageList = filteredItems.slice(startIndex, endIndex);

      return {
        code: 200,
        msg: "成功",
        data: {
          list: pageList,
          total: filteredItems.length,
          pageNum,
          pageSize
        }
      };
    }
  },
  // 获取字典项详情
  {
    url: "/api/dict/item/:id",
    method: "get",
    response: config => {
      const { id } = config.params;
      const dictItem = dictItemList.find(item => item.id === id);

      if (!dictItem) {
        return {
          code: 404,
          msg: "字典项不存在",
          data: null
        };
      }

      return {
        code: 200,
        msg: "成功",
        data: dictItem
      };
    }
  },
  // 新增字典项
  {
    url: "/api/dict/item",
    method: "post",
    response: config => {
      const { dictType, dictLabel, dictValue, parentId, status, sort, remark } = config.body;

      // 验证字典值是否已存在
      const existingDictItem = dictItemList.find(item => item.dictType === dictType && item.dictValue === dictValue);
      if (existingDictItem) {
        return {
          code: 400,
          msg: "字典值已存在",
          data: null
        };
      }

      // 生成新的字典项
      const newDictItem = {
        id: Mock.mock("@id"),
        dictType,
        dictLabel,
        dictValue,
        parentId,
        children: [],
        status,
        sort,
        remark,
        createTime: Mock.mock("@datetime"),
        updateTime: Mock.mock("@datetime")
      };

      dictItemList.push(newDictItem);

      return {
        code: 200,
        msg: "成功",
        data: newDictItem
      };
    }
  },
  // 修改字典项
  {
    url: "/api/dict/item/:id",
    method: "put",
    response: config => {
      const { id } = config.params;
      const { dictType, dictLabel, dictValue, parentId, status, sort, remark } = config.body;

      const dictItemIndex = dictItemList.findIndex(item => item.id === id);
      if (dictItemIndex === -1) {
        return {
          code: 404,
          msg: "字典项不存在",
          data: null
        };
      }

      // 验证字典值是否已存在（排除当前记录）
      const existingDictItem = dictItemList.find(
        item => item.dictType === dictType && item.dictValue === dictValue && item.id !== id
      );
      if (existingDictItem) {
        return {
          code: 400,
          msg: "字典值已存在",
          data: null
        };
      }

      // 更新字典项
      dictItemList[dictItemIndex] = {
        ...dictItemList[dictItemIndex],
        dictLabel,
        dictValue,
        parentId,
        status,
        sort,
        remark,
        updateTime: Mock.mock("@datetime")
      };

      return {
        code: 200,
        msg: "成功",
        data: dictItemList[dictItemIndex]
      };
    }
  },
  // 删除字典项
  {
    url: "/api/dict/item/:id",
    method: "delete",
    response: config => {
      const { id } = config.params;

      const dictItemIndex = dictItemList.findIndex(item => item.id === id);
      if (dictItemIndex === -1) {
        return {
          code: 404,
          msg: "字典项不存在",
          data: null
        };
      }

      // 检查是否存在子字典项
      const hasChildren = dictItemList.some(item => item.parentId === id);
      if (hasChildren) {
        return {
          code: 400,
          msg: "字典项存在子字典项，无法删除",
          data: null
        };
      }

      // 删除字典项
      dictItemList.splice(dictItemIndex, 1);

      return {
        code: 200,
        msg: "成功",
        data: null
      };
    }
  },
  // 批量删除字典项
  {
    url: "/api/dict/item/batch",
    method: "delete",
    response: config => {
      const { ids } = config.body;

      if (!ids || ids.length === 0) {
        return {
          code: 400,
          msg: "请选择要删除的字典项",
          data: null
        };
      }

      // 检查是否存在子字典项
      for (const id of ids) {
        const hasChildren = dictItemList.some(item => item.parentId === id);
        if (hasChildren) {
          const dictItem = dictItemList.find(item => item.id === id);
          return {
            code: 400,
            msg: `字典项"${dictItem?.dictLabel}"存在子字典项，无法删除`,
            data: null
          };
        }
      }

      // 批量删除字典项
      for (const id of ids) {
        const dictItemIndex = dictItemList.findIndex(item => item.id === id);
        if (dictItemIndex !== -1) {
          dictItemList.splice(dictItemIndex, 1);
        }
      }

      return {
        code: 200,
        msg: "成功",
        data: null
      };
    }
  },
  // 导出字典项
  {
    url: "/api/dict/item/export/:dictType",
    method: "get",
    response: () => {
      return {
        code: 200,
        msg: "成功",
        data: "dict_item_export.xlsx"
      };
    }
  },
  // 导入字典项
  {
    url: "/api/dict/item/import",
    method: "post",
    response: () => {
      return {
        code: 200,
        msg: "成功",
        data: null
      };
    }
  },
  // 切换字典项状态
  {
    url: "/api/dict/item/status/:id",
    method: "put",
    response: config => {
      const { id } = config.params;

      const dictItemIndex = dictItemList.findIndex(item => item.id === id);
      if (dictItemIndex === -1) {
        return {
          code: 404,
          msg: "字典项不存在",
          data: null
        };
      }

      // 切换状态
      const newStatus = dictItemList[dictItemIndex].status === "1" ? "0" : "1";
      dictItemList[dictItemIndex] = {
        ...dictItemList[dictItemIndex],
        status: newStatus,
        updateTime: Mock.mock("@datetime")
      };

      return {
        code: 200,
        msg: "成功",
        data: dictItemList[dictItemIndex]
      };
    }
  }
];

// 字典变更历史相关mock接口
export const dictHistoryMock: MockMethod[] = [
  // 获取字典变更历史列表
  {
    url: "/api/dict/history/list",
    method: "get",
    response: config => {
      const { pageNum = 1, pageSize = 10, dictType, dictId, changeType, changeUser, startTime, endTime } = config.query;

      let filteredList = [...dictHistoryList];

      // 过滤条件
      if (dictType) {
        filteredList = filteredList.filter(item => item.dictType.includes(dictType));
      }
      if (dictId) {
        filteredList = filteredList.filter(item => item.dictId === dictId);
      }
      if (changeType) {
        filteredList = filteredList.filter(item => item.changeType === changeType);
      }
      if (changeUser) {
        filteredList = filteredList.filter(item => item.changeUser.includes(changeUser));
      }
      if (startTime) {
        filteredList = filteredList.filter(item => item.changeTime >= startTime);
      }
      if (endTime) {
        filteredList = filteredList.filter(item => item.changeTime <= endTime);
      }

      // 分页
      const startIndex = (pageNum - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageList = filteredList.slice(startIndex, endIndex);

      return {
        code: 200,
        msg: "成功",
        data: {
          list: pageList,
          total: filteredList.length,
          pageNum,
          pageSize
        }
      };
    }
  }
];

// 合并所有字典相关的mock接口
export const dictMock = [...dictTypeMock, ...dictItemMock, ...dictHistoryMock];
