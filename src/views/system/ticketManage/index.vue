<template>
  <div class="ticket-manage">
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="工单编号">
          <el-input v-model="searchForm.ticketNumber" placeholder="请输入工单编号" clearable />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="searchForm.customerName" placeholder="请输入客户名称" clearable />
        </el-form-item>
        <el-form-item label="工单状态">
          <el-select v-model="searchForm.status" placeholder="请选择工单状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-select v-model="searchForm.priority" placeholder="请选择紧急程度" clearable>
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="searchForm.submitTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleCreate">创建工单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="工单编号" prop="ticketNumber" width="150" />
        <el-table-column label="客户名称" prop="customerName" width="120" />
        <el-table-column label="提交时间" prop="submitTime" width="180" />
        <el-table-column label="紧急程度" prop="priority" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityTagType(row.priority)">{{ getPriorityText(row.priority) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="工单状态" prop="status" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理人" prop="handlerName" width="120" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 工单详情对话框 -->
    <el-dialog v-model="dialogVisible" title="工单详情" width="80%" :close-on-click-modal="false">
      <div v-if="selectedTicket" class="ticket-detail">
        <el-form :model="selectedTicket" label-width="120px">
          <el-form-item label="工单编号">
            <span>{{ selectedTicket.ticketNumber }}</span>
          </el-form-item>
          <el-form-item label="客户名称">
            <span>{{ selectedTicket.customerName }}</span>
          </el-form-item>
          <el-form-item label="客户联系方式">
            <span>{{ selectedTicket.customerContact }}</span>
          </el-form-item>
          <el-form-item label="提交时间">
            <span>{{ selectedTicket.submitTime }}</span>
          </el-form-item>
          <el-form-item label="紧急程度">
            <el-tag :type="getPriorityTagType(selectedTicket.priority)">{{ getPriorityText(selectedTicket.priority) }}</el-tag>
          </el-form-item>
          <el-form-item label="工单状态">
            <el-tag :type="getStatusTagType(selectedTicket.status)">{{ getStatusText(selectedTicket.status) }}</el-tag>
          </el-form-item>
          <el-form-item label="处理人">
            <span>{{ selectedTicket.handlerName }}</span>
          </el-form-item>
          <el-form-item label="问题描述">
            <span style="white-space: pre-wrap">{{ selectedTicket.description }}</span>
          </el-form-item>
          <el-form-item label="相关附件">
            <div v-if="selectedTicket.attachments && selectedTicket.attachments.length > 0" class="attachments">
              <el-link
                v-for="attachment in selectedTicket.attachments"
                :key="attachment.id"
                :href="attachment.url"
                target="_blank"
                >{{ attachment.name }}</el-link
              >
            </div>
            <span v-else>无</span>
          </el-form-item>
        </el-form>

        <el-divider content-position="left">处理记录</el-divider>
        <el-timeline v-if="selectedTicket.processingRecords && selectedTicket.processingRecords.length > 0">
          <el-timeline-item
            v-for="record in selectedTicket.processingRecords"
            :key="record.id"
            :timestamp="record.processingTime"
          >
            <el-card shadow="never">
              <template #header>
                <div class="card-header">
                  <span>{{ record.handlerName }}</span>
                  <el-tag :type="getResultTagType(record.processingResult)">{{ getResultText(record.processingResult) }}</el-tag>
                </div>
              </template>
              <p>{{ record.processingContent }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <div v-else class="no-records">无处理记录</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTicketList, deleteTicket, getTicketDetail } from "@/api/modules/ticket";
import type { Ticket } from "@/api/modules/ticket";

// 搜索表单数据
const searchForm = ref({
  ticketNumber: "",
  customerName: "",
  status: "",
  priority: "",
  submitTime: []
});

// 表格数据
const tableData = ref<any[]>([]);

// 加载状态
const loading = ref(false);

// 分页数据
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 选中的行数据
const selectedRows = ref<any[]>([]);

// 工单详情对话框可见性
const dialogVisible = ref(false);

// 选中的工单
const selectedTicket = ref<any>(null);

// 页面加载时获取工单列表
onMounted(() => {
  getTicketList();
});

// 获取工单列表
const getTicketList = async () => {
  loading.value = true;
  try {
    const params: Ticket.ReqTicketParams = {
      ticketNumber: searchForm.value.ticketNumber,
      customerName: searchForm.value.customerName,
      status: searchForm.value.status,
      priority: searchForm.value.priority,
      submitTime: searchForm.value.submitTime,
      pageNum: pagination.value.currentPage,
      pageSize: pagination.value.pageSize
    };

    const { data } = await getTicketList(params);
    tableData.value = data.records;
    pagination.value.total = data.total;
  } catch (error) {
    ElMessage.error("获取工单列表失败");
  } finally {
    loading.value = false;
  }
};

// 处理查询
const handleSearch = () => {
  pagination.value.currentPage = 1;
  getTicketList();
};

// 处理重置
const handleReset = () => {
  searchForm.value = {
    ticketNumber: "",
    customerName: "",
    status: "",
    priority: "",
    submitTime: []
  };
  pagination.value.currentPage = 1;
  getTicketList();
};

// 处理创建工单
const handleCreate = () => {
  // 这里应该打开创建工单的对话框
  ElMessage.info("创建工单功能尚未实现");
};

// 处理查看工单
const handleView = async (row: any) => {
  try {
    const { data } = await getTicketDetail({ id: row.id });
    selectedTicket.value = data;
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取工单详情失败");
  }
};

// 处理编辑工单
const handleEdit = () => {
  // 这里应该打开编辑工单的对话框
  ElMessage.info("编辑工单功能尚未实现");
};

// 处理删除工单
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm("确定要删除这条工单吗？", "删除确认", {
      type: "warning"
    });

    await deleteTicket({ ids: [row.id] });

    const index = tableData.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      tableData.value.splice(index, 1);
      pagination.value.total--;
    }

    ElMessage.success("删除工单成功");
  } catch (error) {
    // 如果用户取消删除，则不做任何处理
    if ((error as any).message !== "cancel") {
      ElMessage.error("删除工单失败");
    }
  }
};

// 处理选择行变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.currentPage = 1;
  getTicketList();
};

// 处理分页当前页变化
const handleCurrentChange = (page: number) => {
  pagination.value.currentPage = page;
  getTicketList();
};

// 获取优先级标签类型
const getPriorityTagType = (priority: string) => {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "info";
  }
};

// 获取优先级文本
const getPriorityText = (priority: string) => {
  switch (priority) {
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
    default:
      return "未知";
  }
};

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "processing":
      return "primary";
    case "resolved":
      return "success";
    case "closed":
      return "info";
    default:
      return "info";
  }
};

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "待处理";
    case "processing":
      return "处理中";
    case "resolved":
      return "已解决";
    case "closed":
      return "已关闭";
    default:
      return "未知";
  }
};

// 获取处理结果标签类型
const getResultTagType = (result: string) => {
  switch (result) {
    case "processing":
      return "primary";
    case "resolved":
      return "success";
    case "failed":
      return "danger";
    default:
      return "info";
  }
};

// 获取处理结果文本
const getResultText = (result: string) => {
  switch (result) {
    case "processing":
      return "处理中";
    case "resolved":
      return "已解决";
    case "failed":
      return "处理失败";
    default:
      return "未知";
  }
};
</script>

<style scoped>
.ticket-manage {
  padding: 20px;
}
.search-card {
  margin-bottom: 20px;
}
.search-form {
  margin-bottom: 0;
}
.table-card {
  margin-bottom: 20px;
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.ticket-detail {
  padding: 20px;
}
.attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.no-records {
  padding: 20px;
  color: #909399;
  text-align: center;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
