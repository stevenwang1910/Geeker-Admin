<template>
  <div class="card content-box">
    <!-- 顶部操作栏 -->
    <div class="top-action-bar">
      <el-input
        v-model="searchForm.keyword"
        placeholder="请输入部门名称或编码"
        clearable
        size="default"
        style="width: 300px; margin-right: 10px;"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon size="18"><Search /></el-icon>
        </template>
      </el-input>
      <el-select
        v-model="searchForm.status"
        placeholder="请选择部门状态"
        clearable
        size="default"
        style="width: 150px; margin-right: 10px;"
      >
        <el-option label="启用" value="1" />
        <el-option label="禁用" value="0" />
      </el-select>
      <el-button type="primary" size="default" @click="handleSearch">
        <el-icon><Search /></el-icon> 搜索
      </el-button>
      <el-button type="success" size="default" @click="handleAdd">
        <el-icon><Plus /></el-icon> 新增
      </el-button>
      <el-button type="warning" size="default" @click="handleExport">
        <el-icon><Download /></el-icon> 导出
      </el-button>
      <el-button type="info" size="default" @click="handleImport">
        <el-icon><Upload /></el-icon> 导入
      </el-button>
    </div>

    <!-- 部门树形列表 -->
    <div class="department-tree">
      <el-tree
        ref="treeRef"
        :data="departmentTree"
        :props="treeProps"
        :load="loadNode"
        lazy
        node-key="id"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        @node-contextmenu="handleNodeContextMenu"
      >
        <template #default="{ node, data }">
          <span class="tree-node-content">
            <span :class="{ 'department-name': true, 'disabled': data.status === 0 }">
              {{ data.name }}
            </span>
            <span class="department-code">{{ data.code }}</span>
            <span class="department-status" :class="{ 'status-enabled': data.status === 1, 'status-disabled': data.status === 0 }">
              {{ data.status === 1 ? '启用' : '禁用' }}
            </span>
          </span>
        </template>
        <template #toolbar>
          <el-button type="text" size="small" @click="handleRefresh">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </template>
      </el-tree>
    </div>

    <!-- 新增/编辑部门对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :before-close="handleDialogClose"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        size="default"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入部门名称"
            clearable
            size="default"
          />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入部门编码"
            clearable
            size="default"
          />
        </el-form-item>
        <el-form-item label="部门类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择部门类型"
            clearable
            size="default"
          >
            <el-option label="公司" value="1" />
            <el-option label="部门" value="2" />
            <el-option label="小组" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="departmentTree"
            :props="treeProps"
            placeholder="请选择上级部门"
            clearable
            size="default"
            style="width: 100%;"
            :filterable="true"
            :disabled="dialogType === 'edit' && formData.id === '1'"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            placeholder="请输入排序"
            :min="1"
            :max="999"
            size="default"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="default" @click="handleDialogClose">取消</el-button>
        <el-button type="primary" size="default" @click="handleFormSubmit" :loading="formLoading">
          {{ dialogType === 'add' ? '新增' : '保存' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 导入部门对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入部门"
      width="500px"
      :before-close="handleImportDialogClose"
      @close="handleImportDialogClose"
    >
      <el-form
        ref="importFormRef"
        :model="importFormData"
        label-width="100px"
        size="default"
      >
        <el-form-item label="导入文件">
          <el-upload
            ref="uploadRef"
            :file-list="fileList"
            :auto-upload="false"
            :limit="1"
            :accept=".xlsx,.xls"
            :before-upload="beforeUpload"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            drag
            style="width: 100%;"
          >
            <el-icon size="48"><Upload /></el-icon>
            <div class="el-upload__text">
              点击或拖拽文件到此处上传<br />
              <small>支持 .xlsx, .xls 格式文件，大小不超过 10MB</small>
            </div>
            <template #tip>
              <div class="el-upload__tip text-center">
                <el-button type="text" size="small" @click="handleDownloadTemplate">
                  <el-icon><Download /></el-icon> 下载导入模板
                </el-button>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="default" @click="handleImportDialogClose">取消</el-button>
        <el-button type="primary" size="default" @click="handleImportSubmit" :loading="importLoading">
          导入
        </el-button>
      </template>
    </el-dialog>

    <!-- 部门操作菜单 -->
    <el-dropdown
      v-model:visible="menuVisible"
      :trigger="['contextmenu']"
      :show-timeout="0"
      :hide-timeout="0"
    >
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click="handleAddChild">
          <el-icon><Plus /></el-icon> 新增子部门
        </el-dropdown-item>
        <el-dropdown-item @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-dropdown-item>
        <el-dropdown-item @click="handleChangeStatus" :disabled="selectedNode.id === '1'">
          <el-icon><Switch /></el-icon> {{ selectedNode.status === 1 ? '禁用' : '启用' }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="handleDelete" :disabled="selectedNode.id === '1'">
          <el-icon><Delete /></el-icon> 删除
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="departmentManage">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox, ElTreeSelect } from 'element-plus';
import { Search, Plus, Download, Upload, Refresh, Edit, Switch, Delete } from '@element-plus/icons-vue';
import type { TreeProps, TreeInstance, TreeSelectInstance } from 'element-plus';
import type { FormInstance, UploadInstance } from 'element-plus';
import type { Department } from '@/api/interface';
import { getDepartmentTreeList, addDepartment, editDepartment, deleteDepartment, changeDepartmentStatus, exportDepartmentInfo, batchAddDepartment, checkDepartmentNameUnique, checkDepartmentCodeUnique, checkDepartmentCodeFormat, checkDepartmentParentValid } from '@/api/modules/department';

// 树形组件引用
const treeRef = ref<TreeInstance>();
// 表单组件引用
const formRef = ref<FormInstance>();
// 导入表单组件引用
const importFormRef = ref<FormInstance>();
// 上传组件引用
const uploadRef = ref<UploadInstance>();
// 树选择组件引用
const treeSelectRef = ref<TreeSelectInstance>();

// 部门树形数据
const departmentTree = ref<Department.ResDepartmentList[]>([]);
// 树形组件配置
const treeProps = reactive<TreeProps>({
  label: 'name',
  children: 'children',
  isLeaf: (data) => !data.hasChildren
});

// 搜索表单数据
const searchForm = reactive({
  keyword: '',
  status: ''
});

// 对话框可见性
const dialogVisible = ref(false);
// 导入对话框可见性
const importDialogVisible = ref(false);
// 对话框标题
const dialogTitle = ref('');
// 对话框类型（add/edit）
const dialogType = ref('add');

// 表单数据
const formData = reactive<Department.ReqEditDepartment>({
  id: '',
  name: '',
  code: '',
  type: 2,
  parentId: '',
  sort: 1
});

// 表单加载状态
const formLoading = ref(false);

// 导入表单数据
const importFormData = reactive({
  file: null
});

// 导入加载状态
const importLoading = ref(false);

// 上传文件列表
const fileList = ref([]);

// 操作菜单可见性
const menuVisible = ref(false);
// 选中的节点
const selectedNode = ref<Department.ResDepartmentList>({
  id: '',
  name: '',
  code: '',
  type: 2,
  parentId: '',
  parentName: '',
  createTime: '',
  status: 1,
  sort: 1,
  children: []
});

// 表单验证规则
const formRules = reactive({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 1, max: 50, message: '部门名称长度在 1 到 50 个字符', trigger: 'blur' },
    { validator: validateDepartmentName, trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入部门编码', trigger: 'blur' },
    { min: 1, max: 50, message: '部门编码长度在 1 到 50 个字符', trigger: 'blur' },
    { validator: validateDepartmentCode, trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择部门类型', trigger: 'change' }
  ],
  parentId: [
    { validator: validateDepartmentParent, trigger: 'change' }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' },
    { type: 'number', min: 1, max: 999, message: '排序必须是 1 到 999 之间的数字', trigger: 'blur' }
  ]
});

// 加载部门树形数据
const loadDepartmentTree = async () => {
  try {
    const res = await getDepartmentTreeList({ pageNum: 1, pageSize: 1000, name: '', code: '', type: 0, parentId: '', createTime: [], status: 0 });
    if (res.code === 200) {
      departmentTree.value = res.data.list;
    } else {
      ElMessage.error(res.msg || '加载部门树形数据失败');
    }
  } catch (error) {
    ElMessage.error('加载部门树形数据失败');
    console.error(error);
  }
};

// 加载节点数据（懒加载）
const loadNode = async (node: any, resolve: any) => {
  try {
    const res = await getDepartmentTreeList({ pageNum: 1, pageSize: 1000, name: '', code: '', type: 0, parentId: node.data.id, createTime: [], status: 0 });
    if (res.code === 200) {
      resolve(res.data.list);
    } else {
      ElMessage.error(res.msg || '加载节点数据失败');
      resolve([]);
    }
  } catch (error) {
    ElMessage.error('加载节点数据失败');
    console.error(error);
    resolve([]);
  }
};

// 搜索部门
const handleSearch = async () => {
  try {
    const res = await getDepartmentTreeList({
      pageNum: 1,
      pageSize: 1000,
      name: searchForm.keyword,
      code: searchForm.keyword,
      type: 0,
      parentId: '',
      createTime: [],
      status: searchForm.status ? parseInt(searchForm.status) : 0
    });
    if (res.code === 200) {
      departmentTree.value = res.data.list;
    } else {
      ElMessage.error(res.msg || '搜索部门失败');
    }
  } catch (error) {
    ElMessage.error('搜索部门失败');
    console.error(error);
  }
};

// 刷新部门数据
const handleRefresh = async () => {
  await loadDepartmentTree();
  ElMessage.success('部门数据已刷新');
};

// 新增部门
const handleAdd = () => {
  dialogType.value = 'add';
  dialogTitle.value = '新增部门';
  formData.id = '';
  formData.name = '';
  formData.code = '';
  formData.type = 2;
  formData.parentId = '';
  formData.sort = 1;
  dialogVisible.value = true;
};

// 新增子部门
const handleAddChild = () => {
  dialogType.value = 'add';
  dialogTitle.value = '新增子部门';
  formData.id = '';
  formData.name = '';
  formData.code = '';
  formData.type = selectedNode.value.type + 1;
  formData.parentId = selectedNode.value.id;
  formData.sort = 1;
  dialogVisible.value = true;
  menuVisible.value = false;
};

// 编辑部门
const handleEdit = () => {
  dialogType.value = 'edit';
  dialogTitle.value = '编辑部门';
  formData.id = selectedNode.value.id;
  formData.name = selectedNode.value.name;
  formData.code = selectedNode.value.code;
  formData.type = selectedNode.value.type;
  formData.parentId = selectedNode.value.parentId;
  formData.sort = selectedNode.value.sort;
  dialogVisible.value = true;
  menuVisible.value = false;
};

// 切换部门状态
const handleChangeStatus = async () => {
  const statusText = selectedNode.value.status === 1 ? '禁用' : '启用';
  try {
    await ElMessageBox.confirm(`确定要${statusText}部门"${selectedNode.value.name}"吗？`, '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const res = await changeDepartmentStatus({ id: selectedNode.value.id, status: selectedNode.value.status === 1 ? 0 : 1 });
    if (res.code === 200) {
      ElMessage.success(`部门"${selectedNode.value.name}"已${statusText}`);
      await loadDepartmentTree();
    } else {
      ElMessage.error(res.msg || `部门${statusText}失败`);
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`部门${statusText}失败`);
      console.error(error);
    }
  }
  menuVisible.value = false;
};

// 删除部门
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除部门"${selectedNode.value.name}"吗？删除后该部门下的所有子部门也将被删除。`, '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const res = await deleteDepartment({ id: [selectedNode.value.id] });
    if (res.code === 200) {
      ElMessage.success(`部门"${selectedNode.value.name}"已删除`);
      await loadDepartmentTree();
    } else {
      ElMessage.error(res.msg || '删除部门失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除部门失败');
      console.error(error);
    }
  }
  menuVisible.value = false;
};

// 导出部门数据
const handleExport = async () => {
  try {
    const res = await exportDepartmentInfo({
      pageNum: 1,
      pageSize: 1000,
      name: searchForm.keyword,
      code: searchForm.keyword,
      type: 0,
      parentId: '',
      createTime: [],
      status: searchForm.status ? parseInt(searchForm.status) : 0
    });
    // 创建下载链接
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `部门数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    ElMessage.success('部门数据导出成功');
  } catch (error) {
    ElMessage.error('部门数据导出失败');
    console.error(error);
  }
};

// 导入部门
const handleImport = () => {
  importDialogVisible.value = true;
};

// 下载导入模板
const handleDownloadTemplate = async () => {
  try {
    // 这里需要根据实际情况修改模板下载地址
    const res = await fetch('/api/department/template');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '部门数据导入模板.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    ElMessage.success('导入模板下载成功');
  } catch (error) {
    ElMessage.error('导入模板下载失败');
    console.error(error);
  }
};

// 处理文件变化
const handleFileChange = (file: any, fileList: any) => {
  importFormData.file = file.raw;
};

// 处理文件移除
const handleFileRemove = (file: any, fileList: any) => {
  importFormData.file = null;
};

// 上传前校验
const beforeUpload = (file: any) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件');
    return false;
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过 10MB');
    return false;
  }
  return true;
};

// 导入部门数据
const handleImportSubmit = async () => {
  if (!importFormData.file) {
    ElMessage.error('请选择要导入的文件');
    return;
  }
  try {
    importLoading.value = true;
    const formData = new FormData();
    formData.append('file', importFormData.file);
    const res = await batchAddDepartment(formData);
    if (res.code === 200) {
      ElMessage.success('部门数据导入成功');
      importDialogVisible.value = false;
      importFormData.file = null;
      fileList.value = [];
      await loadDepartmentTree();
    } else {
      ElMessage.error(res.msg || '部门数据导入失败');
    }
  } catch (error) {
    ElMessage.error('部门数据导入失败');
    console.error(error);
  } finally {
    importLoading.value = false;
  }
};

// 关闭对话框
const handleDialogClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};

// 关闭导入对话框
const handleImportDialogClose = () => {
  importDialogVisible.value = false;
  importFormData.file = null;
  fileList.value = [];
};

// 提交表单
const handleFormSubmit = async () => {
  try {
    await formRef.value?.validate();
    formLoading.value = true;
    let res;
    if (dialogType.value === 'add') {
      res = await addDepartment(formData);
    } else {
      res = await editDepartment(formData);
    }
    if (res.code === 200) {
      ElMessage.success(dialogType.value === 'add' ? '部门新增成功' : '部门编辑成功');
      dialogVisible.value = false;
      formRef.value?.resetFields();
      await loadDepartmentTree();
    } else {
      ElMessage.error(res.msg || (dialogType.value === 'add' ? '部门新增失败' : '部门编辑失败'));
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(dialogType.value === 'add' ? '部门新增失败' : '部门编辑失败');
      console.error(error);
    }
  } finally {
    formLoading.value = false;
  }
};

// 节点点击事件
const handleNodeClick = (data: Department.ResDepartmentList) => {
  selectedNode.value = data;
};

// 节点右键菜单事件
const handleNodeContextMenu = (event: MouseEvent, data: Department.ResDepartmentList) => {
  event.preventDefault();
  selectedNode.value = data;
  menuVisible.value = true;
  // 设置菜单位置
  const menu = document.querySelector('.el-dropdown-menu') as HTMLElement;
  if (menu) {
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
  }
};

// 过滤节点
const filterNode = (value: string, data: Department.ResDepartmentList) => {
  if (!value) return true;
  return data.name.includes(value) || data.code.includes(value);
};

// 校验部门名称唯一性
const validateDepartmentName = async (rule: any, value: string) => {
  if (!value) return Promise.resolve();
  try {
    const res = await checkDepartmentNameUnique({
      name: value,
      parentId: formData.parentId,
      id: dialogType.value === 'edit' ? formData.id : undefined
    });
    if (res.code === 200 && !res.data.isUnique) {
      return Promise.reject(new Error('部门名称已存在'));
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error('部门名称校验失败'));
  }
};

// 校验部门编码唯一性
const validateDepartmentCode = async (rule: any, value: string) => {
  if (!value) return Promise.resolve();
  try {
    // 校验编码格式
    const formatRes = await checkDepartmentCodeFormat({ code: value });
    if (formatRes.code === 200 && !formatRes.data.isValid) {
      return Promise.reject(new Error('部门编码格式不合法'));
    }
    // 校验编码唯一性
    const uniqueRes = await checkDepartmentCodeUnique({
      code: value,
      parentId: formData.parentId,
      id: dialogType.value === 'edit' ? formData.id : undefined
    });
    if (uniqueRes.code === 200 && !uniqueRes.data.isUnique) {
      return Promise.reject(new Error('部门编码已存在'));
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error('部门编码校验失败'));
  }
};

// 校验父子部门关系有效性
const validateDepartmentParent = async (rule: any, value: string) => {
  if (!value) return Promise.resolve();
  try {
    const res = await checkDepartmentParentValid({
      parentId: value,
      id: dialogType.value === 'edit' ? formData.id : undefined
    });
    if (res.code === 200 && !res.data.isValid) {
      return Promise.reject(new Error('父子部门关系不合法'));
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error('父子部门关系校验失败'));
  }
};

// 监听搜索表单变化
watch(searchForm, (newValue, oldValue) => {
  if (newValue.keyword === '' && newValue.status === '' && oldValue.keyword !== '' || oldValue.status !== '') {
    handleSearch();
  }
}, { deep: true });

// 组件挂载时加载数据
onMounted(async () => {
  await loadDepartmentTree();
});
</script>

<style scoped lang="scss">
.top-action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.department-tree {
  height: calc(100vh - 300px);
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
}

.tree-node-content {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.department-name {
  flex: 1;
  font-weight: 500;
}

.department-name.disabled {
  color: #c0c4cc;
  text-decoration: line-through;
}

.department-code {
  font-size: 12px;
  color: #909399;
  min-width: 80px;
}

.department-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  min-width: 40px;
  text-align: center;
}

.department-status.status-enabled {
  background-color: #f0f9ff;
  color: #0ea5e9;
}

.department-status.status-disabled {
  background-color: #fef2f2;
  color: #f87171;
}

// 滚动条样式
.department-tree::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.department-tree::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.department-tree::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.department-tree::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
