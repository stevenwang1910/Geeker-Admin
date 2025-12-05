<template>
  <div class="table-box">
    <ProTable ref="proTable" title="定时任务列表" row-key="id" :columns="columns" :data="taskData">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus">新增任务 </el-button>
      </template>
      <!-- 任务状态 -->
      <template #status="scope">
        <el-tag :type="scope.row.status === 'running' ? 'success' : 'warning'">
          {{ scope.row.status === "running" ? "运行中" : "已停止" }}
        </el-tag>
      </template>
      <!-- 任务操作 -->
      <template #operation>
        <el-button type="primary" link :icon="EditPen"> 编辑 </el-button>
        <el-button type="primary" link :icon="PlayCircle"> 启动 </el-button>
        <el-button type="primary" link :icon="Stop"> 停止 </el-button>
        <el-button type="primary" link :icon="Delete"> 删除 </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="timingTask">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, PlayCircle, Stop } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";

const proTable = ref();

// 模拟定时任务数据
const taskData = ref([
  {
    id: 1,
    name: "数据备份任务",
    cron: "0 0 * * *",
    status: "running",
    createTime: "2023-05-15 10:30:00",
    updateTime: "2023-05-15 10:30:00"
  },
  {
    id: 2,
    name: "日志清理任务",
    cron: "0 0 * * 0",
    status: "stopped",
    createTime: "2023-05-16 14:20:00",
    updateTime: "2023-05-16 14:20:00"
  },
  {
    id: 3,
    name: "邮件发送任务",
    cron: "0 9 * * 1-5",
    status: "running",
    createTime: "2023-05-17 09:15:00",
    updateTime: "2023-05-17 09:15:00"
  }
]);

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "name", label: "任务名称", align: "left", search: { el: "input" } },
  { prop: "cron", label: "Cron 表达式", width: 200, search: { el: "input" } },
  { prop: "status", label: "任务状态", width: 120 },
  { prop: "createTime", label: "创建时间", width: 200 },
  { prop: "updateTime", label: "更新时间", width: 200 },
  { prop: "operation", label: "操作", width: 300, fixed: "right" }
];
</script>
