<template>
  <div class="table-box">
    <ProTable ref="proTable" title="菜单列表" row-key="name" :indent="20" :columns="columns" :request-api="getMenuList" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增菜单 </el-button>
        <el-button type="danger" :icon="Delete" @click="batchDelete" :disabled="!isSelected">批量删除</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteMenu(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <MenuDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Menu } from "@/api/modules/menu";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import MenuDrawer from "./components/MenuDrawer.vue";

const proTable = ref();
const drawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);

// 表格选中状态
const isSelected = ref(false);
const selectedListIds = ref<string[]>([]);

// 监听proTable变化，获取选中状态
import { watch } from "vue";
watch(
  () => proTable.value,
  tableInstance => {
    if (tableInstance && tableInstance.selection) {
      isSelected.value = tableInstance.selection.isSelected;
      selectedListIds.value = tableInstance.selection.selectedListIds;

      // 监听选中状态变化
      watch(
        () => tableInstance.selection?.isSelected,
        val => {
          if (val !== undefined) {
            isSelected.value = val;
          }
        }
      );

      watch(
        () => tableInstance.selection?.selectedListIds,
        val => {
          if (val !== undefined) {
            selectedListIds.value = val;
          }
        }
      );
    }
  },
  { immediate: true }
);

// 获取菜单列表
const getMenuList = async (_params: Menu.ReqMenuParams) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void _params;
  // 暂时使用本地数据，后续替换为接口请求
  const authMenuList = await import("@/assets/json/authMenuList.json");
  
  // 为菜单数据补充缺失的字段
  const addMissingFields = (menus: any[], parentPath = '') => {
    return menus.map((menu, index) => {
      const id = parentPath ? `${parentPath}-${index}` : menu.name;
      const type = menu.children ? '0' : '1'; // 有children的是目录，否则是菜单
      const sort = index + 1;
      
      return {
        ...menu,
        id,
        type,
        sort,
        ...(menu.children && { children: addMissingFields(menu.children, id) })
      };
    });
  };
  
  const formattedData = addMissingFields(authMenuList.data);
  
  return {
    code: 200,
    data: formattedData,
    total: formattedData.length
  };
};

// 打开抽屉(新增、编辑)
const openDrawer = (title: string, row: Partial<Menu.ResMenuList> = {}) => {
  const params = {
    title,
    isView: false,
    row: {
      ...row,
      meta: row.meta || {
        isKeepAlive: false,
        isAffix: false,
        isHide: false
      }
    },
    api: title === "新增" ? addMenu : editMenu,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 新增菜单
const addMenu = async (_params: Menu.ReqMenuParams) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void _params;
  // 暂时模拟接口请求
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ code: 200 });
    }, 500);
  });
};

// 编辑菜单
const editMenu = async (_params: Menu.ReqMenuParams) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void _params;
  // 暂时模拟接口请求
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ code: 200 });
    }, 500);
  });
};

// 删除菜单
const deleteMenu = async (row: Menu.ResMenuList) => {
  await useHandleData(deleteMenuApi, { ids: [row.id] }, `删除【${row.meta.title}】菜单`);
  proTable.value?.getTableList();
};

// 批量删除
const batchDelete = async () => {
  ElMessageBox.confirm("确定删除选中的菜单吗?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      await useHandleData(deleteMenuApi, { ids: selectedListIds.value }, `批量删除菜单`);
      proTable.value?.getTableList();
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 删除菜单接口
const deleteMenuApi = async (_params: { ids: string[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void _params;
  // 暂时模拟接口请求
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ code: 200 });
    }, 500);
  });
};

// 表格配置项
const columns: ColumnProps[] = [
  { type: "selection", width: 55, fixed: "left" },
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input", placeholder: "请输入菜单名称" } },
  { prop: "meta.icon", label: "菜单图标", width: 100, slot: "icon" },
  { prop: "name", label: "菜单标识", width: 200, search: { el: "input", placeholder: "请输入菜单标识" } },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input", placeholder: "请输入菜单路径" } },
  { prop: "component", label: "组件路径", width: 300 },
  { prop: "sort", label: "排序号", width: 100 },
  {
    prop: "type",
    label: "菜单类型",
    width: 100,
    formatter: (row: Menu.ResMenuList) => {
      const typeMap = { "0": "目录", "1": "菜单", "2": "按钮" };
      return typeMap[row.type] || row.type;
    }
  },
  { label: "操作", width: 180, fixed: "right", slot: "operation" }
];
</script>
