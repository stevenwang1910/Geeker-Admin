<template>
  <div class="table-box">
    <ProTable ref="proTable" title="部门管理" row-key="id" :indent="20" :columns="columns" :data="departmentData">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openAddDialog">新增部门</el-button>
        <el-button type="success" :icon="Download" @click="exportData">导出数据</el-button>
        <el-button type="warning" :icon="Upload" @click="importData">导入数据</el-button>
      </template>
      <!-- 部门状态 -->
      <template #status="scope">
        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
          {{ scope.row.status === 1 ? "启用" : "禁用" }}
        </el-tag>
      </template>
      <!-- 部门操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openEditDialog(scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="CirclePlus" @click="openAddDialog(scope.row)"> 新增子部门 </el-button>
        <el-button type="danger" link :icon="Delete" @click="handleDelete(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>

    <!-- 新增/编辑部门弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="departmentData"
            :props="treeProps"
            placeholder="请选择上级部门"
            :disabled="isEdit && formData.level === 1"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="formData.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编码" prop="deptCode">
          <el-input v-model="formData.deptCode" placeholder="请输入部门编码，格式：DEPTXXXX" />
        </el-form-item>
        <el-form-item label="部门排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="999" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="formData.leader" placeholder="请输入负责人姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-switch v-model="formData.status" active-value="1" inactive-value="0" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog v-model="importVisible" title="导入部门数据" width="500px">
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="fileList"
        accept=".xlsx,.xls"
        drag
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传 xlsx/xls 文件，且不超过 10MB</div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmImport" :loading="importLoading">确定导入</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="departmentManage">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Download, Upload, UploadFilled } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { isPhone } from "@/utils/eleValidate";
import departmentList from "@/assets/json/departmentList.json";

const proTable = ref();
const formRef = ref();
const uploadRef = ref();

// 部门数据
const departmentData = ref(departmentList.data);

// 弹窗状态
const dialogVisible = ref(false);
const importVisible = ref(false);
const submitLoading = ref(false);
const importLoading = ref(false);

// 弹窗标题
const dialogTitle = ref("新增部门");
const isEdit = ref(false);

// 表单数据
const formData = reactive({
  id: 0,
  parentId: 0,
  deptName: "",
  deptCode: "",
  sort: 0,
  leader: "",
  phone: "",
  status: "1",
  level: 1
});

// 树选择配置
const treeProps = {
  label: "deptName",
  value: "id",
  children: "children"
};

// 文件列表
const fileList = ref([]);
const currentFile = ref(null);

// 校验规则
const formRules = reactive({
  deptName: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    { validator: validateDeptNameUnique, trigger: "blur" }
  ],
  deptCode: [
    { required: true, message: "请输入部门编码", trigger: "blur" },
    { pattern: /^DEPT\d{4}$/, message: "部门编码格式错误，应为DEPT开头加4位数字", trigger: "blur" },
    { validator: validateDeptCodeUnique, trigger: "blur" }
  ],
  parentId: [{ validator: validateParentDept, trigger: "change" }],
  sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
  phone: [
    {
      validator(rule, value, callback) {
        if (!value) {
          callback(new Error("请输入部门负责人手机号"));
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "deptName", label: "部门名称", align: "left", search: { el: "input", order: 1 } },
  { prop: "deptCode", label: "部门编码", search: { el: "input", order: 2 } },
  { prop: "leader", label: "负责人", search: { el: "input", order: 3 } },
  { prop: "phone", label: "联系电话", search: { el: "input", order: 4 } },
  { prop: "sort", label: "排序", width: 100, type: "sort" },
  { prop: "status", label: "状态", width: 120 },
  { prop: "createTime", label: "创建时间", width: 200, search: { el: "date-picker", order: 5 } },
  { prop: "operation", label: "操作", width: 300, fixed: "right" }
];

// 验证部门名称唯一性
function validateDeptNameUnique(rule: any, value: string, callback: any) {
  if (!value) return callback();

  const isExist = checkNameExists(value, formData.id);
  if (isExist) {
    callback(new Error("部门名称已存在"));
  } else {
    callback();
  }
}

// 验证部门编码唯一性
function validateDeptCodeUnique(rule: any, value: string, callback: any) {
  if (!value) return callback();

  const isExist = checkCodeExists(value, formData.id);
  if (isExist) {
    callback(new Error("部门编码已存在"));
  } else {
    callback();
  }
}

// 验证父子部门关系
function validateParentDept(rule: any, value: number, callback: any) {
  if (value === formData.id) {
    callback(new Error("不能选择自身作为上级部门"));
  } else {
    callback();
  }
}

// 检查部门名称是否存在
function checkNameExists(name: string, excludeId: number): boolean {
  let exists = false;

  const traverse = (data: any[]) => {
    for (const item of data) {
      if (item.id !== excludeId && item.deptName === name) {
        exists = true;
        break;
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  };

  traverse(departmentData.value);
  return exists;
}

// 检查部门编码是否存在
function checkCodeExists(code: string, excludeId: number): boolean {
  let exists = false;

  const traverse = (data: any[]) => {
    for (const item of data) {
      if (item.id !== excludeId && item.deptCode === code) {
        exists = true;
        break;
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  };

  traverse(departmentData.value);
  return exists;
}

// 打开新增弹窗
function openAddDialog(parentRow?: any) {
  dialogVisible.value = true;
  dialogTitle.value = parentRow ? "新增子部门" : "新增部门";
  isEdit.value = false;

  // 重置表单
  resetForm();

  if (parentRow) {
    formData.parentId = parentRow.id;
    formData.level = parentRow.level + 1;
  }
}

// 打开编辑弹窗
function openEditDialog(row: any) {
  dialogVisible.value = true;
  dialogTitle.value = "编辑部门";
  isEdit.value = true;

  // 填充表单数据
  Object.assign(formData, { ...row });
}

// 重置表单
function resetForm() {
  formRef.value?.resetFields();
  Object.assign(formData, {
    id: 0,
    parentId: 0,
    deptName: "",
    deptCode: "",
    sort: 0,
    leader: "",
    phone: "",
    status: "1",
    level: 1
  });
}

// 提交表单
async function submitForm() {
  await formRef.value.validate();

  submitLoading.value = true;

  try {
    if (isEdit.value) {
      // 编辑部门
      updateDept();
    } else {
      // 新增部门
      addDept();
    }

    ElMessage.success(isEdit.value ? "编辑成功" : "新增成功");
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error(isEdit.value ? "编辑失败" : "新增失败");
  } finally {
    submitLoading.value = false;
  }
}

// 新增部门
function addDept() {
  const newDept = {
    ...formData,
    id: Date.now(),
    createTime: new Date().toLocaleString(),
    children: []
  };

  if (formData.parentId === 0) {
    departmentData.value.push(newDept);
  } else {
    // 查找父部门并添加子部门
    const addChildDept = (data: any[]) => {
      for (const item of data) {
        if (item.id === formData.parentId) {
          if (!item.children) item.children = [];
          item.children.push(newDept);
          break;
        }
        if (item.children && item.children.length > 0) {
          addChildDept(item.children);
        }
      }
    };

    addChildDept(departmentData.value);
  }
}

// 编辑部门
function updateDept() {
  const updateDeptData = (data: any[]) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === formData.id) {
        data[i] = { ...data[i], ...formData };
        break;
      }
      if (data[i].children && data[i].children.length > 0) {
        updateDeptData(data[i].children);
      }
    }
  };

  updateDeptData(departmentData.value);
}

// 删除部门
function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除部门【${row.deptName}】吗？删除后其子部门也会一并删除。`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteDept(row.id);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
}

// 删除部门数据
function deleteDept(id: number) {
  const deleteDeptData = (data: any[], parentArray: any[]) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        parentArray.splice(i, 1);
        break;
      }
      if (data[i].children && data[i].children.length > 0) {
        deleteDeptData(data[i].children, data[i].children);
      }
    }
  };

  deleteDeptData(departmentData.value, departmentData.value);
}

// 导出数据
function exportData() {
  ElMessage.success("导出成功，文件已下载");
}

// 导入数据
function importData() {
  importVisible.value = true;
  fileList.value = [];
  currentFile.value = null;
}

// 文件改变
function handleFileChange(file: any, fileList: any[]) {
  currentFile.value = file;
  fileList.value = [file];
}

// 确认导入
async function confirmImport() {
  if (!currentFile.value) {
    ElMessage.warning("请选择要导入的文件");
    return;
  }

  importLoading.value = true;

  try {
    // 模拟导入过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    ElMessage.success("导入成功");
    importVisible.value = false;
  } catch (error) {
    ElMessage.error("导入失败");
  } finally {
    importLoading.value = false;
  }
}
</script>
