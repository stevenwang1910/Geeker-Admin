<template>
  <div class="main-box">
    <ProTable
      ref="proTable"
      highlight-current-row
      :columns="columns"
      :request-api="getDemoList"
      :init-param="initParam"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增数据</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteData(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <DemoDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="demo">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import ProTable from "@/components/ProTable/index.vue";
import DemoDrawer from "@/views/demo/components/DemoDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, View } from "@element-plus/icons-vue";
import {
  getDemoList,
  deleteDemo,
  editDemo,
  addDemo,
  exportDemoInfo
} from "@/api/modules/demo";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 初始化请求参数
const initParam = reactive({});

// 表格配置项
const columns = reactive<ColumnProps<any>[]>([
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "名称", width: 120, search: { el: "input" } },
  { prop: "type", label: "类型", width: 120, search: { el: "select", options: [{ label: "类型1", value: "1" }, { label: "类型2", value: "2" }] } },
  { prop: "status", label: "状态", width: 120, sortable: true, tag: true, enum: [{ label: "启用", value: "1" }, { label: "禁用", value: "0" }] },
  { prop: "createTime", label: "创建时间", width: 180, sortable: true },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
]);

// 删除数据
const deleteData = async (params: any) => {
  await useHandleData(deleteDemo, { id: [params.id] }, `删除【${params.name}】数据`);
  proTable.value?.getTableList();
};

// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportDemoInfo, "数据列表", proTable.value?.searchParam)
  );
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof DemoDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<any> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addDemo : title === "编辑" ? editDemo : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>