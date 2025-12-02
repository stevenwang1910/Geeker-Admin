<template>
  <div class="table-box">
    <ProTable ref="proTable" title="定时任务列表" row-key="id" :columns="columns" :data="taskData">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openAddTaskDialog">新增任务</el-button>
        <el-button type="success" :icon="Play" @click="runSelectedTasks">执行选中任务</el-button>
        <el-button type="warning" :icon="Pause" @click="pauseSelectedTasks">暂停选中任务</el-button>
      </template>
      <!-- 任务状态 -->
      <template #status="scope">
        <el-tag :type="scope.row.status === 'running' ? 'success' : scope.row.status === 'paused' ? 'warning' : 'danger'>
          {{ scope.row.status === 'running' ? '运行中' : scope.row.status === 'paused' ? '已暂停' : '已停止' }}
        </el-tag>
      </template>
      <!-- 任务优先级 -->
      <template #priority="scope">
              <el-tag v-if="scope.row.priority === 'high'" type="danger">高</el-tag>
              <el-tag v-else-if="scope.row.priority === 'medium'" type="warning">中</el-tag>
              <el-tag v-else type="success">低</el-tag>
            </template>
      <!-- 任务操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openEditTaskDialog(scope.row)"> 编辑 </el-button>
        <el-button type="success" link :icon="Play" @click="runTask(scope.row)"> 执行 </el-button>
        <el-button type="warning" link :icon="Pause" @click="pauseTask(scope.row)"> 暂停 </el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteTask(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>

    <!-- 新增/编辑任务弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" @close="resetForm">
      <el-form ref="taskForm" :model="taskForm" label-width="120px">
        <el-form-item label="任务名称" prop="name" :rules="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]">
          <el-input v-model="taskForm.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务类型" prop="type" :rules="[{ required: true, message: '请选择任务类型', trigger: 'change' }]">
          <el-select v-model="taskForm.type" placeholder="请选择任务类型">
            <el-option label="HTTP请求" value="http" />
            <el-option label="脚本执行" value="script" />
            <el-option label="自定义任务" value="custom" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority" :rules="[{ required: true, message: '请选择优先级', trigger: 'change' }]">
          <el-select v-model="taskForm.priority" placeholder="请选择优先级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="调度类型" prop="scheduleType" :rules="[{ required: true, message: '请选择调度类型', trigger: 'change' }]">
          <el-select v-model="taskForm.scheduleType" placeholder="请选择调度类型" @change="switchScheduleType">
            <el-option label="Cron表达式" value="cron" />
            <el-option label="间隔执行" value="interval" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="taskForm.scheduleType === 'cron'" label="Cron表达式" prop="cronExpression" :rules="[{ required: true, message: '请输入Cron表达式', trigger: 'blur' }]">
          <el-input v-model="taskForm.cronExpression" placeholder="请输入Cron表达式" />
          <div class="text-xs text-gray-400 mt-1">示例: 0 0 1 * * ? (每天凌晨1点执行)</div>
        </el-form-item>
        <el-form-item v-if="taskForm.scheduleType === 'interval'" label="间隔时间" prop="interval" :rules="[{ required: true, message: '请输入间隔时间', trigger: 'blur' }]">
          <el-input-number v-model="taskForm.interval" :min="1" placeholder="间隔时间" />
          <el-select v-model="taskForm.intervalUnit" class="ml-2" style="width: 100px">
            <el-option label="秒" value="seconds" />
            <el-option label="分钟" value="minutes" />
            <el-option label="小时" value="hours" />
            <el-option label="天" value="days" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务配置" prop="config" :rules="[{ required: true, message: '请输入任务配置', trigger: 'blur' }]">
          <el-input v-model="taskForm.config" type="textarea" :rows="4" placeholder="请输入任务配置JSON" />
        </el-form-item>
        <el-form-item label="重试次数" prop="retryCount">
          <el-input-number v-model="taskForm.retryCount" :min="0" :max="10" placeholder="重试次数" />
        </el-form-item>
        <el-form-item label="重试间隔" prop="retryInterval">
          <el-input-number v-model="taskForm.retryInterval" :min="0" placeholder="重试间隔(秒)" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="taskForm.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTask">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 任务日志弹窗 -->
    <el-dialog v-model="logDialogVisible" title="任务执行日志" width="900px">
      <el-table :data="currentTaskLogs" stripe border>
        <el-table-column prop="id" label="日志ID" width="100" />
        <el-table-column prop="executeTime" label="执行时间" width="200" />
        <el-table-column prop="status" label="执行状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'>
              {{ scope.row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="执行时长(ms)" width="150" />
        <el-table-column prop="message" label="执行信息" show-overflow-tooltip />
        <el-table-column prop="error" label="错误信息" show-overflow-tooltip />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="timingTask">
import { ref, reactive, h } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Play, Pause, Document } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";

const proTable = ref();
const dialogVisible = ref(false);
const logDialogVisible = ref(false);
const dialogTitle = ref("新增定时任务");
const currentTask = ref<any>(null);
const currentTaskLogs = ref<any[]>([]);

// 模拟任务数据
const taskData = ref([
  {
    id: 1,
    name: "数据同步任务",
    type: "http",
    priority: "high",
    scheduleType: "cron",
    cronExpression: "0 0 1 * * ?",
    status: "running",
    lastExecuteTime: "2024-05-20 01:00:00",
    nextExecuteTime: "2024-05-21 01:00:00",
    executeCount: 120,
    successCount: 118,
    failCount: 2
  },
  {
    id: 2,
    name: "报表生成任务",
    type: "script",
    priority: "medium",
    scheduleType: "interval",
    interval: 24,
    intervalUnit: "hours",
    status: "paused",
    lastExecuteTime: "2024-05-19 10:00:00",
    nextExecuteTime: "2024-05-20 10:00:00",
    executeCount: 60,
    successCount: 58,
    failCount: 2
  },
  {
    id: 3,
    name: "日志清理任务",
    type: "custom",
    priority: "low",
    scheduleType: "cron",
    cronExpression: "0 0 2 * * 0",
    status: "running",
    lastExecuteTime: "2024-05-19 02:00:00",
    nextExecuteTime: "2024-05-26 02:00:00",
    executeCount: 8,
    successCount: 8,
    failCount: 0
  }
]);

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "name", label: "任务名称", align: "left", search: { el: "input" } },
  { prop: "type", label: "任务类型", search: { el: "select", options: [{ label: "HTTP请求", value: "http" }, { label: "脚本执行", value: "script" }, { label: "自定义任务", value: "custom" }] } },
  { prop: "priority", label: "任务优先级" },
  { prop: "scheduleType", label: "调度类型", search: { el: "select", options: [{ label: "Cron表达式", value: "cron" }, { label: "间隔执行", value: "interval" }] } },
  { prop: "cronExpression", label: "Cron表达式", width: 250 },
  { prop: "interval", label: "间隔时间", width: 120 },
  { prop: "status", label: "任务状态", width: 120 },
  { prop: "lastExecuteTime", label: "上次执行时间", width: 200 },
  { prop: "nextExecuteTime", label: "下次执行时间", width: 200 },
  { prop: "executeCount", label: "执行次数", width: 100 },
  { prop: "successCount", label: "成功次数", width: 100 },
  { prop: "failCount", label: "失败次数", width: 100 },
  { 
    prop: "log", 
    label: "执行日志", 
    width: 120, 
    fixed: "right",
    render: (scope: any) => {
      return h(ElButton, { type: "primary", link: true, icon: Document, onClick: () => viewTaskLog(scope.row) }, () => "日志");
    }
  },
  { prop: "operation", label: "操作", width: 350, fixed: "right" }
];

// 表单初始化
const taskFormInit = reactive({
  id: undefined,
  name: "",
  type: "http",
  priority: "medium",
  scheduleType: "cron",
  cronExpression: "",
  interval: 60,
  intervalUnit: "minutes",
  config: "",
  retryCount: 3,
  retryInterval: 5,
  remark: ""
});

const taskForm = ref({ ...taskFormInit });

// 打开新增任务弹窗
const openAddTaskDialog = () => {
  dialogTitle.value = "新增定时任务";
  dialogVisible.value = true;
};

// 打开编辑任务弹窗
const openEditTaskDialog = (row: any) => {
  dialogTitle.value = "编辑定时任务";
  currentTask.value = row;
  taskForm.value = { ...row };
  dialogVisible.value = true;
};

// 切换调度类型
const switchScheduleType = (value: string) => {
  if (value === 'cron') {
    taskForm.value.interval = undefined;
  } else {
    taskForm.value.cronExpression = undefined;
  }
};

// 重置表单
const resetForm = () => {
  taskForm.value = { ...taskFormInit };
  currentTask.value = null;
};

// 保存任务
const saveTask = () => {
  if (!taskForm.value.name) {
    ElMessage.error("请输入任务名称");
    return;
  }
  
  if (taskForm.value.id) {
    // 编辑任务
    const index = taskData.value.findIndex((item: any) => item.id === taskForm.value.id);
    if (index !== -1) {
      taskData.value[index] = { ...taskForm.value };
      ElMessage.success("任务编辑成功");
    }
  } else {
    // 新增任务
    const newTask = {
      ...taskForm.value,
      id: Date.now(),
      status: 'paused',
      lastExecuteTime: null,
      nextExecuteTime: null,
      executeCount: 0,
      successCount: 0,
      failCount: 0
    };
    taskData.value.unshift(newTask);
    ElMessage.success("任务新增成功");
  }
  
  dialogVisible.value = false;
  resetForm();
};

// 执行任务
const runTask = (row: any) => {
  row.status = 'running';
  row.lastExecuteTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  row.executeCount++;
  row.successCount++;
  ElMessage.success(`任务 ${row.name} 执行成功`);
};

// 暂停任务
const pauseTask = (row: any) => {
  row.status = 'paused';
  ElMessage.success(`任务 ${row.name} 已暂停`);
};

// 执行选中任务
const runSelectedTasks = () => {
  ElMessage.success("已执行选中任务");
};

// 暂停选中任务
const pauseSelectedTasks = () => {
  ElMessage.success("已暂停选中任务");
};

// 删除任务
const deleteTask = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除任务 ${row.name}, 是否继续?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = taskData.value.findIndex((item: any) => item.id === row.id);
    if (index !== -1) {
      taskData.value.splice(index, 1);
      ElMessage.success('删除成功!');
    }
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

// 查看任务日志
const viewTaskLog = (row: any) => {
  currentTaskLogs.value = [
    {
      id: 1,
      executeTime: "2024-05-20 01:00:00",
      status: "success",
      duration: 1250,
      message: "任务执行成功",
      error: ""
    },
    {
      id: 2,
      executeTime: "2024-05-19 01:00:00",
      status: "fail",
      duration: 800,
      message: "任务执行失败",
      error: "网络连接超时"
    },
    {
      id: 3,
      executeTime: "2024-05-18 01:00:00",
      status: "success",
      duration: 950,
      message: "任务执行成功",
      error: ""
    }
  ];
  logDialogVisible.value = true;
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>