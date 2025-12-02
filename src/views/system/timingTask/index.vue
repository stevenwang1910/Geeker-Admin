<template>
  <div class="timing-task-page">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-number">{{ taskStats?.totalTasks || 0 }}</div>
            <div class="stat-label">总任务数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card running">
          <div class="stat-item">
            <div class="stat-number">{{ taskStats?.runningTasks || 0 }}</div>
            <div class="stat-label">运行中</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card completed">
          <div class="stat-item">
            <div class="stat-number">{{ taskStats?.completedTasks || 0 }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card failed">
          <div class="stat-item">
            <div class="stat-number">{{ taskStats?.failedTasks || 0 }}</div>
            <div class="stat-label">失败</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <el-card class="mb-4">
      <el-form :model="searchForm" inline @submit.prevent="handleSearch">
        <el-form-item label="任务名称">
          <el-input v-model="searchForm.name" placeholder="请输入任务名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="searchForm.type" placeholder="请选择任务类型" clearable>
            <el-option v-for="item in taskTypeDict" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="searchForm.status" placeholder="请选择任务状态" clearable>
            <el-option v-for="item in taskStatusDict" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="searchForm.priority" placeholder="请选择优先级" clearable>
            <el-option v-for="item in taskPriorityDict" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="mb-4">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增任务
      </el-button>
      <el-button @click="handleBatchDelete" :disabled="selectedIds.length === 0">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出数据
      </el-button>
    </div>

    <!-- 任务列表 -->
    <el-card>
      <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange" border stripe>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="任务名称" min-width="150" />
        <el-table-column prop="type" label="任务类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTaskTypeTagType(row.type)">
              {{ getTaskTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cronExpression" label="Cron表达式" min-width="200" />
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityTagType(row.priority)">
              {{ getPriorityLabel(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="nextExecutionTime" label="下次执行时间" width="180" />
        <el-table-column prop="executionCount" label="执行次数" width="100" />
        <el-table-column prop="failureCount" label="失败次数" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="success" @click="handleEdit(row)" :disabled="row.status === 'running'">
              编辑
            </el-button>
            <el-button size="small" type="warning" @click="handleExecute(row)" :disabled="row.status === 'running'">
              立即执行
            </el-button>
            <el-button size="small" :type="row.isEnabled ? 'danger' : 'info'" @click="toggleTaskStatus(row)">{{ row.isEnabled ? "禁用" : "启用" }}</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-4">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 任务详情对话框 -->
    <el-dialog v-model="detailDialogVisible" :title="currentTask ? '任务详情' : '任务详情'" width="60%">
      <el-descriptions :column="2" border v-if="currentTask">
        <el-descriptions-item label="任务名称">{{ currentTask.name }}</el-descriptions-item>
        <el-descriptions-item label="任务类型">
          <el-tag :type="getTaskTypeTagType(currentTask.type)">
            {{ getTaskTypeLabel(currentTask.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Cron表达式">{{ currentTask.cronExpression || 'N/A' }}</el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityTagType(currentTask.priority)">
            {{ getPriorityLabel(currentTask.priority) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusTagType(currentTask.status)">
            {{ getStatusLabel(currentTask.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="下次执行时间">{{ currentTask.nextExecutionTime || 'N/A' }}</el-descriptions-item>
        <el-descriptions-item label="执行次数">{{ currentTask.executionCount }}</el-descriptions-item>
        <el-descriptions-item label="失败次数">{{ currentTask.failureCount }}</el-descriptions-item>
        <el-descriptions-item label="最大重试次数">{{ currentTask.maxRetries }}</el-descriptions-item>
        <el-descriptions-item label="重试延迟">{{ currentTask.retryDelay }}ms</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentTask.createTime }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentTask.createdBy }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 任务编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑任务' : '新增任务'"
      width="60%"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="120px"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            placeholder="请输入任务描述"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择任务类型" @change="handleTaskTypeChange">
            <el-option v-for="item in taskTypeDict" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="editForm.type === 'cron'"
          label="Cron表达式"
          prop="cronExpression"
        >
          <el-input v-model="editForm.cronExpression" placeholder="请输入Cron表达式" clearable />
        </el-form-item>
        <el-form-item
          v-if="editForm.type === 'interval'"
          label="执行间隔"
          prop="interval"
        >
          <el-input-number
            v-model="editForm.interval"
            :min="1000"
            :step="1000"
            placeholder="请输入执行间隔（毫秒）"
          />
        </el-form-item>
        <el-form-item
          v-if="editForm.type === 'once'"
          label="执行时间"
          prop="executeTime"
        >
          <el-date-picker
            v-model="editForm.executeTime"
            type="datetime"
            placeholder="请选择执行时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="editForm.priority" placeholder="请选择优先级">
            <el-option v-for="item in taskPriorityDict" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="最大重试次数" prop="maxRetries">
          <el-input-number
            v-model="editForm.maxRetries"
            :min="0"
            :max="10"
            placeholder="请输入最大重试次数"
          />
        </el-form-item>
        <el-form-item label="重试延迟" prop="retryDelay">
          <el-input-number
            v-model="editForm.retryDelay"
            :min="1000"
            :step="1000"
            placeholder="请输入重试延迟（毫秒）"
          />
        </el-form-item>
        <el-form-item label="任务数据" prop="taskData">
          <el-input
            v-model="editForm.taskData"
            type="textarea"
            placeholder="请输入任务数据（JSON格式）"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-switch v-model="editForm.isEnabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="timingTask">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete, Download } from "@element-plus/icons-vue";
import { useTimingTaskStore } from "@/stores/modules/timingTask";
import { TimingTask } from "@/api/interface/timingTask";
import { exportTaskData } from "@/api/modules/timingTask";

const timingTaskStore = useTimingTaskStore();

// 响应式数据
const searchForm = reactive({
  name: "",
  type: "",
  status: "",
  priority: "",
  createTime: [] as string[]
});

const editForm = reactive({
  id: "",
  name: "",
  description: "",
  type: "cron" as TimingTask.TaskType,
  cronExpression: "",
  interval: 60000,
  executeTime: "",
  priority: "medium" as TimingTask.TaskPriority,
  maxRetries: 3,
  retryDelay: 5000,
  isEnabled: true,
  taskData: ""
});

const editRules = {
  name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择任务类型", trigger: "change" }],
  cronExpression: [
    { required: true, message: "请输入Cron表达式", trigger: "blur" }
  ],
  interval: [
    { required: true, message: "请输入执行间隔", trigger: "blur" }
  ],
  executeTime: [
    { required: true, message: "请选择执行时间", trigger: "change" }
  ],
  priority: [{ required: true, message: "请选择优先级", trigger: "change" }]
};

const editFormRef = ref();
const detailDialogVisible = ref(false);
const editDialogVisible = ref(false);
const isEdit = ref(false);
const currentTask = ref<TimingTask.ResTimingTask | null>(null);
const selectedIds = ref<string[]>([]);

// 计算属性
const taskList = computed(() => timingTaskStore.taskList);
const taskStats = computed(() => timingTaskStore.taskStats);
const taskTypeDict = computed(() => timingTaskStore.taskTypeDict);
const taskStatusDict = computed(() => timingTaskStore.taskStatusDict);
const taskPriorityDict = computed(() => timingTaskStore.taskPriorityDict);
const pagination = computed(() => timingTaskStore.pagination);
const loading = computed(() => timingTaskStore.loading);

// 方法
const handleSearch = async () => {
  const params: TimingTask.ReqTaskParams = {
    pageNum: 1,
    pageSize: pagination.value.pageSize,
    ...searchForm
  };
  await timingTaskStore.fetchTaskList(params);
};

const handleReset = () => {
  Object.assign(searchForm, {
    name: "",
    type: "",
    status: "",
    priority: "",
    createTime: []
  });
  handleSearch();
};

const handleAdd = () => {
  isEdit.value = false;
  Object.assign(editForm, {
    id: "",
    name: "",
    description: "",
    type: "cron",
    cronExpression: "",
    interval: 60000,
    executeTime: "",
    priority: "medium",
    maxRetries: 3,
    retryDelay: 5000,
    isEnabled: true,
    taskData: ""
  });
  editDialogVisible.value = true;
};

const handleEdit = (row: TimingTask.ResTimingTask) => {
  isEdit.value = true;
  Object.assign(editForm, {
    id: row.id,
    name: row.name,
    description: row.description || "",
    type: row.type,
    cronExpression: row.cronExpression || "",
    interval: row.interval || 60000,
    executeTime: row.executeTime || "",
    priority: row.priority,
    maxRetries: row.maxRetries,
    retryDelay: row.retryDelay,
    isEnabled: row.isEnabled,
    taskData: JSON.stringify(row.taskData || {}, null, 2)
  });
  editDialogVisible.value = true;
};

const handleView = (row: TimingTask.ResTimingTask) => {
  currentTask.value = row;
  detailDialogVisible.value = true;
};

const handleDelete = async (row: TimingTask.ResTimingTask) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除任务"${row.name}"吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    await timingTaskStore.deleteTask(row.id);
    ElMessage.success("删除成功");
    handleSearch();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的${selectedIds.value.length}个任务吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    await timingTaskStore.batchDeleteTask(selectedIds.value);
    ElMessage.success("批量删除成功");
    handleSearch();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("批量删除失败");
    }
  }
};

const handleExecute = async (row: TimingTask.ResTimingTask) => {
  try {
    await timingTaskStore.executeTask(row.id);
    ElMessage.success("任务已开始执行");
    handleSearch();
  } catch (error) {
    ElMessage.error("执行失败");
  }
};

const toggleTaskStatus = async (row: TimingTask.ResTimingTask) => {
  try {
    if (row.isEnabled) {
      await timingTaskStore.disableTask(row.id);
      ElMessage.success("任务已禁用");
    } else {
      await timingTaskStore.enableTask(row.id);
      ElMessage.success("任务已启用");
    }
    handleSearch();
  } catch (error) {
    ElMessage.error("操作失败");
  }
};

const handleSave = async () => {
  if (!editFormRef.value) return;
  
  try {
    await editFormRef.value.validate();
    
    const params: TimingTask.ReqTimingTask = {
      ...editForm,
      taskData: editForm.taskData ? JSON.parse(editForm.taskData) : undefined
    };

    if (isEdit.value) {
      await timingTaskStore.updateTask(editForm.id, params);
      ElMessage.success("更新成功");
    } else {
      await timingTaskStore.createTask(params);
      ElMessage.success("创建成功");
    }

    editDialogVisible.value = false;
    handleSearch();
  } catch (error) {
    ElMessage.error("保存失败");
  }
};

const handleExport = async () => {
  try {
    const params: TimingTask.ReqTaskParams = {
      pageNum: 1,
      pageSize: 10000,
      ...searchForm
    };
    await exportTaskData(params);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

const handleSelectionChange = (val: any[]) => {
  selectedIds.value = val.map(item => item.id);
};

const handleTaskTypeChange = () => {
  if (editForm.type !== "cron") {
    editForm.cronExpression = "";
  }
  if (editForm.type !== "interval") {
    editForm.interval = 60000;
  }
  if (editForm.type !== "once") {
    editForm.executeTime = "";
  }
};

const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val;
  handleSearch();
};

const handleCurrentChange = (val: number) => {
  pagination.value.current = val;
  handleSearch();
};

const getTaskTypeLabel = (type: string) => {
  const item = taskTypeDict.value.find(item => item.value === type);
  return item ? item.label : type;
};

const getStatusLabel = (status: string) => {
  const item = taskStatusDict.value.find(item => item.value === status);
  return item ? item.label : status;
};

const getPriorityLabel = (priority: string) => {
  const item = taskPriorityDict.value.find(item => item.value === priority);
  return item ? item.label : priority;
};

const getTaskTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    cron: "primary",
    interval: "success",
    once: "info"
  };
  return typeMap[type] || "default";
};

const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: "info",
    running: "warning",
    completed: "success",
    failed: "danger",
    cancelled: "default"
  };
  return statusMap[status] || "default";
};

const getPriorityTagType = (priority: string) => {
  const priorityMap: Record<string, string> = {
    low: "info",
    medium: "primary",
    high: "warning",
    critical: "danger"
  };
  return priorityMap[priority] || "default";
};

// 生命周期
onMounted(async () => {
  await Promise.all([
    timingTaskStore.fetchTaskTypeDict(),
    timingTaskStore.fetchTaskStatusDict(),
    timingTaskStore.fetchTaskPriorityDict()
  ]);
  handleSearch();
  timingTaskStore.fetchTaskStats();
});
</script>

<style scoped lang="scss">
.timing-task-page {
  padding: 20px;
}

.stat-card {
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
  }

  .stat-number {
    font-size: 32px;
    font-weight: bold;
    color: var(--el-color-primary);
  }

  .stat-label {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-top: 8px;
  }

  &.running {
    .stat-number {
      color: var(--el-color-warning);
    }
  }

  &.completed {
    .stat-number {
      color: var(--el-color-success);
    }
  }

  &.failed {
    .stat-number {
      color: var(--el-color-danger);
    }
  }
}

.el-table {
  --el-table-header-text-color: var(--el-text-color-primary);
  --el-table-row-hover-bg-color: var(--el-fill-color-light);
}

.el-dialog {
  --el-dialog-body-padding: 20px;
}
</style>
