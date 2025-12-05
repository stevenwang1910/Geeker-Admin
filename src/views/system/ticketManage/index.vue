<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="客户工单管理"
      highlight-current-row
      :columns="columns"
      :request-api="getTicketList"
      @row-click="rowClick"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增工单</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除工单
        </el-button>
        <el-button type="success" :icon="Download" plain @click="handleExport">导出工单</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="handleView(scope.row)">查看详情</el-button>
        <el-button type="primary" link :icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Refresh" @click="handleProcess(scope.row)">处理</el-button>
        <el-button type="danger" link :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </ProTable>

    <!-- 工单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工单详情"
      width="800px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-if="ticketDetail" class="ticket-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="工单编号">{{ ticketDetail.ticketNo }}</el-descriptions-item>
          <el-descriptions-item label="客户姓名">{{ ticketDetail.customerName }}</el-descriptions-item>
          <el-descriptions-item label="客户电话">{{ ticketDetail.customerPhone }}</el-descriptions-item>
          <el-descriptions-item label="客户邮箱" v-if="ticketDetail.customerEmail">
            {{ ticketDetail.customerEmail }}
          </el-descriptions-item>
          <el-descriptions-item label="紧急程度">{{ getPriorityLabel(ticketDetail.priority) }}</el-descriptions-item>
          <el-descriptions-item label="工单状态">{{ getStatusLabel(ticketDetail.status) }}</el-descriptions-item>
          <el-descriptions-item label="工单标题">{{ ticketDetail.title }}</el-descriptions-item>
          <el-descriptions-item label="问题描述">{{ ticketDetail.description }}</el-descriptions-item>
          <el-descriptions-item label="负责人" v-if="ticketDetail.assigneeName">
            {{ ticketDetail.assigneeName }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ ticketDetail.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ ticketDetail.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="解决时间" v-if="ticketDetail.resolveTime">
            {{ ticketDetail.resolveTime }}
          </el-descriptions-item>
          <el-descriptions-item label="关闭时间" v-if="ticketDetail.closeTime">{{ ticketDetail.closeTime }}</el-descriptions-item>
        </el-descriptions>

        <div class="processing-records" v-if="ticketDetail.processingRecords && ticketDetail.processingRecords.length > 0">
          <h3>处理记录</h3>
          <el-timeline>
            <el-timeline-item
              v-for="record in ticketDetail.processingRecords"
              :key="record.id"
              :timestamp="record.processTime"
              placement="top"
            >
              <el-card>
                <div class="record-header">
                  <span class="processor">{{ record.processorName }}</span>
                </div>
                <div class="record-content">{{ record.content }}</div>
                <div class="record-result" v-if="record.result">{{ record.result }}</div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>

    <!-- 工单表单对话框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="formTitle"
      width="700px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form ref="formRef" :model="formData" label-width="120px" :rules="formRules">
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="formData.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="客户电话" prop="customerPhone">
          <el-input v-model="formData.customerPhone" placeholder="请输入客户电话" />
        </el-form-item>
        <el-form-item label="客户邮箱" prop="customerEmail">
          <el-input v-model="formData.customerEmail" placeholder="请输入客户邮箱" />
        </el-form-item>
        <el-form-item label="紧急程度" prop="priority">
          <el-select v-model="formData.priority" placeholder="请选择紧急程度">
            <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入工单标题" />
        </el-form-item>
        <el-form-item label="问题描述" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="4" placeholder="请输入问题描述" />
        </el-form-item>
        <el-form-item label="负责人" prop="assigneeId">
          <el-select v-model="formData.assigneeId" placeholder="请选择负责人">
            <!-- 这里可以根据实际情况动态加载用户列表 -->
            <el-option label="未分配" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="附件">
          <UploadImgs v-model:file-list="formData.attachments" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="formDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 处理工单对话框 -->
    <el-dialog
      v-model="processDialogVisible"
      title="处理工单"
      width="600px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form ref="processFormRef" :model="processFormData" label-width="100px" :rules="processFormRules">
        <el-form-item label="工单状态" prop="status">
          <el-select v-model="processFormData.status" placeholder="请选择工单状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理内容" prop="content">
          <el-input v-model="processFormData.content" type="textarea" rows="4" placeholder="请输入处理内容" />
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-input v-model="processFormData.result" type="textarea" rows="3" placeholder="请输入处理结果" />
        </el-form-item>
        <el-form-item label="附件">
          <UploadImgs v-model:file-list="processFormData.attachments" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleProcessSubmit">提交</el-button>
          <el-button @click="processDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Ticket } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import { CirclePlus, Delete, Download, View, Edit, Refresh } from "@element-plus/icons-vue";
import type { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import {
  getTicketList,
  getTicketDetail,
  addTicket,
  editTicket,
  deleteTicket,
  processTicket,
  getTicketPriority,
  getTicketStatus,
  exportTicketInfo
} from "@/api/modules/ticket";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 对话框状态
const detailDialogVisible = ref(false);
const formDialogVisible = ref(false);
const processDialogVisible = ref(false);
const formTitle = ref("");

// 表单引用
const formRef = ref<any>();
const processFormRef = ref<any>();

// 数据
const ticketDetail = ref<Ticket.ResTicketDetail | null>(null);
const priorityOptions = ref<Ticket.ResPriority[]>([]);
const statusOptions = ref<Ticket.ResStatus[]>([]);

// 表单数据
const formData = reactive<Ticket.ReqTicketForm>({
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  priority: Ticket.Priority.MEDIUM,
  title: "",
  description: "",
  attachments: [],
  assigneeId: ""
});

const processFormData = reactive<Ticket.ReqProcessTicket>({
  ticketId: "",
  status: Ticket.Status.PROCESSING,
  content: "",
  result: "",
  attachments: []
});

// 表单验证规则
const formRules = reactive({
  customerName: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
  customerPhone: [{ required: true, message: "请输入客户电话", trigger: "blur" }],
  priority: [{ required: true, message: "请选择紧急程度", trigger: "change" }],
  title: [{ required: true, message: "请输入工单标题", trigger: "blur" }],
  description: [{ required: true, message: "请输入问题描述", trigger: "blur" }]
});

const processFormRules = reactive({
  status: [{ required: true, message: "请选择工单状态", trigger: "change" }],
  content: [{ required: true, message: "请输入处理内容", trigger: "blur" }]
});

// 表格配置项
const columns = reactive<ColumnProps<Ticket.ResTicketList>[]>([
  { type: "selection", width: 80 },
  { type: "index", label: "#", width: 80 },
  { prop: "ticketNo", label: "工单编号", width: 180 },
  { prop: "customerName", label: "客户姓名", width: 120 },
  { prop: "customerPhone", label: "客户电话", width: 150 },
  { prop: "customerEmail", label: "客户邮箱", width: 200 },
  {
    prop: "priority",
    label: "紧急程度",
    width: 120,
    enum: priorityOptions,
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "status",
    label: "工单状态",
    width: 120,
    tag: true,
    enum: statusOptions,
    fieldNames: { label: "label", value: "value" },
    formatter: row => {
      const statusMap: Record<number, string> = {
        [Ticket.Status.PENDING]: "warning",
        [Ticket.Status.PROCESSING]: "primary",
        [Ticket.Status.RESOLVED]: "success",
        [Ticket.Status.CLOSED]: "info"
      };
      return {
        label: getStatusLabel(row.status),
        type: statusMap[row.status] as any
      };
    }
  },
  { prop: "title", label: "工单标题", minWidth: 200 },
  { prop: "assigneeName", label: "负责人", width: 120 },
  { prop: "createTime", label: "创建时间", width: 200 },
  { prop: "updateTime", label: "更新时间", width: 200 },
  { prop: "operation", label: "操作", fixed: "right", width: 280 }
]);

// 获取优先级标签
const getPriorityLabel = (priority: Ticket.Priority) => {
  const option = priorityOptions.value.find(item => item.value === priority);
  return option ? option.label : "";
};

// 获取状态标签
const getStatusLabel = (status: Ticket.Status) => {
  const option = statusOptions.value.find(item => item.value === status);
  return option ? option.label : "";
};

// 加载字典数据
const loadDictData = async () => {
  try {
    const [priorityRes, statusRes] = await Promise.all([getTicketPriority(), getTicketStatus()]);
    priorityOptions.value = priorityRes;
    statusOptions.value = statusRes;
  } catch (error) {
    ElMessage.error("加载字典数据失败");
    console.error(error);
  }
};

// 新增工单
const handleAdd = () => {
  formTitle.value = "新增工单";
  formData.id = undefined;
  formData.customerName = "";
  formData.customerPhone = "";
  formData.customerEmail = "";
  formData.priority = Ticket.Priority.MEDIUM;
  formData.title = "";
  formData.description = "";
  formData.attachments = [];
  formData.assigneeId = "";
  formDialogVisible.value = true;
};

// 编辑工单
const handleEdit = (row: Ticket.ResTicketList) => {
  formTitle.value = "编辑工单";
  formData.id = row.id;
  formData.customerName = row.customerName;
  formData.customerPhone = row.customerPhone;
  formData.customerEmail = row.customerEmail || "";
  formData.priority = row.priority;
  formData.title = row.title;
  formData.description = row.description;
  formData.attachments = row.attachments || [];
  formData.assigneeId = row.assigneeId || "";
  formDialogVisible.value = true;
};

// 查看工单详情
const handleView = async (row: Ticket.ResTicketList) => {
  try {
    const res = await getTicketDetail({ id: row.id });
    ticketDetail.value = res;
    detailDialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取工单详情失败");
    console.error(error);
  }
};

// 处理工单
const handleProcess = (row: Ticket.ResTicketList) => {
  processFormData.ticketId = row.id;
  processFormData.status = row.status;
  processFormData.content = "";
  processFormData.result = "";
  processFormData.attachments = [];
  processDialogVisible.value = true;
};

// 删除工单
const handleDelete = async (row: Ticket.ResTicketList) => {
  try {
    await ElMessageBox.confirm(`确定要删除工单【${row.ticketNo}】吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    await useHandleData(deleteTicket, { id: [row.id] }, `删除工单【${row.ticketNo}】`);
    proTable.value?.getTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除工单失败");
      console.error(error);
    }
  }
};

// 批量删除工单
const batchDelete = async (ids: string[]) => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${ids.length} 个工单吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    await useHandleData(deleteTicket, { id: ids }, `删除选中的 ${ids.length} 个工单`);
    proTable.value?.clearSelection();
    proTable.value?.getTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("批量删除工单失败");
      console.error(error);
    }
  }
};

// 导出工单
const handleExport = async () => {
  try {
    await useHandleData(exportTicketInfo, proTable.value?.searchParam || {}, "导出工单数据");
    ElMessage.success("工单导出成功");
  } catch (error) {
    ElMessage.error("工单导出失败");
    console.error(error);
  }
};

// 提交工单表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    const api = formData.id ? editTicket : addTicket;
    const message = formData.id ? `编辑工单【${formData.title}】` : `新增工单【${formData.title}】`;
    await useHandleData(api, formData, message);
    formDialogVisible.value = false;
    proTable.value?.getTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("提交工单失败");
      console.error(error);
    }
  }
};

// 提交处理工单表单
const handleProcessSubmit = async () => {
  try {
    await processFormRef.value?.validate();
    await useHandleData(processTicket, processFormData, "处理工单");
    processDialogVisible.value = false;
    proTable.value?.getTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("处理工单失败");
      console.error(error);
    }
  }
};

// 单击行
const rowClick = (row: Ticket.ResTicketList) => {
  console.log("当前行数据:", row);
};

// 生命周期
onMounted(() => {
  loadDictData();
});
</script>

<style lang="scss" scoped>
.ticket-detail {
  .processing-records {
    margin-top: 20px;
    h3 {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 600;
    }
    .el-timeline-item {
      margin-bottom: 20px;
      .el-card {
        .record-header {
          margin-bottom: 10px;
          .processor {
            font-weight: 600;
            color: var(--el-color-primary);
          }
        }
        .record-content {
          margin-bottom: 10px;
          line-height: 1.6;
        }
        .record-result {
          line-height: 1.6;
          color: var(--el-color-success);
        }
      }
    }
  }
}
</style>
