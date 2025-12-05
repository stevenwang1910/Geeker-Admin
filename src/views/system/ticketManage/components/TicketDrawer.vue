<template>
  <el-drawer
    v-model="visible"
    :title="title"
    :size="600"
    :destroy-on-close="true"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="100px">
      <el-form-item label="工单编号" prop="ticketNo">
        <el-input v-model="formModel.ticketNo" placeholder="请输入工单编号" :disabled="isView" />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="formModel.customerName" placeholder="请输入客户名称" :disabled="isView" />
      </el-form-item>
      <el-form-item label="客户电话" prop="customerPhone">
        <el-input v-model="formModel.customerPhone" placeholder="请输入客户电话" :disabled="isView" />
      </el-form-item>
      <el-form-item label="客户邮箱" prop="customerEmail">
        <el-input v-model="formModel.customerEmail" placeholder="请输入客户邮箱" :disabled="isView" />
      </el-form-item>
      <el-form-item label="紧急程度" prop="priority">
        <el-select v-model="formModel.priority" placeholder="请选择紧急程度" :disabled="isView">
          <el-option
            v-for="item in ticketPriority"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工单状态" prop="status">
        <el-select v-model="formModel.status" placeholder="请选择工单状态" :disabled="isView">
          <el-option
            v-for="item in ticketStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述" prop="description">
        <el-input
          v-model="formModel.description"
          type="textarea"
          placeholder="请输入问题描述"
          :rows="4"
          :disabled="isView"
        />
      </el-form-item>
      <el-form-item label="相关附件" prop="attachments">
        <el-upload
          action="#"
          :auto-upload="false"
          :file-list="formModel.attachments"
          :disabled="isView"
          list-type="text"
        >
          <el-button type="primary" :icon="Upload">上传附件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="处理人" prop="handler">
        <el-input v-model="formModel.handler" placeholder="请输入处理人" :disabled="isView" />
      </el-form-item>
      <el-form-item label="处理内容" prop="handleContent">
        <el-input
          v-model="formModel.handleContent"
          type="textarea"
          placeholder="请输入处理内容"
          :rows="4"
          :disabled="isView"
        />
      </el-form-item>
      <el-form-item label="处理结果" prop="handleResult">
        <el-input
          v-model="formModel.handleResult"
          type="textarea"
          placeholder="请输入处理结果"
          :rows="4"
          :disabled="isView"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :disabled="isView">确 定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="tsx" name="TicketDrawer">
import { reactive, ref, watch } from "vue";
import { Ticket } from "@/api/interface";
import { ticketStatus, ticketPriority } from "@/utils/dict";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import { Upload } from "element-plus/icons-vue";
import type { FormInstance } from "element-plus";

interface Props {
  visible?: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = ref(props.visible);

watch(
  () => props.visible,
  (val) => {
    visible.value = val;
  }
);

const handleClose = () => {
  emit("update:visible", false);
  formRef.value?.resetFields();
};

const formRef = ref<FormInstance>();

// 表单数据
const formModel = reactive<Ticket.ReqTicketForm>({
  id: undefined,
  ticketNo: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  priority: 1,
  status: 1,
  description: "",
  attachments: [],
  handler: "",
  handleContent: "",
  handleResult: ""
});

// 表单验证规则
const formRules = reactive({
  ticketNo: [{ required: true, message: "请输入工单编号", trigger: "blur" }],
  customerName: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
  customerPhone: [{ required: true, message: "请输入客户电话", trigger: "blur" }],
  priority: [{ required: true, message: "请选择紧急程度", trigger: "change" }],
  status: [{ required: true, message: "请选择工单状态", trigger: "change" }],
  description: [{ required: true, message: "请输入问题描述", trigger: "blur" }]
});

// 接收父组件参数
const acceptParams = (params: any) => {
  visible.value = true;
  formModel.id = params.row.id;
  formModel.ticketNo = params.row.ticketNo || "";
  formModel.customerName = params.row.customerName || "";
  formModel.customerPhone = params.row.customerPhone || "";
  formModel.customerEmail = params.row.customerEmail || "";
  formModel.priority = params.row.priority || 1;
  formModel.status = params.row.status || 1;
  formModel.description = params.row.description || "";
  formModel.attachments = params.row.attachments || [];
  formModel.handler = params.row.handler || "";
  formModel.handleContent = params.row.handleContent || "";
  formModel.handleResult = params.row.handleResult || "";
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    // 提交表单逻辑
    ElMessage.success("提交成功");
    handleClose();
  } catch (error) {
    console.log("表单验证失败:", error);
  }
};
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}
</style>