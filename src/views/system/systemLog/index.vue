<template>
  <div class="card content-box">
    <!-- 搜索区域 -->
    <div class="search-box">
      <el-form :model="searchForm" inline @submit.prevent="handleSearch">
        <el-form-item label="日志级别">
          <el-select v-model="searchForm.level" placeholder="请选择" clearable>
            <el-option label="信息" value="info" />
            <el-option label="警告" value="warn" />
            <el-option label="错误" value="error" />
            <el-option label="调试" value="debug" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.operationType" placeholder="请选择" clearable>
            <el-option label="登录" value="login" />
            <el-option label="登出" value="logout" />
            <el-option label="创建" value="create" />
            <el-option label="更新" value="update" />
            <el-option label="删除" value="delete" />
            <el-option label="查询" value="query" />
            <el-option label="导出" value="export" />
            <el-option label="导入" value="import" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="请求URL">
          <el-input
            v-model="searchForm.requestUrl"
            placeholder="请输入请求URL"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="operation-box">
      <el-button type="success" icon="Download" @click="handleExport">
        导出日志
      </el-button>
      <el-button type="danger" icon="Delete" @click="handleClear" :disabled="logList.length === 0">
        清空日志
      </el-button>
      <span class="total-count">共 {{ total }} 条日志</span>
    </div>

    <!-- 日志表格 -->
    <div class="table-box">
      <el-table
        v-loading="loading"
        :data="logList"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="level" label="日志级别" width="120" align="center">
          <template #default="scope">
            <el-tag
              :type="getLogLevelTagType(scope.row.level)"
              size="small"
            >
              {{ getLogLevelLabel(scope.row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationType" label="操作类型" width="120" align="center">
          <template #default="scope">
            <el-tag type="info" size="small">
              {{ getOperationTypeLabel(scope.row.operationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="requestUrl" label="请求URL" min-width="200" show-overflow-tooltip />
        <el-table-column prop="requestMethod" label="请求方法" width="100" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.requestMethod === 'GET' ? 'info' : 'warning'"
              size="small"
            >
              {{ scope.row.requestMethod }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="statusCode" label="状态码" width="100" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.statusCode >= 200 && scope.row.statusCode < 300 ? 'success' : 'danger'"
              size="small"
            >
              {{ scope.row.statusCode }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="executionTime" label="执行时间(ms)" width="120" align="center">
          <template #default="scope">
            <span :class="scope.row.executionTime && scope.row.executionTime > 1000 ? 'text-danger' : ''">
              {{ scope.row.executionTime || '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="operationTime" label="操作时间" width="200" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP地址" width="150" />
        <el-table-column prop="module" label="模块" width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button
              type="text"
              icon="View"
              size="small"
              @click="viewDetail(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="日志详情"
      width="70%"
      @close="closeDetailDialog"
    >
      <el-form label-width="120px" v-if="selectedLog">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="日志级别">
              <el-tag :type="getLogLevelTagType(selectedLog.level)">
                {{ getLogLevelLabel(selectedLog.level) }}
              </el-tag>
            </el-form-item>
            <el-form-item label="操作类型">
              <el-tag type="info">{{ getOperationTypeLabel(selectedLog.operationType) }}</el-tag>
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ selectedLog.username }}</span>
            </el-form-item>
            <el-form-item label="用户ID">
              <span>{{ selectedLog.userId }}</span>
            </el-form-item>
            <el-form-item label="请求URL">
              <span>{{ selectedLog.requestUrl }}</span>
            </el-form-item>
            <el-form-item label="请求方法">
              <el-tag
                :type="selectedLog.requestMethod === 'GET' ? 'info' : 'warning'"
              >
                {{ selectedLog.requestMethod }}
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态码">
              <el-tag
                :type="selectedLog.statusCode && selectedLog.statusCode >= 200 && selectedLog.statusCode < 300 ? 'success' : 'danger'"
              >
                {{ selectedLog.statusCode || '-' }}
              </el-tag>
            </el-form-item>
            <el-form-item label="执行时间">
              <span>{{ selectedLog.executionTime ? `${selectedLog.executionTime}ms` : '-' }}</span>
            </el-form-item>
            <el-form-item label="IP地址">
              <span>{{ selectedLog.ipAddress }}</span>
            </el-form-item>
            <el-form-item label="模块">
              <span>{{ selectedLog.module || '-' }}</span>
            </el-form-item>
            <el-form-item label="操作时间">
              <span>{{ selectedLog.operationTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="请求参数" v-if="selectedLog.requestParams">
          <el-input
            type="textarea"
            :value="JSON.stringify(selectedLog.requestParams, null, 2)"
            readonly
            style="font-family: monospace"
          />
        </el-form-item>
        
        <el-form-item label="响应数据" v-if="selectedLog.responseData">
          <el-input
            type="textarea"
            :value="JSON.stringify(selectedLog.responseData, null, 2)"
            readonly
            style="font-family: monospace"
          />
        </el-form-item>
        
        <el-form-item label="错误信息" v-if="selectedLog.errorMessage">
          <el-input
            type="textarea"
            :value="selectedLog.errorMessage"
            readonly
            class="error-message"
          />
        </el-form-item>
        
        <el-form-item label="User Agent">
          <el-input
            type="textarea"
            :value="selectedLog.userAgent"
            readonly
            :rows="3"
            style="font-family: monospace"
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemLog">
import type { SystemLog } from '@/api/interface';
import type { ResPage } from '@/api/interface';
import { getSystemLogListApi, exportSystemLogApi, clearSystemLogApi, deleteSystemLogApi } from '@/api/modules/systemLog';
import { ElMessage, ElMessageBox } from 'element-plus';
import { usePagination } from '@/hooks/useTable';
import logger from '@/utils/logger';

const loading = ref(false);
const logList = ref<SystemLog.ResLogList[]>([]);
const total = ref(0);
const selectedRows = ref<SystemLog.ResLogList[]>([]);
const detailDialogVisible = ref(false);
const selectedLog = ref<SystemLog.ResLogList | null>(null);

// 分页配置
const pagination = usePagination({
  pageNum: 1,
  pageSize: 20,
  total: 0,
});

// 搜索表单
const searchForm = ref({
  level: undefined as SystemLog.LogLevel | undefined,
  operationType: undefined as SystemLog.OperationType | undefined,
  username: '',
  requestUrl: '',
  dateRange: [] as string[],
});

// 获取日志级别标签类型
const getLogLevelTagType = (level: SystemLog.LogLevel): string => {
  switch (level) {
    case 'info':
      return 'info';
    case 'warn':
      return 'warning';
    case 'error':
      return 'danger';
    case 'debug':
      return 'success';
    default:
      return '';
  }
};

// 获取日志级别显示标签
const getLogLevelLabel = (level: SystemLog.LogLevel): string => {
  switch (level) {
    case 'info':
      return '信息';
    case 'warn':
      return '警告';
    case 'error':
      return '错误';
    case 'debug':
      return '调试';
    default:
      return level;
  }
};

// 获取操作类型显示标签
const getOperationTypeLabel = (type: SystemLog.OperationType): string => {
  switch (type) {
    case 'login':
      return '登录';
    case 'logout':
      return '登出';
    case 'create':
      return '创建';
    case 'update':
      return '更新';
    case 'delete':
      return '删除';
    case 'query':
      return '查询';
    case 'export':
      return '导出';
    case 'import':
      return '导入';
    default:
      return type;
  }
};

// 加载日志列表
const loadLogList = async () => {
  loading.value = true;
  
  try {
    const params: SystemLog.ReqLogParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      level: searchForm.value.level,
      operationType: searchForm.value.operationType,
      username: searchForm.value.username || undefined,
      requestUrl: searchForm.value.requestUrl || undefined,
      startTime: searchForm.value.dateRange[0] || undefined,
      endTime: searchForm.value.dateRange[1] || undefined,
    };
    
    const res = await getSystemLogListApi(params);
    logList.value = res.data.list;
    total.value = res.data.total;
    pagination.total = res.data.total;
    
    logger.info('系统日志列表加载完成', {
      total: res.data.total,
      page: params.pageNum,
      pageSize: params.pageSize,
    });
  } catch (error) {
    logger.error('系统日志列表加载失败', error as Error);
    ElMessage.error('获取日志列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1;
  loadLogList();
};

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    level: undefined,
    operationType: undefined,
    username: '',
    requestUrl: '',
    dateRange: [],
  };
  pagination.pageNum = 1;
  loadLogList();
};

// 页面大小改变
const handlePageSizeChange = () => {
  loadLogList();
};

// 页面改变
const handlePageChange = () => {
  loadLogList();
};

// 导出日志
const handleExport = async () => {
  try {
    await ElMessageBox.confirm('确定要导出所有日志吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });
    
    const params: SystemLog.ReqLogParams = {
      pageNum: 1,
      pageSize: 9999,
      level: searchForm.value.level,
      operationType: searchForm.value.operationType,
      username: searchForm.value.username || undefined,
      requestUrl: searchForm.value.requestUrl || undefined,
      startTime: searchForm.value.dateRange[0] || undefined,
      endTime: searchForm.value.dateRange[1] || undefined,
    };
    
    const res = await exportSystemLogApi(params);
    ElMessage.success('日志导出成功');
    logger.info('日志导出成功', {
      total: total.value,
      params,
    });
    
    // 这里可以添加文件下载逻辑
  } catch (error) {
    if (error !== 'cancel') {
      logger.error('日志导出失败', error as Error);
      ElMessage.error('日志导出失败');
    }
  }
};

// 清空日志
const handleClear = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有日志吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await clearSystemLogApi();
    ElMessage.success('日志清空成功');
    logger.info('日志清空成功');
    loadLogList();
  } catch (error) {
    if (error !== 'cancel') {
      logger.error('日志清空失败', error as Error);
      ElMessage.error('日志清空失败');
    }
  }
};

// 选择行变化
const handleSelectionChange = (val: SystemLog.ResLogList[]) => {
  selectedRows.value = val;
};

// 查看详情
const viewDetail = (row: SystemLog.ResLogList) => {
  selectedLog.value = row;
  detailDialogVisible.value = true;
  logger.info('查看日志详情', { logId: row.id });
};

// 关闭详情对话框
const closeDetailDialog = () => {
  selectedLog.value = null;
};

// 页面加载时获取日志列表
onMounted(() => {
  loadLogList();
  logger.info('系统日志页面已加载');
});
</script>

<style lang="scss" scoped>
.card {
  margin: 20px;
}

.search-box {
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.operation-box {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .total-count {
    color: #606266;
    font-size: 14px;
  }
}

.table-box {
  background: #ffffff;
  border-radius: 8px;
  
  .pagination-box {
    padding: 20px;
    text-align: right;
  }
}

.error-message {
  background: #fef0f0;
  color: #f56c6c;
  
  &:hover {
    background: #fef0f0;
  }
}
</style>