import { ref, computed } from "vue";
import type { DefaultRow } from "element-plus/es/components/table/src/table/defaults";

/**
 * @description 表格多选数据操作
 * @param {String} rowKey 当表格可以多选时，所指定的 id
 * */
export const useSelection = <T extends DefaultRow = DefaultRow>(rowKey: string = "id") => {
  const isSelected = ref<boolean>(false);
  const selectedList = ref<T[]>([]);

  // 当前选中的所有 ids 数组
  const selectedListIds = computed((): string[] => {
    let ids: string[] = [];
    selectedList.value.forEach(item => ids.push(item[rowKey]));
    return ids;
  });

  /**
   * @description 多选操作
   * @param {Array} rowArr 当前选择的所有数据
   * @return void
   */
  const selectionChange = (rowArr: T[]) => {
    rowArr.length ? (isSelected.value = true) : (isSelected.value = false);
    selectedList.value = rowArr;
  };

  return {
    isSelected,
    selectedList,
    selectedListIds,
    selectionChange
  };
};
