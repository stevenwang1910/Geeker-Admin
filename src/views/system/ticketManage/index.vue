<template>
  <div class="main-box">
    <ProTable
      ref="proTable"
      row-key="id"
      :columns="columns"
      :request-api="getTicketList"
      :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增工单</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteTicket(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <TicketDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="ticketManage">
import { reactive, ref } from "vue";
import { Ticket } from "@/api/interface";
import { ticketStatus, ticketPriority } from "@/utils/dict";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import TicketDrawer from "@/views/system/ticketManage/components/TicketDrawer.vue";
import { CirclePlus, Delete, EditPen, View } from "element-plus/icons-vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { getTicketList, deleteTicket, editTicket, addTicket } from "@/api/modules/ticket";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 表格配置项
const columns = reactive<ColumnProps<Ticket.ResTicketList>[]>([
  { type: "index", label: "#", width: 80 },
  { prop: "ticketNo", label: "工单编号", width: 180 },
  { prop: "customerName", label: "客户名称", width: 150 },
  { prop: "customerPhone", label: "客户电话", width: 150 },
  { prop: "customerEmail", label: "客户邮箱", width: 200 },
  {
    prop: "priority",
    label: "紧急程度",
    width: 120,
    tag: true,
    enum: ticketPriority,
    search: { el: "select" }
  },
  {
    prop: "status",
    label: "工单状态",
    width: 120,
    tag: true,
    enum: ticketStatus,
    search: { el: "select" }
  },
  { prop: "submitTime", label: "提交时间", width: 180 },
  { prop: "handler", label: "处理人", width: 120 },
  { prop: "operation", label: "操作", width: 300, fixed: "right" }
]);

// 删除工单信息
const deleteTicket = async (params: Ticket.ResTicketList) => {
  await useHandleData(deleteTicket, { id: [params.id] }, `删除【${params.ticketNo}】工单`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof TicketDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Ticket.ResTicketList> = {}) => {
  const params = {
    title,
    row: { ...row },
    isView: title === "查看",
    api: title === "新增" ? addTicket : title === "编辑" ? editTicket : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>

<style scoped lang="scss">
.main-box {
  padding: 20px;
}
</style>