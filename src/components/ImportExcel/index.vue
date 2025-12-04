<template>
  <el-dialog v-model="dialogVisible" :title="`批量添加${parameter.title}`" :destroy-on-close="true" width="700px" draggable>
    <el-form class="drawer-multiColumn-form" label-width="100px">
      <el-form-item label="模板下载 :">
        <el-button type="primary" :icon="Download" @click="downloadTemp"> 点击下载 </el-button>
      </el-form-item>
      <el-form-item label="文件上传 :">
        <el-upload
          action="#"
          class="upload"
          :drag="true"
          :limit="excelLimit"
          :multiple="false"
          :show-file-list="true"
          :http-request="uploadExcel"
          :before-upload="beforeExcelUpload"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :accept="parameter.fileType!.join(',')"
        >
          <slot name="empty">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </slot>
          <template #tip>
            <slot name="tip">
              <div class="el-upload__tip">请上传 .xls , .xlsx , .csv 标准格式文件，文件最大为 {{ parameter.fileSize }}M</div>
            </slot>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="数据覆盖 :">
        <el-switch v-model="isCover" />
      </el-form-item>
      <!-- 数据预览 -->
      <el-form-item v-if="previewData.length > 0" label="数据预览 :">
        <el-table :data="previewData" border stripe max-height="300" style="width: 100%">
          <el-table-column
            v-for="(column, index) in previewColumns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :min-width="120"
            show-overflow-tooltip
          />
        </el-table>
        <div class="preview-info">共 {{ totalCount }} 条数据，已预览前 {{ previewData.length }} 条</div>
      </el-form-item>
      <!-- 错误信息 -->
      <el-form-item v-if="errorData.length > 0" label="错误数据 :">
        <el-table :data="errorData" border stripe max-height="300" style="width: 100%" row-key="index">
          <el-table-column prop="index" label="行号" width="80" fixed="left" />
          <el-table-column
            v-for="(column, index) in previewColumns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :min-width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="error" label="错误信息" min-width="150" fixed="right" show-overflow-tooltip />
        </el-table>
        <div class="error-info">共 {{ errorData.length }} 条错误数据，请修正后重新上传</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmImport"
          :loading="importLoading"
          :disabled="errorData.length > 0 || previewData.length === 0"
        >
          确认导入
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="ImportExcel">
import { ref } from "vue";
import { useDownload } from "@/hooks/useDownload";
import { Download } from "@element-plus/icons-vue";
import { ElNotification, UploadRequestOptions, UploadRawFile } from "element-plus";
import * as XLSX from "xlsx";

export interface ExcelParameterProps {
  title: string; // 标题
  fileSize?: number; // 上传文件的大小
  fileType?: string[]; // 上传文件的类型
  tempApi?: (params: any) => Promise<any>; // 下载模板的Api
  importApi?: (params: any) => Promise<any>; // 批量导入的Api
  getTableList?: () => void; // 获取表格数据的Api
  columns?: Array<{
    prop: string;
    label: string;
    required?: boolean;
    type?: string;
    validator?: (value: any) => string | boolean;
  }>; // 列配置和校验规则
}

// 是否覆盖数据
const isCover = ref(false);
// 最大文件上传数
const excelLimit = ref(1);
// dialog状态
const dialogVisible = ref(false);
// 导入加载状态
const importLoading = ref(false);
// 父组件传过来的参数
const parameter = ref<ExcelParameterProps>({
  title: "",
  fileSize: 5,
  fileType: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"]
});

// 上传的文件
const uploadedFile = ref<UploadRawFile | null>(null);
// 解析后的数据
const parsedData = ref<any[]>([]);
// 数据预览
const previewData = ref<any[]>([]);
// 错误数据
const errorData = ref<any[]>([]);
// 预览列
const previewColumns = ref<Array<{ prop: string; label: string }>>([]);
// 总数据条数
const totalCount = ref(0);

// 接收父组件参数
const acceptParams = (params: ExcelParameterProps) => {
  parameter.value = { ...parameter.value, ...params };
  // 初始化列配置
  if (params.columns) {
    previewColumns.value = params.columns.map(col => ({ prop: col.prop, label: col.label }));
  }
  dialogVisible.value = true;
  // 重置状态
  resetState();
};

// 重置状态
const resetState = () => {
  uploadedFile.value = null;
  parsedData.value = [];
  previewData.value = [];
  errorData.value = [];
  totalCount.value = 0;
};

// Excel 导入模板下载
const downloadTemp = () => {
  if (!parameter.value.tempApi) return;
  useDownload(parameter.value.tempApi, `${parameter.value.title}模板`);
};

// 文件上传前检查
const beforeExcelUpload = (file: UploadRawFile) => {
  const isSupportedType = parameter.value.fileType!.includes(file.type);
  const fileSize = file.size / 1024 / 1024 < parameter.value.fileSize!;

  if (!isSupportedType) {
    ElNotification({
      title: "温馨提示",
      message: "上传文件只能是 xls / xlsx / csv 格式！",
      type: "warning"
    });
    return false;
  }

  if (!fileSize) {
    ElNotification({
      title: "温馨提示",
      message: `上传文件大小不能超过 ${parameter.value.fileSize}MB！`,
      type: "warning"
    });
    return false;
  }

  uploadedFile.value = file;
  return true;
};

// 文件上传处理
const uploadExcel = async (param: UploadRequestOptions) => {
  const file = param.file;
  const reader = new FileReader();

  reader.onload = async e => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      let workbook;

      // 根据文件类型选择解析方式
      if (file.type === "text/csv") {
        workbook = XLSX.read(data, { type: "array", cellDates: true, cellNF: true });
      } else {
        workbook = XLSX.read(data, { type: "array", cellDates: true, cellNF: true });
      }

      // 获取第一个工作表
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // 解析数据
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        ElNotification({
          title: "温馨提示",
          message: "文件为空，请选择有效文件！",
          type: "warning"
        });
        return;
      }

      // 处理表头和数据
      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1);

      // 如果没有传入列配置，使用文件表头
      if (!parameter.value.columns) {
        previewColumns.value = headers.map(header => ({ prop: header, label: header }));
      }

      // 转换数据格式
      parsedData.value = (dataRows as any[]).map((row: any[]) => {
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });

      totalCount.value = parsedData.value.length;
      // 预览前10条数据
      previewData.value = parsedData.value.slice(0, 10);
      // 数据校验
      validateData();
    } catch (error) {
      console.error("文件解析失败:", error);
      ElNotification({
        title: "温馨提示",
        message: "文件解析失败，请检查文件格式！",
        type: "error"
      });
    }
  };

  reader.onerror = () => {
    ElNotification({
      title: "温馨提示",
      message: "文件读取失败，请重试！",
      type: "error"
    });
  };

  reader.readAsArrayBuffer(file);
};

// 数据校验
const validateData = () => {
  if (!parameter.value.columns || parsedData.value.length === 0) {
    errorData.value = [];
    return;
  }

  errorData.value = parsedData.value.reduce((errors: any[], row, index) => {
    const rowErrors: string[] = [];

    parameter.value.columns!.forEach(column => {
      const { prop, required, type, validator } = column;
      const value = row[prop];

      // 必填校验
      if (required && !value && value !== 0) {
        rowErrors.push(`${column.label}不能为空`);
      }

      // 类型校验
      if (value !== undefined && value !== null && type) {
        switch (type) {
          case "number":
            if (isNaN(Number(value))) {
              rowErrors.push(`${column.label}必须是数字`);
            }
            break;
          case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              rowErrors.push(`${column.label}格式不正确`);
            }
            break;
          case "phone":
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(value)) {
              rowErrors.push(`${column.label}格式不正确`);
            }
            break;
          case "date":
            if (isNaN(Date.parse(value))) {
              rowErrors.push(`${column.label}格式不正确`);
            }
            break;
        }
      }

      // 自定义校验
      if (validator) {
        const result = validator(value);
        if (typeof result === "string") {
          rowErrors.push(result);
        } else if (!result) {
          rowErrors.push(`${column.label}校验失败`);
        }
      }
    });

    if (rowErrors.length > 0) {
      errors.push({ ...row, index: index + 2, error: rowErrors.join("; ") });
    }

    return errors;
  }, []);
};

// 文件数超出提示
const handleExceed = () => {
  ElNotification({
    title: "温馨提示",
    message: "最多只能上传一个文件！",
    type: "warning"
  });
};

// 文件移除处理
const handleRemove = () => {
  resetState();
};

// 确认导入
const confirmImport = async () => {
  if (!uploadedFile.value || parsedData.value.length === 0) {
    ElNotification({
      title: "温馨提示",
      message: "请先上传文件！",
      type: "warning"
    });
    return;
  }

  if (errorData.value.length > 0) {
    ElNotification({
      title: "温馨提示",
      message: "存在错误数据，请修正后重新上传！",
      type: "warning"
    });
    return;
  }

  try {
    importLoading.value = true;

    // 构造请求数据
    const requestData = {
      data: parsedData.value,
      isCover: isCover.value
    };

    // 调用导入接口
    await parameter.value.importApi!(requestData);

    ElNotification({
      title: "温馨提示",
      message: `批量添加${parameter.value.title}成功！`,
      type: "success"
    });

    // 刷新表格数据
    parameter.value.getTableList && parameter.value.getTableList();

    // 关闭对话框
    dialogVisible.value = false;
    // 重置状态
    resetState();
  } catch (error) {
    console.error("导入失败:", error);
    ElNotification({
      title: "温馨提示",
      message: `批量添加${parameter.value.title}失败，请您重新上传！`,
      type: "error"
    });
  } finally {
    importLoading.value = false;
  }
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
@import "./index";
.preview-info {
  margin-top: 10px;
  font-size: 12px;
  color: #606266;
  text-align: right;
}
.error-info {
  margin-top: 10px;
  font-size: 12px;
  color: #f56c6c;
  text-align: right;
}
.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
