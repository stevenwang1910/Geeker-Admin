<template>
  <div class="card content-box">
    <div class="page-header">
      <h2>系统日志</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleExport" :loading="exportLoading">
          <el-icon><Download /></el-icon>
          导出日志
        </el-button>
        <el-button type="danger" @click="handleClear" :loading="clearLoading">
          <el-icon><Delete /></el-icon>
          清空日志
        </el-button>
      </div>
    </div>

    <el-form :model="searchForm" class="search-form" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="操作用户">
            <el-input v-model="searchForm.username" placeholder="请输入操作用户" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="操作类型">
            <el-select v-model="searchForm.operation" placeholder="请选择操作类型">
              <el-option label="登录" value="login" />
              <el-option label="登出" value="logout" />
              <el-option label="新增" value="create" />
              <el-option label="编辑" value="update" />
              <el-option label="删除" value="delete" />
              <el-option label="查询" value="query" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="日志级别">
            <el-select v-model="searchForm.level" placeholder="请选择日志级别">
              <el-option label="信息" value="info" />
              <el-option label="警告" value="warn" />
              <el-option label="错误" value="error" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-actions">
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>
    </el-form>

    <div class="table-container">
      <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="日志ID" width="180" />
        <el-table-column prop="username" label="操作用户" width="120" />
        <el-table-column prop="operation" label="操作类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getOperationTagType(row.operation)">
              {{ getOperationTagLabel(row.operation) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="日志级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.level)">
              {{ getLevelTagLabel(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column prop="requestUrl" label="请求URL" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="操作时间" width="180" />
        <el-table-column prop="errorMsg" label="错误信息" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="日志详情" width="800px" :close-on-click-modal="false">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="日志ID">
          {{ selectedLog?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="操作用户">
          {{ selectedLog?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getOperationTagType(selectedLog?.operation || '')">
            {{ getOperationTagLabel(selectedLog?.operation || "") }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="日志级别">
          <el-tag :type="getLevelTagType(selectedLog?.level || '')">
            {{ getLevelTagLabel(selectedLog?.level || "") }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">
          {{ selectedLog?.ip }}
        </el-descriptions-item>
        <el-descriptions-item label="请求方法">
          {{ selectedLog?.requestMethod }}
        </el-descriptions-item>
        <el-descriptions-item label="请求URL" :span="2">
          {{ selectedLog?.requestUrl }}
        </el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <pre class="param-pre">{{ selectedLog?.requestParams || "无" }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="响应数据" :span="2">
          <pre class="param-pre">{{ selectedLog?.responseData || "无" }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="错误信息" :span="2">
          <pre class="param-pre text-danger">{{ selectedLog?.errorMsg || "无" }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="操作时间" :span="2">
          {{ selectedLog?.createdAt }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemLog">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, Download, Delete, View } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";

// API
import { getSystemLogList, clearSystemLog, exportSystemLog } from "@/api/modules/systemLog";

// 搜索表单
const searchForm = reactive({
  username: "",
  operation: "",
  level: ""
});

// 日期范围
const dateRange = ref<string[]>([]);

// 表格数据
const tableData = ref<any[]>([]);
const tableLoading = ref(false);

// 分页
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});

// 选择的日志
const selectedLogs = ref<any[]>([]);
const selectedLog = ref<any>(null);

// 详情弹窗
const detailVisible = ref(false);

// 加载状态
const exportLoading = ref(false);
const clearLoading = ref(false);

// 获取日志列表
const getLogList = async () => {
  tableLoading.value = true;
  try {
    const params = {
      ...searchForm,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      startTime: dateRange.value[0] || undefined,
      endTime: dateRange.value[1] || undefined
    };

    const { data } = await getSystemLogList(params);
    tableData.value = data.list;
    pagination.total = data.total;
  } catch (error) {
    ElMessage.error("获取日志列表失败");
  } finally {
    tableLoading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1;
  getLogList();
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    username: "",
    operation: "",
    level: ""
  });
  dateRange.value = [];
  pagination.pageNum = 1;
  getLogList();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  getLogList();
};

// 分页当前页变化
const handleCurrentChange = (page: number) => {
  pagination.pageNum = page;
  getLogList();
};

// 选择项变化
const handleSelectionChange = (selection: any[]) => {
  selectedLogs.value = selection;
};

// 查看详情
const handleView = (row: any) => {
  selectedLog.value = row;
  detailVisible.value = true;
};

// 导出日志
const handleExport = async () => {
  exportLoading.value = true;
  try {
    const params = {
      ...searchForm,
      startTime: dateRange.value[0] || undefined,
      endTime: dateRange.value[1] || undefined
    };

    await useDownload(exportSystemLog, "系统日志", params);
    ElMessage.success("日志导出成功");
  } catch (error) {
    ElMessage.error("日志导出失败");
  } finally {
    exportLoading.value = false;
  }
};

// 清空日志
const handleClear = async () => {
  try {
    await ElMessageBox.confirm("确定要清空所有系统日志吗？此操作不可恢复！", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    clearLoading.value = true;
    await clearSystemLog();
    ElMessage.success("日志清空成功");
    getLogList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("日志清空失败");
    }
  } finally {
    clearLoading.value = false;
  }
};

// 获取操作类型标签类型
const getOperationTagType = (operation: string) => {
  const typeMap: Record<string, string> = {
    login: "success",
    logout: "info",
    create: "primary",
    update: "warning",
    delete: "danger",
    query: "info"
  };
  return typeMap[operation] || "info";
};

// 获取操作类型标签文本
const getOperationTagLabel = (operation: string) => {
  const labelMap: Record<string, string> = {
    login: "登录",
    logout: "登出",
    create: "新增",
    update: "编辑",
    delete: "删除",
    query: "查询"
  };
  return labelMap[operation] || operation;
};

// 获取日志级别标签类型
const getLevelTagType = (level: string) => {
  const typeMap: Record<string, string> = {
    info: "success",
    warn: "warning",
    error: "danger"
  };
  return typeMap[level] || "info";
};

// 获取日志级别标签文本
const getLevelTagLabel = (level: string) => {
  const labelMap: Record<string, string> = {
    info: "信息",
    warn: "警告",
    error: "错误"
  };
  return labelMap[level] || level;
};

// 页面加载时获取日志列表
onMounted(() => {
  getLogList();
});
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.search-form {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fafafa;
  border-radius: 8px;
}
.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
}
.table-container {
  margin-top: 20px;
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.param-pre {
  padding: 8px;
  margin: 0;
  overflow-x: auto;
  background-color: #f5f5f5;
  border-radius: 4px;
}
.text-danger {
  color: #f56c6c;
}
.dialog-footer {
  text-align: right;
}
</style>
