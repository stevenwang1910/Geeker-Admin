import { Table } from "./interface";
import { reactive, computed, toRefs } from "vue";
import type { DefaultRow } from "element-plus/es/components/table/src/table/defaults";

/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Object} initParam 获取数据初始化参数 (非必传，默认为{})
 * @param {Boolean} isPageable 是否有分页 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 * */
export const useTable = <T extends DefaultRow = DefaultRow>(
  api?: (params: any) => Promise<{ list: T[]; total: number } | T[]>,
  initParam: object = {},
  isPageable: boolean = true,
  dataCallBack?: (data: { list: T[]; total: number } | T[]) => { list: T[]; total: number } | T[],
  requestError?: (error: any) => void
) => {
  const state = reactive<Table.StateProps<T>>({
    // 表格数据
    tableData: [] as T[],
    // 分页数据
    pageable: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: 10,
      // 总条数
      total: 0
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {}
  });

  /**
   * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
   * */
  const pageParam = computed({
    get: () => {
      return {
        pageNum: state.pageable.pageNum,
        pageSize: state.pageable.pageSize
      };
    },
    set: (newVal: any) => {
      console.log("我是分页更新之后的值", newVal);
    }
  });

  /**
   * @description 获取表格数据
   * @return void
   * */
  const getTableList = async (params?: any) => {
    try {
      // 合并参数
      const mergedParams = {
        ...state.totalParam,
        ...initParam,
        ...params
      };
      // 如果有分页，添加分页参数
      if (isPageable) {
        mergedParams.pageNum = state.pageable.pageNum;
        mergedParams.pageSize = state.pageable.pageSize;
      }
      // 调用API
      const response = await api!(mergedParams);
      // 如果有数据回调，处理数据
      const processedData = dataCallBack ? dataCallBack(response) : response;
      // 如果有分页，更新分页信息和表格数据
      if (isPageable) {
        if (Array.isArray(processedData)) {
          // 如果是数组，直接使用
          state.tableData = processedData as any[];
          state.pageable.total = processedData.length;
        } else {
          // 如果是对象，使用list和total
          state.pageable.total = processedData.total;
          state.tableData = processedData.list as any[];
        }
      } else {
        // 如果没有分页，直接更新表格数据
        state.tableData = (Array.isArray(processedData) ? processedData : processedData.list) as any[];
      }
      // 如果有图标，更新图标
      if (!Array.isArray(processedData) && (processedData as any).icon) {
        state.icon = (processedData as any).icon;
      }
    } catch (error) {
      // 如果有错误回调，处理错误
      if (requestError) {
        requestError(error);
      } else {
        console.error("获取表格数据失败:", error);
      }
    }
  };

  /**
   * @description 更新查询参数
   * @return void
   * */
  const updatedTotalParam = () => {
    state.totalParam = {};
    // 处理查询参数，可以给查询参数加自定义前缀操作
    let nowSearchParam: Table.StateProps["searchParam"] = {};
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (let key in state.searchParam) {
      // 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    Object.assign(state.totalParam, nowSearchParam);
  };

  /**
   * @description 表格数据查询
   * @return void
   * */
  const search = () => {
    state.pageable.pageNum = 1;
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 表格数据重置
   * @return void
   * */
  const reset = () => {
    state.pageable.pageNum = 1;
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    state.searchParam = { ...state.searchInitParam };
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 每页条数改变
   * @param {Number} val 当前条数
   * @return void
   * */
  const handleSizeChange = (val: number) => {
    state.pageable.pageNum = 1;
    state.pageable.pageSize = val;
    getTableList();
  };

  /**
   * @description 当前页改变
   * @param {Number} val 当前页
   * @return void
   * */
  const handleCurrentChange = (val: number) => {
    state.pageable.pageNum = val;
    getTableList();
  };

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
    updatedTotalParam
  };
};
