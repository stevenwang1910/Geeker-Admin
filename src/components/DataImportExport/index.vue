<template>
  <!-- 数据导入弹窗 -->
  <el-dialog v-model="importDialogVisible" :title="`${importTitle}数据导入`" :destroy-on-close="true" width="600px" draggable>
    <el-form class="import-form" label-width="100px">
      <!-- 模板下载 -->
      <el-form-item label="模板下载 :">
        <el-button v-if="hasTemplate" type="primary" :icon="Download" @click="downloadTemplate"> 点击下载</el-button>
        <span v-else class="no-template-text">暂无模板</span>
      </el-form-item>

      <!-- 文件上传 -->
      <el-form-item label="文件上传 :">
        <el-upload
          action="#"
          class="upload"
          :drag="true"
          :limit="uploadLimit"
          :multiple="allowMultiple"
          :show-file-list="true"
          :http-request="uploadFile"
          :before-upload="beforeUpload"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :accept="acceptFileTypes.join(',')"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

          <template #tip>
            <div class="el-upload__tip">
              请上传 {{ acceptFileTypesText }} 格式文件， 单文件最大为 {{ maxFileSize }}M{{
                allowMultiple ? `，最多上传 ${uploadLimit} 个文件` : ""
              }}
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <!-- 数据覆盖选项 -->
      <el-form-item label="数据覆盖 :">
        <el-switch v-model="isCover" />
      </el-form-item>

      <!-- 错误结果展示 -->
      <el-form-item v-if="importErrors.length > 0" label="导入错误 :">
        <el-collapse v-model="activeErrorNames">
          <el-collapse-item
            v-for="error in importErrors"
            :key="error.fileName"
            :title="`${error.fileName} (${error.errorCount} 条错误)`"
          >
            <el-table :data="error.details" style="width: 100%">
              <el-table-column prop="rowIndex" label="行号" width="80" />
              <el-table-column prop="errorMessage" label="错误信息" />
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeImportDialog">取消</el-button>
        <el-button type="primary" @click="confirmImport" :loading="isImporting"> 确认导入 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 数据导出弹窗 -->
  <el-dialog v-model="exportDialogVisible" title="数据导出" :destroy-on-close="true" width="500px" draggable>
    <el-form class="export-form" label-width="100px">
      <!-- 导出范围 -->
      <el-form-item label="导出范围 :">
        <el-radio-group v-model="exportScope" @change="handleExportScopeChange">
          <el-radio label="currentPage">当前页数据</el-radio>
          <el-radio label="selectedRows">选中数据</el-radio>
          <el-radio label="allData">全量数据</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 导出格式 -->
      <el-form-item label="导出格式 :">
        <el-radio-group v-model="exportFormat">
          <el-radio label="xlsx">Excel (.xlsx)</el-radio>
          <el-radio label="csv">CSV (.csv)</el-radio>
          <el-radio label="pdf">PDF (.pdf)</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 选中数据数量提示 -->
      <el-form-item v-if="exportScope === 'selectedRows'" label="提示 :">
        <div class="selected-count-text">
          您当前选中了 <strong>{{ selectedRowCount }}</strong> 条数据
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeExportDialog">取消</el-button>
        <el-button type="primary" @click="confirmExport" :loading="isExporting"> 确认导出 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="DataImportExport">
import { ref, computed } from "vue";
import { ElNotification, UploadRequestOptions, UploadRawFile } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";

// 导入相关的响应式数据
export interface ImportConfig {
  title: string; // 导入标题
  hasTemplate: boolean; // 是否有模板
  templateApi?: () => Promise<any>; // 模板下载API
  importApi: (params: FormData) => Promise<any>; // 数据导入API
  allowMultiple?: boolean; // 是否允许上传多个文件
  maxFileSize?: number; // 最大文件大小（MB）
  acceptFileTypes?: string[]; // 允许的文件类型
  onImportSuccess?: () => void; // 导入成功回调
}

const importDialogVisible = ref(false);
const importTitle = ref("");
const hasTemplate = ref(false);
const templateApi = ref<any>();
const importApi = ref<any>();
const allowMultiple = ref(false);
const maxFileSize = ref(5);
const acceptFileTypes = ref<string[]>([
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);
const onImportSuccess = ref<any>();

// 上传相关的响应式数据
const uploadLimit = ref(1);
const uploadedFiles = ref<File[]>([]);
const isCover = ref(false);
const isImporting = ref(false);
const importErrors = ref<
  {
    fileName: string;
    errorCount: number;
    details: { rowIndex: number; errorMessage: string }[];
  }[]
>([]);
const activeErrorNames = ref<string[]>([]);

// 导出相关的响应式数据
export interface ExportConfig {
  exportApi: (params: any) => Promise<any>; // 数据导出API
  currentPageParams?: any; // 当前页数据参数
  selectedRowIds?: string[]; // 选中的数据ID列表
  onExportSuccess?: () => void; // 导出成功回调
}

const exportDialogVisible = ref(false);
const exportApi = ref<any>();
const currentPageParams = ref<any>();
const selectedRowIds = ref<string[]>([]);
const onExportSuccess = ref<any>();

const exportScope = ref("currentPage");
const exportFormat = ref("xlsx");
const isExporting = ref(false);

// 计算属性
const acceptFileTypesText = computed(() => {
  return acceptFileTypes.value
    .map(type => {
      if (type.includes("excel") || type.includes("spreadsheetml")) return "Excel (.xls, .xlsx)";
      if (type.includes("csv")) return "CSV (.csv)";
      return type;
    })
    .join("、");
});

const selectedRowCount = computed(() => {
  return selectedRowIds.value.length;
});

// 打开导入弹窗
const openImportDialog = (config: ImportConfig) => {
  importTitle.value = config.title;
  hasTemplate.value = config.hasTemplate;
  templateApi.value = config.templateApi;
  importApi.value = config.importApi;
  allowMultiple.value = config.allowMultiple ?? false;
  maxFileSize.value = config.maxFileSize ?? 5;
  acceptFileTypes.value = config.acceptFileTypes ?? [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];
  onImportSuccess.value = config.onImportSuccess;

  uploadLimit.value = allowMultiple.value ? 10 : 1;
  uploadedFiles.value = [];
  isCover.value = false;
  importErrors.value = [];
  activeErrorNames.value = [];

  importDialogVisible.value = true;
};

// 关闭导入弹窗
const closeImportDialog = () => {
  importDialogVisible.value = false;
};

// 下载模板
const downloadTemplate = () => {
  if (!templateApi.value) return;
  useDownload(templateApi.value, `${importTitle.value}模板`);
};

// 文件上传前的验证
const beforeUpload = (file: UploadRawFile) => {
  // 验证文件类型
  const isAcceptType = acceptFileTypes.value.some(type => file.type === type || file.name.endsWith(type.split("/")[1]));

  // 验证文件大小
  const isAcceptSize = file.size / 1024 / 1024 < maxFileSize.value;

  if (!isAcceptType) {
    ElNotification({
      title: "温馨提示",
      message: `上传文件只能是 ${acceptFileTypesText.value} 格式！`,
      type: "warning"
    });
  }

  if (!isAcceptSize) {
    ElNotification({
      title: "温馨提示",
      message: `上传文件大小不能超过 ${maxFileSize.value}MB！`,
      type: "warning"
    });
  }

  return isAcceptType && isAcceptSize;
};

// 处理文件上传
const uploadFile = async (param: UploadRequestOptions) => {
  uploadedFiles.value.push(param.file as File);
};

// 处理文件超出限制
const handleExceed = () => {
  ElNotification({
    title: "温馨提示",
    message: `最多只能上传 ${uploadLimit.value} 个文件！`,
    type: "warning"
  });
};

// 处理文件移除
const handleRemove = (file: any) => {
  const index = uploadedFiles.value.findIndex(f => f.name === file.name);
  if (index > -1) {
    uploadedFiles.value.splice(index, 1);
  }
};

// 确认导入
const confirmImport = async () => {
  if (uploadedFiles.value.length === 0) {
    ElNotification({
      title: "温馨提示",
      message: "请先选择要上传的文件！",
      type: "warning"
    });
    return;
  }

  isImporting.value = true;
  importErrors.value = [];

  try {
    const formData = new FormData();

    // 添加所有上传的文件
    uploadedFiles.value.forEach(file => {
      formData.append("files", file);
    });

    // 添加是否覆盖的参数
    formData.append("isCover", isCover.value.toString());

    // 调用导入API
    const result = await importApi.value(formData);

    // 处理导入结果
    if (result.success) {
      // 检查是否有错误
      if (result.data && result.data.errors && result.data.errors.length > 0) {
        importErrors.value = result.data.errors;
        activeErrorNames.value = result.data.errors.map((error: any) => error.fileName);

        ElNotification({
          title: "导入完成",
          message: `部分文件导入失败，共 ${importErrors.value.reduce((sum, error) => sum + error.errorCount, 0)} 条错误`,
          type: "warning"
        });
      } else {
        ElNotification({
          title: "导入成功",
          message: `成功导入 ${result.data?.successCount ?? 0} 条数据！`,
          type: "success"
        });

        // 关闭弹窗
        closeImportDialog();

        // 调用成功回调
        if (onImportSuccess.value) {
          onImportSuccess.value();
        }
      }
    } else {
      throw new Error(result.message ?? "导入失败");
    }
  } catch (error: any) {
    ElNotification({
      title: "导入失败",
      message: error.message ?? "数据导入失败，请您重新尝试！",
      type: "error"
    });
  } finally {
    isImporting.value = false;
  }
};

// 打开导出弹窗
const openExportDialog = (config: ExportConfig) => {
  exportApi.value = config.exportApi;
  currentPageParams.value = config.currentPageParams;
  selectedRowIds.value = config.selectedRowIds ?? [];
  onExportSuccess.value = config.onExportSuccess;

  // 如果没有选中数据，禁用选中数据导出选项
  if (selectedRowIds.value.length === 0) {
    exportScope.value = "currentPage";
  }

  exportDialogVisible.value = true;
};

// 关闭导出弹窗
const closeExportDialog = () => {
  exportDialogVisible.value = false;
};

// 处理导出范围变化
const handleExportScopeChange = (scope: string) => {
  if (scope === "selectedRows" && selectedRowIds.value.length === 0) {
    ElNotification({
      title: "温馨提示",
      message: "请先选择要导出的数据！",
      type: "warning"
    });
    exportScope.value = "currentPage";
  }
};

// 确认导出
const confirmExport = async () => {
  isExporting.value = true;

  try {
    // 构建导出参数
    const exportParams: any = {};

    switch (exportScope.value) {
      case "currentPage":
        exportParams.scope = "currentPage";
        exportParams.params = currentPageParams.value;
        break;
      case "selectedRows":
        exportParams.scope = "selectedRows";
        exportParams.ids = selectedRowIds.value;
        break;
      case "allData":
        exportParams.scope = "allData";
        break;
    }

    // 调用导出API
    const result = await exportApi.value(exportParams);

    // 处理导出结果
    if (result.success) {
      // 这里假设导出API返回的是Blob数据
      const blob = new Blob([result.data], {
        type: getExportMimeType(exportFormat.value)
      });

      // 下载文件
      const fileName = `导出数据_${new Date().toISOString().slice(0, 10)}.${exportFormat.value}`;

      // 兼容 edge 不支持 createObjectURL 方法
      if ("msSaveOrOpenBlob" in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        const blobUrl = window.URL.createObjectURL(blob);
        const exportFile = document.createElement("a");
        exportFile.style.display = "none";
        exportFile.download = fileName;
        exportFile.href = blobUrl;
        document.body.appendChild(exportFile);
        exportFile.click();
        document.body.removeChild(exportFile);
        window.URL.revokeObjectURL(blobUrl);
      }

      ElNotification({
        title: "导出成功",
        message: `成功导出数据到 ${fileName}！`,
        type: "success"
      });

      // 关闭弹窗
      closeExportDialog();

      // 调用成功回调
      if (onExportSuccess.value) {
        onExportSuccess.value();
      }
    } else {
      throw new Error(result.message ?? "导出失败");
    }
  } catch (error: any) {
    ElNotification({
      title: "导出失败",
      message: error.message ?? "数据导出失败，请您重新尝试！",
      type: "error"
    });
  } finally {
    isExporting.value = false;
  }
};

// 获取导出文件的MIME类型
const getExportMimeType = (format: string): string => {
  switch (format) {
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "csv":
      return "text/csv";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
};

// 暴露方法给父组件
defineExpose({
  openImportDialog,
  openExportDialog
});
</script>

<style lang="scss" scoped>
.import-form,
.export-form {
  margin-top: 20px;
}
.no-template-text {
  font-size: 14px;
  color: #909399;
}
.selected-count-text {
  font-size: 14px;
  color: #606266;
  strong {
    font-weight: 600;
    color: #409eff;
  }
}
.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
