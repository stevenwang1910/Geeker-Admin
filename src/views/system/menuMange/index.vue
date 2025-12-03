<template>
  <div class="menu-manage-page">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="path"
      :indent="20"
      :columns="columns"
      :request-api="getMenuList"
      :show-selection="true"
      :show-index="true"
      :show-page="true"
      @selection-change="selectionChange"
    >
      <!-- 表格 header 按钮 -->
      <template #tableTitle>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-auth="['menu:add']">新增菜单</el-button>
        <el-button
          type="danger"
          size="small"
          :icon="Delete"
          @click="batchDelete"
          v-auth="['menu:delete']"
          :disabled="!selectedList.length"
          >批量删除</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #action="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', row)" v-auth="['menu:edit']">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteSingleMenu(row)" v-auth="['menu:delete']">删除</el-button>
      </template>
    </ProTable>
    <!-- 新增/编辑菜单抽屉 -->
    <MenuDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import MenuDrawer from "./components/MenuDrawer.vue";
import { getMenuList, deleteMenu, batchDeleteMenu } from "@/api/modules/menu";
import { ElMessageBox, ElMessage } from "element-plus";

const proTable = ref();
const drawerRef = ref();

// 获取表格选中数据
const selectedList = ref<any[]>([]);

// 监听表格选中数据
const selectionChange = (val: any[]) => {
  selectedList.value = val;
};

// 打开新增/编辑抽屉
const openDrawer = (title: string, row: any = {}) => {
  drawerRef.value?.acceptParams({ title, row });
};

// 单个删除菜单
const deleteSingleMenu = async (row: any) => {
  const { path, title } = row;
  ElMessageBox.confirm("确定要删除菜单【" + title + "】吗？", "提示", { type: "warning", distinguishCancelAndClose: true }).then(
    async () => {
      await deleteMenu({ path });
      ElMessage.success("删除成功！");
      proTable.value?.getTableList();
    }
  );
};

// 批量删除菜单
const batchDelete = async () => {
  if (!selectedList.value.length) return;
  const ids = selectedList.value.map(item => item.path);
  const names = selectedList.value.map(item => item.title).join(", ");
  ElMessageBox.confirm("确定要删除选中的【" + names + "】菜单吗？", "提示", { type: "warning" })
    .then(async () => {
      await batchDeleteMenu({ ids });
      ElMessage.success("批量删除菜单成功！");
      proTable.value?.getTableList();
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 表格配置项
const columns: ColumnProps[] = [
  { type: "selection", prop: "selection", width: 55 },
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input", placeholder: "请输入菜单名称" } },
  { prop: "meta.icon", label: "菜单图标" },
  { prop: "name", label: "菜单 name", search: { el: "input", placeholder: "请输入菜单 name" } },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input", placeholder: "请输入菜单路径" } },
  { prop: "component", label: "组件路径", width: 300 },
  { prop: "meta.sort", label: "排序号", width: 100, sortable: true },
  { prop: "meta.visible", label: "是否显示", width: 100, formatter: (row: any) => (row.meta.visible ? "是" : "否") },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];
</script>
