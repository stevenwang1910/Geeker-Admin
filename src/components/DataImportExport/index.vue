<template>
  <div class="data-import-export">
    <!-- 导入按钮 -->
    <el-button v-if="hasAuth('batchAdd')" type="primary" :icon="Upload" plain @click="openImportDialog" :loading="importLoading">
      导入数据
    </el-button>

    <!-- 导出下拉菜单 -->
    <el-dropdown v-if="hasAuth('export') && exportOptions.length > 1" trigger="click" @command="handleExport">
      <el-button type="primary" :icon="Download" plain :loading="exportLoading">
        导出数据 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="option in exportOptions" :key="option.value" :command="option.value">
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 导出按钮（只有一个选项时） -->
    <el-button
      v-else-if="hasAuth('export')"
      type="primary"
      :icon="Download"
      plain
      @click="handleExport(exportOptions[0]?.value)"
      :loading="exportLoading"
    >
      导出数据
    </el-button>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="数据导入" width="600px" draggable :destroy-on-close="true">
      <el-form label-width="100px">
        <el-form-item label="模板下载">
          <el-button type="primary" :icon="Download" @click="downloadTemplate"> 点击下载模板 </el-button>
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload
            action="#"
            class="upload"
            :drag="true"
            :limit="1"
            :show-file-list="true"
            :http-request="uploadFile"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
            :accept="allowedFileTypes.join(',')"
            :disabled="importLoading"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">支持格式：{{ allowedFileTypesText }}，文件最大为 {{ maxFileSize }}MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="数据校验">
          <el-switch v-model="enableValidation" />
        </el-form-item>
        <el-form-item label="数据覆盖">
          <el-switch v-model="enableOverwrite" />
        </el-form-item>
      </el-form>

      <!-- 数据预览 -->
      <div v-if="previewData.length > 0" class="preview-section">
        <h3>数据预览</h3>
        <el-table :data="previewData" border size="small" max-height="300">
          <el-table-column v-for="(value, key) in previewData[0]" :key="key" :prop="key" :label="key" :min-width="120" />
        </el-table>
        <div class="preview-tip">预览显示前 {{ previewData.length }} 条数据，共 {{ totalPreviewData }} 条</div>
      </div>

      <!-- 错误提示 -->
      <div v-if="importError" class="error-section">
        <h3>导入错误</h3>
        <el-alert type="error" :title="importError" show-icon />
      </div>

      <!-- 校验结果 -->
      <div v-if="validationResult" class="validation-section">
        <h3>校验结果</h3>
        <el-alert :type="validationResult.valid ? 'success' : 'error'" :title="validationResult.message" show-icon />
        <div v-if="validationResult.errors.length > 0" class="validation-errors">
          <h4>错误详情</h4>
          <el-table :data="validationResult.errors" border size="small" max-height="200">
            <el-table-column prop="row" label="行号" width="80" />
            <el-table-column prop="field" label="字段" width="120" />
            <el-table-column prop="message" label="错误信息" />
          </el-table>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false" :disabled="importLoading"> 取消 </el-button>
          <el-button
            type="primary"
            @click="confirmImport"
            :loading="importLoading"
            :disabled="!uploadedFile || (enableValidation && !validationResult?.valid)"
          >
            确认导入
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导出进度条 -->
    <el-progress
      v-if="exportProgress > 0 && exportProgress < 100"
      :percentage="exportProgress"
      :status="exportStatus"
      :format="exportProgressFormat"
    />
  </div>
</template>

<script setup lang="ts" name="DataImportExport">
import { ref, computed } from "vue";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { Upload, Download, ArrowDown, UploadFilled } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import type { ProTableInstance } from "@/components/ProTable/interface";
import * as XLSX from "xlsx";

// 定义 props
interface DataImportExportProps {
  proTableRef: Ref<ProTableInstance | null>; // ProTable 实例
  importApi?: (params: any) => Promise<any>; // 导入 API
  exportApi?: (params: any) => Promise<any>; // 导出 API
  templateApi?: (params: any) => Promise<any>; // 模板下载 API
  importTitle?: string; // 导入标题
  exportTitle?: string; // 导出标题
  allowedFileTypes?: string[]; // 允许的文件类型
  maxFileSize?: number; // 最大文件大小（MB）
  exportOptions?: { label: string; value: string }[]; // 导出选项
  validationRules?: Record<string, (value: any, row: any) => string | null>; // 校验规则
}

// 接收 props
const props = withDefaults(defineProps<DataImportExportProps>(), {
  importTitle: "数据",
  exportTitle: "数据",
  allowedFileTypes: () => [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv"
  ],
  maxFileSize: 10,
  exportOptions: () => [
    { label: "导出当前页", value: "current" },
    { label: "导出选中项", value: "selected" },
    { label: "导出全量数据", value: "all" }
  ],
  validationRules: () => ({})
});

// 定义 emit
const emit = defineEmits<{
  importSuccess: [];
  exportSuccess: [];
  importError: [error: string];
  exportError: [error: string];
}>();

// 状态管理
const importDialogVisible = ref(false);
const importLoading = ref(false);
const exportLoading = ref(false);
const exportProgress = ref(0);
const exportStatus = ref("active");
const uploadedFile = ref<File | null>(null);
const enableValidation = ref(true);
const enableOverwrite = ref(false);
const previewData = ref<any[]>([]);
const totalPreviewData = ref(0);
const importError = ref("");
const validationResult = ref<{
  valid: boolean;
  message: string;
  errors: { row: number; field: string; message: string }[];
} | null>(null);

// 权限控制
const { hasAuth } = useAuthButtons();

// 计算属性
const allowedFileTypesText = computed(() => {
  return props.allowedFileTypes
    ?.map(type => {
      if (type.includes("excel")) return "Excel(.xlsx/.xls)";
      if (type.includes("csv")) return "CSV(.csv)";
      return type;
    })
    .join("、");
});

// 打开导入对话框
const openImportDialog = () => {
  resetImportState();
  importDialogVisible.value = true;
};

// 重置导入状态
const resetImportState = () => {
  uploadedFile.value = null;
  previewData.value = [];
  totalPreviewData.value = 0;
  importError.value = "";
  validationResult.value = null;
  enableValidation.value = true;
  enableOverwrite.value = false;
};

// 下载模板
const downloadTemplate = () => {
  if (!hasAuth("batchAdd")) {
    ElMessage.warning("您没有下载模板的权限");
    return;
  }
  if (!props.templateApi) {
    ElMessage.warning("暂无模板可下载");
    return;
  }
  useDownload(props.templateApi, `${props.importTitle}模板`, {}, true, ".xlsx");
};

// 文件上传前校验
const beforeUpload = (file: File) => {
  // 校验文件类型
  const isAllowedType = props.allowedFileTypes?.includes(file.type);
  if (!isAllowedType) {
    ElNotification.warning({
      title: "文件类型错误",
      message: `仅支持上传 ${allowedFileTypesText.value} 格式的文件`
    });
    return false;
  }

  // 校验文件大小
  const isAllowedSize = file.size / 1024 / 1024 < props.maxFileSize;
  if (!isAllowedSize) {
    ElNotification.warning({
      title: "文件大小超限",
      message: `文件大小不能超过 ${props.maxFileSize}MB`
    });
    return false;
  }

  uploadedFile.value = file;
  return false; // 阻止自动上传
};

// 文件上传
const uploadFile = async () => {
  // 这里不需要实现，因为我们在 beforeUpload 中已经处理了文件
};

// 文件数量超出限制
const handleExceed = () => {
  ElNotification.warning({
    title: "文件数量超限",
    message: "最多只能上传一个文件"
  });
};

// 解析文件数据
const parseFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = e.target?.result;
        if (file.type.includes("excel")) {
          // 解析 Excel 文件
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } else if (file.type.includes("csv")) {
          // 解析 CSV 文件
          const workbook = XLSX.read(data, { type: "string" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } else {
          reject(new Error("不支持的文件类型"));
        }
      } catch (error) {
        reject(new Error("文件解析失败: " + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error("文件读取失败"));
    };

    if (file.type.includes("excel")) {
      reader.readAsArrayBuffer(file);
    } else if (file.type.includes("csv")) {
      reader.readAsText(file);
    }
  });
};

// 数据校验
const validateData = (
  data: any[]
): {
  valid: boolean;
  message: string;
  errors: { row: number; field: string; message: string }[];
} => {
  const errors: { row: number; field: string; message: string }[] = [];

  data.forEach((row, index) => {
    Object.keys(props.validationRules!).forEach(field => {
      const rule = props.validationRules![field];
      const error = rule(row[field], row);
      if (error) {
        errors.push({
          row: index + 1,
          field,
          message: error
        });
      }
    });
  });

  if (errors.length === 0) {
    return {
      valid: true,
      message: `数据校验通过，共 ${data.length} 条数据`,
      errors: []
    };
  } else {
    return {
      valid: false,
      message: `数据校验失败，共 ${errors.length} 条错误`,
      errors
    };
  }
};

// 确认导入
const confirmImport = async () => {
  if (!hasAuth("batchAdd")) {
    ElMessage.warning("您没有导入数据的权限");
    return;
  }
  if (!uploadedFile.value) return;

  try {
    importLoading.value = true;
    importError.value = "";

    // 解析文件
    const data = await parseFile(uploadedFile.value);
    totalPreviewData.value = data.length;
    previewData.value = data.slice(0, 10); // 只预览前10条

    // 数据校验
    if (enableValidation.value) {
      const result = validateData(data);
      validationResult.value = result;

      if (!result.valid) {
        importLoading.value = false;
        return;
      }
    }

    // 确认导入
    await ElMessageBox.confirm(`确认导入 ${data.length} 条${props.importTitle}数据？`, "温馨提示", { type: "warning" });

    // 调用导入 API
    if (props.importApi) {
      const formData = new FormData();
      formData.append("file", uploadedFile.value);
      formData.append("isOverwrite", enableOverwrite.value ? "1" : "0");

      await props.importApi(formData);

      ElNotification.success({
        title: "导入成功",
        message: `${props.importTitle}数据导入成功，共 ${data.length} 条`
      });

      // 刷新表格数据
      props.proTableRef.value?.getTableList();

      // 关闭对话框
      importDialogVisible.value = false;

      // 触发成功事件
      emit("importSuccess");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      importError.value = error.message || "导入失败，请重试";
      ElNotification.error({
        title: "导入失败",
        message: importError.value
      });
      emit("importError", importError.value);
    }
  } finally {
    importLoading.value = false;
  }
};

// 处理导出
const handleExport = async (type: string) => {
  if (!hasAuth("export")) {
    ElMessage.warning("您没有导出数据的权限");
    return;
  }
  if (!props.exportApi) {
    ElMessage.warning("暂无导出功能");
    return;
  }

  try {
    exportLoading.value = true;
    exportProgress.value = 0;
    exportStatus.value = "active";

    // 模拟导出进度
    const progressInterval = setInterval(() => {
      exportProgress.value += 10;
      if (exportProgress.value >= 100) {
        clearInterval(progressInterval);
      }
    }, 200);

    // 构建导出参数
    const params: any = {};

    switch (type) {
      case "current":
        // 当前页数据
        params.pageNum = props.proTableRef.value?.pageable.value.pageNum;
        params.pageSize = props.proTableRef.value?.pageable.value.pageSize;
        params.searchParam = props.proTableRef.value?.searchParam.value;
        break;
      case "selected":
        // 选中项数据
        const selectedIds = props.proTableRef.value?.selectedListIds.value;
        if (!selectedIds || selectedIds.length === 0) {
          ElMessage.warning("请先选择要导出的数据");
          exportLoading.value = false;
          exportProgress.value = 0;
          clearInterval(progressInterval);
          return;
        }
        params.ids = selectedIds;
        break;
      case "all":
        // 全量数据
        params.all = true;
        params.searchParam = props.proTableRef.value?.searchParam.value;
        break;
      default:
        break;
    }

    // 调用导出 API
    await useDownload(
      props.exportApi,
      `${props.exportTitle}${type === "current" ? "_当前页" : type === "selected" ? "_选中项" : "_全量"}`,
      params,
      true,
      ".xlsx"
    );

    // 更新导出进度
    clearInterval(progressInterval);
    exportProgress.value = 100;
    exportStatus.value = "success";

    ElNotification.success({
      title: "导出成功",
      message: `${props.exportTitle}数据导出成功`
    });

    // 触发成功事件
    emit("exportSuccess");
  } catch (error: any) {
    exportStatus.value = "exception";
    ElNotification.error({
      title: "导出失败",
      message: error.message || "导出失败，请重试"
    });
    emit("exportError", error.message || "导出失败");
  } finally {
    exportLoading.value = false;
    // 3秒后重置进度条
    setTimeout(() => {
      exportProgress.value = 0;
    }, 3000);
  }
};

// 导出进度格式化
const exportProgressFormat = (percentage: number) => {
  return `${percentage}%`;
};

// 暴露方法给父组件
defineExpose({
  openImportDialog,
  handleExport
});
</script>

<style lang="scss" scoped>
.data-import-export {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}
.preview-section,
.error-section,
.validation-section {
  padding: 15px;
  margin-top: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  h3 {
    margin: 0 0 10px;
    font-size: 14px;
    font-weight: 600;
  }
  h4 {
    margin: 10px 0 5px;
    font-size: 13px;
    font-weight: 600;
  }
}
.preview-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
  text-align: right;
}
.validation-errors {
  margin-top: 10px;
}
</style>
