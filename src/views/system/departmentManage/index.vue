<template>
  <div class="table-box">
    <ProTable ref="proTable" title="部门列表" row-key="id" :indent="20" :columns="columns" :data="departmentData">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增部门</el-button>
        <el-button :icon="Upload" @click="handleImport">导入部门</el-button>
        <el-button :icon="Download" @click="handleExport">导出部门</el-button>
      </template>
      <!-- 部门操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </ProTable>

    <!-- 新增/编辑部门弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="formData.parentId"
            :options="departmentTreeOptions"
            :props="{ value: 'id', label: 'name', checkStrictly: true }"
            placeholder="请选择上级部门"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入部门编码，格式：DEPT_XXX" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导入部门弹窗 -->
    <el-dialog v-model="importDialogVisible" title="导入部门" width="500px" @close="handleImportDialogClose">
      <el-upload
        ref="uploadRef"
        :action="importUrl"
        :headers="{ Authorization: 'Bearer ' + token }"
        :file-list="fileList"
        :auto-upload="false"
        :on-success="handleImportSuccess"
        :on-error="handleImportError"
        accept=".xlsx,.xls"
        drag
      >
        <el-icon size="48"><UploadFilled /></el-icon>
        <div class="el-upload__text">拖到此处或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">请上传.xlsx或.xls格式的文件，文件大小不超过10MB</div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpload">上传</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="departmentManage">
import { ref, reactive, onMounted } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Upload, Download, UploadFilled } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import {
  getDepartmentTreeList,
  addDepartment,
  editDepartment,
  deleteDepartment,
  exportDepartmentInfo,
  checkDepartmentNameUnique,
  checkDepartmentCodeUnique
} from "@/api/modules/department";
import { ElMessage, ElMessageBox } from "element-plus";

const proTable = ref();
const formRef = ref();
const uploadRef = ref();

// 部门数据
const departmentData = ref<any[]>([]);
// 部门树形选项（用于级联选择）
const departmentTreeOptions = ref<any[]>([]);
// 新增/编辑部门弹窗可见性
const dialogVisible = ref(false);
// 弹窗标题
const dialogTitle = ref("");
// 表单数据
const token = ref("");

const formData = reactive({
  id: "",
  name: "",
  code: "",
  parentId: ""
});

// 组件创建时获取token
onMounted(() => {
  token.value = localStorage.getItem("token") || "";
});

// 检查部门名称是否唯一
const checkNameUnique = (rule: any, value: string, callback: any) => {
  if (!value) return callback();
  const params = {
    name: value,
    parentId: formData.parentId
  };
  if (formData.id) {
    params["id"] = formData.id;
  }
  checkDepartmentNameUnique(params).then(response => {
    if (response.code === "0") {
      callback();
    } else {
      callback(new Error(response.msg));
    }
  }).catch(() => {
    callback(new Error("检查部门名称唯一性失败"));
  });
};

// 检查部门编码是否唯一
const checkCodeUnique = (rule: any, value: string, callback: any) => {
  if (!value) return callback();
  const params = {
    code: value
  };
  if (formData.id) {
    params["id"] = formData.id;
  }
  checkDepartmentCodeUnique(params).then(response => {
    if (response.code === "0") {
      callback();
    } else {
      callback(new Error(response.msg));
    }
  }).catch(error => {
    callback(new Error("检查部门编码唯一性失败"));
  });
};

// 检查父子部门关系是否有效
const checkParentRelationship = (rule: any, value: string, callback: any) => {
  if (value) {
    if (value === formData.id) {
      return callback(new Error("不能选择自身作为上级部门"));
    }
  }
  callback();
};

// 表单验证规则
const formRules = reactive({
  name: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    { min: 1, max: 50, message: "部门名称长度在 1 到 50 个字符", trigger: "blur" },
    { validator: checkNameUnique, trigger: "blur" }
  ],
  code: [
    { required: true, message: "请输入部门编码", trigger: "blur" },
    { pattern: /^DEPT_\w+$/, message: "部门编码格式不正确，格式：DEPT_XXX", trigger: "blur" },
    { validator: checkCodeUnique, trigger: "blur" }
  ],
  parentId: [{ validator: checkParentRelationship, trigger: "change" }]
});

// 导入部门弹窗可见性
const importDialogVisible = ref(false);
// 上传文件列表
const fileList = ref<any[]>([]);
// 导入URL
const importUrl = import.meta.env.VITE_APP_BASE_API + "/department/import";

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "name", label: "部门名称", align: "left", search: { el: "input" }, sortable: true },
  { prop: "code", label: "部门编码", search: { el: "input" }, sortable: true },
  { prop: "parentName", label: "上级部门", search: { el: "input" } },
  { prop: "createTime", label: "创建时间", width: 200, sortable: true },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 获取部门树形列表
const getDepartmentTree = async () => {
  try {
    const response = await getDepartmentTreeList({ pageNum: 1, pageSize: 1000, name: "", code: "", parentId: "", createTime: [] });
    if (response.code === "0") {
      departmentData.value = response.data.list;
      departmentTreeOptions.value = response.data.list;
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error) {
    ElMessage.error("获取部门列表失败");
  }
};

// 处理新增部门
const handleAdd = () => {
  dialogTitle.value = "新增部门";
  formData.id = "";
  formData.name = "";
  formData.code = "";
  formData.parentId = "";
  dialogVisible.value = true;
};

// 处理编辑部门
const handleEdit = (row: any) => {
  dialogTitle.value = "编辑部门";
  formData.id = row.id;
  formData.name = row.name;
  formData.code = row.code;
  // 处理上级部门ID
  if (row.parentId) {
    formData.parentId = row.parentId;
  } else {
    formData.parentId = "";
  }
  dialogVisible.value = true;
};

// 处理删除部门
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除部门"${row.name}"吗？删除后该部门下的所有子部门也将被删除。`, "确认删除", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });

    const response = await deleteDepartment({ id: [row.id] });
    if (response.code === "0") {
      ElMessage.success("删除部门成功");
      getDepartmentTree();
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error: any) {
    if (error.name !== "CanceledError") {
      ElMessage.error("删除部门失败");
    }
  }
};

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();

    const params = {
      name: formData.name,
      code: formData.code,
      parentId: formData.parentId.length > 0 ? formData.parentId[formData.parentId.length - 1] : ""
    };

    let response;
    if (formData.id) {
      // 编辑部门
      response = await editDepartment({ ...params, id: formData.id });
    } else {
      // 新增部门
      response = await addDepartment(params);
    }

    if (response.code === "0") {
      ElMessage.success(formData.id ? "编辑部门成功" : "新增部门成功");
      dialogVisible.value = false;
      getDepartmentTree();
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error: any) {
    if (error.name !== "Error") {
      ElMessage.error("表单验证失败");
    }
  }
};

// 处理弹窗关闭
const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 处理导入部门
const handleImport = () => {
  importDialogVisible.value = true;
};

// 处理上传
const handleUpload = () => {
  if (uploadRef.value) {
    uploadRef.value.submit();
  }
};

// 处理导入成功
const handleImportSuccess = (response: any) => {
  if (response.code === "0") {
    ElMessage.success("导入部门成功");
    importDialogVisible.value = false;
    fileList.value = [];
    getDepartmentTree();
  } else {
    ElMessage.error(response.msg);
  }
};

// 处理导入失败
const handleImportError = () => {
  ElMessage.error("导入部门失败");
};

// 处理导入弹窗关闭
const handleImportDialogClose = () => {
  fileList.value = [];
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
};

// 处理导出部门
const handleExport = async () => {
  try {
    const response = await exportDepartmentInfo({ pageNum: 1, pageSize: 1000, name: "", code: "", parentId: "", createTime: [] });
    // 处理文件下载
    const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "部门列表.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出部门成功");
  } catch (error) {
    ElMessage.error("导出部门失败");
  }
};

// 页面加载时获取部门列表
onMounted(() => {
  getDepartmentTree();
});
</script>

<style scoped>
.table-box {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
