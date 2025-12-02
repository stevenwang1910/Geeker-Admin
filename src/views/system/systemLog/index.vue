<template>
  <div class="card content-box">
    <div class="system-log-header">
      <el-button type="primary" @click="refreshLogs">刷新日志</el-button>
      <el-button type="danger" @click="clearLogs" :loading="clearLoading">清空日志</el-button>
    </div>
    <ProTable
      :columns="columns"
      :request="getSystemLogs"
      :row-key="row => row.timestamp"
      :pagination="false"
      :search-show="false"
      :toolbar="false"
    >
      <template #bodyCell="{ column, row }">
        <template v-if="column.prop === 'level'">
          <el-tag :type="getLevelTagType(row.level)">{{ row.level }}</el-tag>
        </template>
        <template v-else-if="column.prop === 'request' || column.prop === 'response'">
          <el-button type="text" @click="showJson(row[column.prop], column.label)"> 查看详情 </el-button>
        </template>
        <template v-else-if="column.prop === 'error'">
          <el-popover trigger="hover" placement="top">
            <template #default>
              <pre>{{ row.error }}</pre>
            </template>
            <template #reference>
              <span>{{ row.error?.substring(0, 50) }}...</span>
            </template>
          </el-popover>
        </template>
      </template>
    </ProTable>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="60%">
      <el-input :model-value="jsonContent" type="textarea" :rows="20" readonly />
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemLog">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { logger, LogLevel } from "@/utils";

const columns = [
  {
    label: "时间",
    prop: "timestamp",
    width: 200,
    formatter: (row: any) => {
      return new Date(row.timestamp).toLocaleString();
    }
  },
  {
    label: "日志级别",
    prop: "level",
    width: 100
  },
  {
    label: "用户ID",
    prop: "userId",
    width: 120
  },
  {
    label: "用户名",
    prop: "username",
    width: 120
  },
  {
    label: "操作类型",
    prop: "operation",
    minWidth: 150
  },
  {
    label: "IP地址",
    prop: "ip",
    width: 120
  },
  {
    label: "请求参数",
    prop: "request",
    width: 120
  },
  {
    label: "响应结果",
    prop: "response",
    width: 120
  },
  {
    label: "错误信息",
    prop: "error",
    minWidth: 200
  }
];

const dialogVisible = ref(false);
const dialogTitle = ref("");
const jsonContent = ref("");
const clearLoading = ref(false);

function getLevelTagType(level: LogLevel) {
  switch (level) {
    case LogLevel.INFO:
      return "success";
    case LogLevel.WARN:
      return "warning";
    case LogLevel.ERROR:
      return "danger";
    case LogLevel.DEBUG:
      return "info";
    default:
      return "info";
  }
}

function showJson(data: any, title: string) {
  dialogTitle.value = title;
  jsonContent.value = JSON.stringify(data, null, 2);
  dialogVisible.value = true;
}

function getSystemLogs() {
  const logs = logger.getLogs();
  return Promise.resolve({
    list: logs,
    total: logs.length
  });
}

function refreshLogs() {
  // 触发ProTable刷新
  window.dispatchEvent(new Event("pro-table-refresh"));
}

function clearLogs() {
  ElMessageBox.confirm("此操作将永久清除所有系统日志, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      clearLoading.value = true;
      setTimeout(() => {
        logger.clearLogs();
        refreshLogs();
        clearLoading.value = false;
        ElMessage.success("日志清空成功!");
      }, 500);
    })
    .catch(() => {
      ElMessage.info("已取消清空日志");
    });
}

// 页面加载时记录访问日志
logger.info("系统日志页面访问", {
  request: {
    path: "/system/systemLog"
  }
});

// 添加mock测试数据
const addMockLogs = () => {
  const existingLogs = logger.getLogs();
  if (existingLogs.length === 0) {
    // 生成一些示例日志
    logger.info("用户登录", {
      userId: "admin",
      username: "超级管理员",
      request: {
        username: "admin",
        password: "******"
      },
      response: {
        code: 200,
        message: "登录成功"
      }
    });

    logger.info("获取用户列表", {
      userId: "admin",
      username: "超级管理员",
      request: {
        page: 1,
        size: 10
      },
      response: {
        code: 200,
        data: [
          { id: 1, username: "admin" },
          { id: 2, username: "test" }
        ]
      }
    });

    logger.warn("权限不足", {
      userId: "test",
      username: "测试用户",
      request: {
        path: "/system/role"
      }
    });

    logger.error("接口调用失败", {
      userId: "admin",
      username: "超级管理员",
      request: {
        path: "/system/user/1"
      },
      error: new Error("网络连接超时")
    });

    logger.debug("调试信息", {
      userId: "admin",
      username: "超级管理员",
      request: {
        debug: true
      }
    });

    // 刷新表格显示mock数据
    refreshLogs();
  }
};

// 页面加载时添加mock数据
addMockLogs();
</script>

<style scoped>
.system-log-header {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
