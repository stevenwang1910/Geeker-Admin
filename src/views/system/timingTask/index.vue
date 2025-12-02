<template>
  <div class="timing-task-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">定时任务管理</h2>
        <p class="page-subtitle">管理系统定时任务，支持Cron表达式和间隔调度</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAddTask" :loading="isOperationLoading">
          <el-icon><Plus /></el-icon>
          添加任务
        </el-button>
      </div>
    </div>

    <!-- 任务列表区域 -->
    <div class="task-list-section">
      <!-- 搜索和筛选 -->
      <div class="search-filter-bar">
        <el-input v-model="searchForm.name" placeholder="任务名称" style="width: 200px; margin-right: 10px" clearable>
          <template #prefix
            ><el-icon><Search /></el-icon
          ></template>
        </el-input>

        <el-select v-model="searchForm.status" placeholder="任务状态" style="width: 120px; margin-right: 10px" clearable>
          <el-option label="活跃" value="active" />
          <el-option label="暂停" value="paused" />
          <el-option label="未激活" value="inactive" />
        </el-select>

        <el-select v-model="searchForm.priority" placeholder="优先级" style="width: 100px; margin-right: 10px" clearable>
          <el-option label="高" value="1" />
          <el-option label="中" value="2" />
          <el-option label="低" value="3" />
        </el-select>

        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>

        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>

      <!-- 任务列表 -->
      <el-table v-loading="isTaskLoading" :data="taskList" stripe border style="width: 100%; margin-top: 20px">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="name" label="任务名称" min-width="150" />

        <el-table-column prop="description" label="任务描述" min-width="200" show-overflow-tooltip />

        <el-table-column prop="taskType" label="任务类型" width="120">
          <template #default="scope">
            <el-tag :type="getTaskTypeTagType(scope.row.taskType)">
              {{ getTaskTypeLabel(scope.row.taskType) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="scope">
            <el-tag :type="getPriorityTagType(scope.row.priority)">
              {{ getPriorityLabel(scope.row.priority) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="cronExpression" label="Cron表达式" min-width="180" show-overflow-tooltip />

        <el-table-column label="执行间隔" min-width="150">
          <template #default="scope">
            {{ getIntervalText(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="任务状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="lastExecutionTime" label="最后执行时间" width="160" />

        <el-table-column prop="nextExecutionTime" label="下次执行时间" width="160" />

        <el-table-column prop="executionCount" label="执行次数" width="100" />

        <el-table-column prop="successCount" label="成功次数" width="100" />

        <el-table-column prop="failureCount" label="失败次数" width="100" />

        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleStartTask(scope.row.id)"
              :loading="isOperationLoading"
              v-if="scope.row.status !== 'active'"
            >
              <el-icon><Play /></el-icon>
              启动
            </el-button>

            <el-button
              size="small"
              @click="handlePauseTask(scope.row.id)"
              :loading="isOperationLoading"
              v-if="scope.row.status === 'active'"
            >
              <el-icon><Pause /></el-icon>
              暂停
            </el-button>

            <el-button size="small" type="primary" @click="handleExecuteTask(scope.row.id)" :loading="isOperationLoading">
              <el-icon><Refresh /></el-icon>
              立即执行
            </el-button>

            <el-button size="small" @click="handleEditTask(scope.row)" :loading="isOperationLoading">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>

            <el-button size="small" type="danger" @click="handleDeleteTask(scope.row.id)" :loading="isOperationLoading">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="taskTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </div>

    <!-- 任务执行日志区域 -->
    <div class="task-log-section">
      <div class="section-header">
        <h3>任务执行日志</h3>
        <el-button @click="handleCleanLog" :loading="isOperationLoading">
          <el-icon><Delete /></el-icon>
          清理日志
        </el-button>
      </div>

      <!-- 日志搜索 -->
      <div class="log-search-bar">
        <el-input v-model="logSearchForm.taskName" placeholder="任务名称" style="width: 200px; margin-right: 10px" clearable>
          <template #prefix
            ><el-icon><Search /></el-icon
          ></template>
        </el-input>

        <el-select v-model="logSearchForm.status" placeholder="执行状态" style="width: 120px; margin-right: 10px" clearable>
          <el-option label="成功" value="success" />
          <el-option label="失败" value="failure" />
          <el-option label="运行中" value="running" />
        </el-select>

        <el-date-picker
          v-model="logSearchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 300px; margin-right: 10px"
        />

        <el-button type="primary" @click="handleLogSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>

        <el-button @click="handleLogReset">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>

      <!-- 日志列表 -->
      <el-table v-loading="isLogLoading" :data="logList" stripe border style="width: 100%; margin-top: 20px">
        <el-table-column prop="taskName" label="任务名称" min-width="150" />

        <el-table-column prop="startTime" label="开始时间" width="160" />

        <el-table-column prop="endTime" label="结束时间" width="160" />

        <el-table-column prop="duration" label="执行时长(ms)" width="140" />

        <el-table-column prop="status" label="执行状态" width="100">
          <template #default="scope">
            <el-tag :type="getLogStatusTagType(scope.row.status)">
              {{ getLogStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="errorMessage" label="错误信息" min-width="200" show-overflow-tooltip />

        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleViewLogDetail(scope.row)" :loading="isOperationLoading">
              <el-icon><View /></el-icon>
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 日志分页 -->
      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="logPagination.current"
          v-model:page-size="logPagination.size"
          :total="logTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleLogPageSizeChange"
          @current-change="handleLogPageCurrentChange"
        />
      </div>
    </div>

    <!-- 添加/编辑任务对话框 -->
    <el-dialog
      v-model="taskDialogVisible"
      :title="taskDialogTitle"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="taskFormRef" :model="taskForm" :rules="taskFormRules" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskForm.name" placeholder="请输入任务名称" />
        </el-form-item>

        <el-form-item label="任务描述" prop="description">
          <el-input v-model="taskForm.description" placeholder="请输入任务描述" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="taskForm.taskType" placeholder="请选择任务类型">
            <el-option v-for="type in taskTypes" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-select v-model="taskForm.priority" placeholder="请选择优先级">
            <el-option label="高" value="1" />
            <el-option label="中" value="2" />
            <el-option label="低" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="调度类型" prop="scheduleType">
          <el-radio-group v-model="taskForm.scheduleType">
            <el-radio label="cron">Cron表达式</el-radio>
            <el-radio label="interval">固定间隔</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Cron表达式" prop="cronExpression" v-if="taskForm.scheduleType === 'cron'">
          <el-input v-model="taskForm.cronExpression" placeholder="请输入Cron表达式" @blur="validateCron" />
          <div class="cron-hint" v-if="cronValidationResult">
            <el-icon :size="14" :color="cronValidationResult.valid ? 'green' : 'red'">
              {{ cronValidationResult.valid ? "Check" : "Close" }}
            </el-icon>
            {{ cronValidationResult.message }}
            <span v-if="cronValidationResult.nextExecutionTime">
              下次执行时间：{{ cronValidationResult.nextExecutionTime }}
            </span>
          </div>
        </el-form-item>

        <el-form-item label="执行间隔" prop="interval" v-if="taskForm.scheduleType === 'interval'">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input v-model.number="taskForm.interval" placeholder="请输入间隔数值" type="number" />
            </el-col>
            <el-col :span="12">
              <el-select v-model="taskForm.intervalUnit" placeholder="请选择单位">
                <el-option label="秒" value="second" />
                <el-option label="分钟" value="minute" />
                <el-option label="小时" value="hour" />
                <el-option label="天" value="day" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="执行参数" prop="executionParams">
          <el-input v-model="taskForm.executionParams" placeholder="请输入JSON格式的执行参数" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="taskDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveTask" :loading="isOperationLoading">
          {{ taskDialogMode === "add" ? "添加" : "保存" }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="logDetailDialogVisible"
      title="任务执行日志详情"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-descriptions :column="1" border :title="currentLog?.taskName">
        <el-descriptions-item label="开始时间">{{ currentLog?.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentLog?.endTime }}</el-descriptions-item>
        <el-descriptions-item label="执行时长">{{ currentLog?.duration }} ms</el-descriptions-item>
        <el-descriptions-item label="执行状态">
          <el-tag :type="getLogStatusTagType(currentLog?.status || '')">
            {{ getLogStatusLabel(currentLog?.status || "") }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="错误信息" v-if="currentLog?.errorMessage">
          <div class="error-message">{{ currentLog?.errorMessage }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="堆栈跟踪" v-if="currentLog?.stackTrace">
          <div class="stack-trace">
            <el-input v-model="currentLog.stackTrace" type="textarea" :rows="10" readonly />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="执行参数" v-if="currentLog?.executionParams">
          <div class="execution-params">
            <el-input v-model="JSON.stringify(currentLog.executionParams, null, 2)" type="textarea" :rows="5" readonly />
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="logDetailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="timingTask">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search, Refresh, Play, Pause, Edit, Delete, View, Check, Close } from "@element-plus/icons-vue";
import { useTimingTaskStore } from "@/stores/modules/timingTask";
import type { TimingTask, TaskExecutionLog } from "@/api/modules/timingTask";

// 状态管理
const timingTaskStore = useTimingTaskStore();

// 任务列表数据
const taskList = computed(() => timingTaskStore.getAllTasks);
const taskTotal = computed(() => timingTaskStore.getTaskTotal);
const isTaskLoading = computed(() => timingTaskStore.isTaskLoading);

// 日志列表数据
const logList = computed(() => timingTaskStore.getAllLogs);
const logTotal = computed(() => timingTaskStore.getLogTotal);
const isLogLoading = computed(() => timingTaskStore.isLogLoading);

// 任务类型
const taskTypes = computed(() => timingTaskStore.getTaskTypes);

// 操作加载状态
const isOperationLoading = computed(() => timingTaskStore.isOperationLoading);

// 分页参数
const pagination = reactive({
  current: 1,
  size: 10
});

const logPagination = reactive({
  current: 1,
  size: 10
});

// 任务列表查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  name: "",
  taskType: "",
  status: "",
  priority: ""
});

// 搜索表单
const searchForm = reactive({
  name: "",
  status: "",
  priority: undefined
});

const logSearchForm = reactive({
  taskName: "",
  status: "",
  dateRange: []
});

// 任务对话框
const taskDialogVisible = ref(false);
const taskDialogMode = ref<"add" | "edit">("add");
const taskDialogTitle = computed(() => (taskDialogMode.value === "add" ? "添加定时任务" : "编辑定时任务"));

const taskFormRef = ref();
const taskForm = reactive({
  id: "",
  name: "",
  description: "",
  taskType: "",
  priority: 2,
  scheduleType: "cron",
  cronExpression: "",
  interval: undefined,
  intervalUnit: "minute",
  executionParams: ""
});

// 表单验证规则
const taskFormRules = reactive({
  name: [
    { required: true, message: "请输入任务名称", trigger: "blur" },
    { min: 2, max: 50, message: "任务名称长度在 2 到 50 个字符", trigger: "blur" }
  ],
  description: [{ required: true, message: "请输入任务描述", trigger: "blur" }],
  taskType: [{ required: true, message: "请选择任务类型", trigger: "change" }],
  priority: [{ required: true, message: "请选择任务优先级", trigger: "change" }],
  scheduleType: [{ required: true, message: "请选择调度类型", trigger: "change" }],
  cronExpression: [
    { required: true, message: "请输入Cron表达式", trigger: "blur" },
    { validator: validateCronRule, trigger: "blur" }
  ],
  interval: [
    { required: true, message: "请输入执行间隔", trigger: "blur" },
    { type: "number", message: "执行间隔必须为数字", trigger: "blur" },
    { min: 1, message: "执行间隔必须大于等于1", trigger: "blur" }
  ],
  intervalUnit: [{ required: true, message: "请选择时间单位", trigger: "change" }]
});

// Cron验证结果
const cronValidationResult = ref<any>(null);

// Cron表达式验证规则
const validateCronRule = async (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入Cron表达式"));
    return;
  }

  try {
    const result = await timingTaskStore.validateCron(value);
    if (result.valid) {
      callback();
    } else {
      callback(new Error(result.message || "Cron表达式格式错误"));
    }
  } catch (error) {
    callback(new Error("验证失败，请检查Cron表达式格式"));
  }
};

// 日志详情对话框
const logDetailDialogVisible = ref(false);
const currentLog = ref<TaskExecutionLog | null>(null);

// 初始化数据
const initData = async () => {
  await loadTaskList();
  await loadLogList();
  await loadTaskTypes();
};

// 加载任务列表
const loadTaskList = async () => {
  await timingTaskStore.getTaskList({
    page: pagination.current,
    pageSize: pagination.size,
    ...searchForm
  });
};

// 加载日志列表
const loadLogList = async () => {
  const params: any = {
    page: logPagination.current,
    pageSize: logPagination.size,
    ...logSearchForm
  };

  if (logSearchForm.dateRange && logSearchForm.dateRange.length === 2) {
    params.startTime = logSearchForm.dateRange[0];
    params.endTime = logSearchForm.dateRange[1];
  }

  await timingTaskStore.getTaskLogList(params);
};

// 加载任务类型
const loadTaskTypes = async () => {
  await timingTaskStore.getTaskTypes();
};

// 搜索任务
const handleSearch = async () => {
  pagination.current = 1;
  await loadTaskList();
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    name: "",
    status: "",
    priority: undefined
  });
  handleSearch();
};

// 搜索日志
const handleLogSearch = async () => {
  logPagination.current = 1;
  await loadLogList();
};

// 重置日志搜索
const handleLogReset = () => {
  Object.assign(logSearchForm, {
    taskName: "",
    status: "",
    dateRange: []
  });
  handleLogSearch();
};

// 分页大小变化
const handlePageSizeChange = async (size: number) => {
  pagination.size = size;
  await loadTaskList();
};

// 分页当前页变化
const handlePageCurrentChange = async (current: number) => {
  pagination.current = current;
  await loadTaskList();
};

// 日志分页大小变化
const handleLogPageSizeChange = async (size: number) => {
  logPagination.size = size;
  await loadLogList();
};

// 日志分页当前页变化
const handleLogPageCurrentChange = async (current: number) => {
  logPagination.current = current;
  await loadLogList();
};

// 添加任务
const handleAddTask = () => {
  taskDialogMode.value = "add";
  resetTaskForm();
  taskDialogVisible.value = true;
};

// 编辑任务
const handleEditTask = (task: TimingTask) => {
  taskDialogMode.value = "edit";
  resetTaskForm();

  // 填充表单数据
  taskForm.id = task.id;
  taskForm.name = task.name;
  taskForm.description = task.description || "";
  taskForm.taskType = task.taskType;
  taskForm.priority = task.priority;
  taskForm.status = task.status;

  if (task.cronExpression) {
    taskForm.scheduleType = "cron";
    taskForm.cronExpression = task.cronExpression || "";
  } else if (task.interval && task.intervalUnit) {
    taskForm.scheduleType = "interval";
    taskForm.interval = task.interval;
    taskForm.intervalUnit = task.intervalUnit || "minute";
  }

  if (task.executionParams) {
    taskForm.executionParams = JSON.stringify(task.executionParams || {}, null, 2);
  }

  taskDialogVisible.value = true;
};

// 保存任务
const handleSaveTask = async () => {
  if (!taskFormRef.value) return;

  try {
    // 验证表单
    await taskFormRef.value.validate();

    // 处理执行参数
    let executionParams = null;
    if (taskForm.executionParams) {
      try {
        executionParams = JSON.parse(taskForm.executionParams);
      } catch (error) {
        ElMessage.error("执行参数格式错误，请输入有效的JSON");
        return;
      }
    }

    // 构造请求数据
    const requestData: any = {
      name: taskForm.name,
      description: taskForm.description,
      taskType: taskForm.taskType,
      priority: taskForm.priority,
      executionParams
    };

    if (taskForm.scheduleType === "cron") {
      requestData.cronExpression = taskForm.cronExpression;
    } else {
      requestData.interval = taskForm.interval;
      requestData.intervalUnit = taskForm.intervalUnit;
    }

    // 发送请求
    if (taskDialogMode.value === "add") {
      await timingTaskStore.createTask(requestData);
    } else {
      await timingTaskStore.updateTask({ ...requestData, id: taskForm.id });
    }

    // 关闭对话框并刷新数据
    taskDialogVisible.value = false;
    await loadTaskList();
  } catch (error) {
    console.error("保存任务失败:", error);
  }
};

// 启动任务
const handleStartTask = async (id: string) => {
  try {
    await timingTaskStore.startTask(id);
    await loadTaskList();
  } catch (error) {
    console.error("启动任务失败:", error);
  }
};

// 暂停任务
const handlePauseTask = async (id: string) => {
  try {
    await timingTaskStore.pauseTask(id);
    await loadTaskList();
  } catch (error) {
    console.error("暂停任务失败:", error);
  }
};

// 立即执行任务
const handleExecuteTask = async (id: string) => {
  try {
    await timingTaskStore.executeTask(id);
    ElMessage.success("任务执行请求已提交");
    // 延迟刷新日志列表，等待任务执行完成
    setTimeout(async () => {
      await loadLogList();
    }, 1000);
  } catch (error) {
    console.error("立即执行任务失败:", error);
  }
};

// 删除任务
const handleDeleteTask = async (id: string) => {
  try {
    await ElMessageBox.confirm("确定要删除该定时任务吗？", "删除确认", {
      type: "warning"
    });

    await timingTaskStore.deleteTask(id);
    await loadTaskList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除任务失败:", error);
    }
  }
};

// 清理日志
const handleCleanLog = async () => {
  try {
    await ElMessageBox.confirm("确定要清理任务执行日志吗？", "清理确认", {
      type: "warning"
    });

    await timingTaskStore.cleanTaskLog({});
    await loadLogList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("清理日志失败:", error);
    }
  }
};

// 查看日志详情
const handleViewLogDetail = (log: TaskExecutionLog) => {
  currentLog.value = { ...log };
  logDetailDialogVisible.value = true;
};

// 重置任务表单
const resetTaskForm = () => {
  Object.assign(taskForm, {
    id: "",
    name: "",
    description: "",
    taskType: "",
    priority: 2,
    scheduleType: "cron",
    cronExpression: "",
    interval: undefined,
    intervalUnit: "minute",
    executionParams: ""
  });

  if (taskFormRef.value) {
    taskFormRef.value.clearValidate();
  }

  cronValidationResult.value = null;
};

// 验证Cron表达式
const validateCron = async () => {
  if (!taskForm.cronExpression) {
    cronValidationResult.value = null;
    return;
  }

  try {
    const result = await timingTaskStore.validateCron(taskForm.cronExpression);
    cronValidationResult.value = result;
  } catch (error) {
    console.error("验证Cron表达式失败:", error);
    cronValidationResult.value = {
      valid: false,
      message: "验证失败，请检查Cron表达式格式"
    };
  }
};

// 获取任务类型标签类型
const getTaskTypeTagType = (taskType: string) => {
  const typeMap: Record<string, string> = {
    http: "primary",
    script: "success",
    email: "warning",
    database: "info"
  };
  return typeMap[taskType] || "default";
};

// 获取任务类型标签
const getTaskTypeLabel = (taskType: string) => {
  const labelMap: Record<string, string> = {
    http: "HTTP请求",
    script: "脚本执行",
    email: "邮件发送",
    database: "数据库操作"
  };
  return labelMap[taskType] || taskType;
};

// 获取优先级标签类型
const getPriorityTagType = (priority: number) => {
  switch (priority) {
    case 1:
      return "danger";
    case 2:
      return "warning";
    case 3:
      return "success";
    default:
      return "default";
  }
};

// 获取优先级标签
const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 1:
      return "高";
    case 2:
      return "中";
    case 3:
      return "低";
    default:
      return "未知";
  }
};

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "paused":
      return "warning";
    case "inactive":
      return "danger";
    default:
      return "default";
  }
};

// 获取状态标签
const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "活跃";
    case "paused":
      return "暂停";
    case "inactive":
      return "未激活";
    default:
      return "未知";
  }
};

// 获取日志状态标签类型
const getLogStatusTagType = (status: string) => {
  switch (status) {
    case "success":
      return "success";
    case "failure":
      return "danger";
    case "running":
      return "warning";
    default:
      return "default";
  }
};

// 获取日志状态标签
const getLogStatusLabel = (status: string) => {
  switch (status) {
    case "success":
      return "成功";
    case "failure":
      return "失败";
    case "running":
      return "运行中";
    default:
      return "未知";
  }
};

// 获取执行间隔文本
const getIntervalText = (task: TimingTask) => {
  if (task.interval && task.intervalUnit) {
    const unitMap: Record<string, string> = {
      second: "秒",
      minute: "分钟",
      hour: "小时",
      day: "天"
    };
    return `${task.interval} ${unitMap[task.intervalUnit]}`;
  }
  return "-";
};

// 组件挂载时初始化数据
onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.timing-task-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-left {
  .page-title {
    margin: 0 0 5px 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .page-subtitle {
    margin: 0;
    font-size: 14px;
    color: #606266;
  }
}

.task-list-section,
.task-log-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-filter-bar,
.log-search-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.cron-hint {
  margin-top: 5px;
  font-size: 12px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 5px;
}

.error-message {
  padding: 10px;
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
  color: #f56c6c;
  font-size: 13px;
  line-height: 1.5;
}

.stack-trace,
.execution-params {
  .el-textarea__inner {
    font-family: "Consolas", "Monaco", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>
