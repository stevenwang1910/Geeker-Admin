<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="账户列表"
      row-key="id"
      :columns="columns"
      :request-api="getAccountList"
      :pagination="true"
      :tool-button="['refresh', 'setting', 'search']"
      :search-col="{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openAddDialog" :disabled="!hasPermission('account:add')">
          新增账户
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          @click="deleteSelectedAccounts"
          :disabled="!hasPermission('account:delete') || !isSelected"
        >
          批量删除
        </el-button>
      </template>
      <!-- 账户状态 -->
      <template #status="scope">
        <el-switch
          v-model="scope.row.status"
          :active-value="1"
          :inactive-value="0"
          @change="updateAccountStatus(scope.row)"
          :disabled="!hasPermission('account:edit')"
        />
      </template>
      <!-- 账户角色 -->
      <template #role="scope">
        <el-tag v-for="role in scope.row.roles" :key="role" :type="getRoleType(role)" size="small">
          {{ role }}
        </el-tag>
      </template>
      <!-- 操作按钮 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="viewAccount(scope.row)" :disabled="!hasPermission('account:view')">
          查看
        </el-button>
        <el-button
          type="primary"
          link
          :icon="EditPen"
          @click="openEditDialog(scope.row)"
          :disabled="!hasPermission('account:edit')"
        >
          编辑
        </el-button>
        <el-button
          type="danger"
          link
          :icon="Delete"
          @click="deleteAccount(scope.row)"
          :disabled="!hasPermission('account:delete')"
        >
          删除
        </el-button>
      </template>
    </ProTable>

    <!-- 新增/编辑账户对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" class="dialog-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="dialogType === 'add'">
          <el-input v-model="formData.confirmPassword" type="password" placeholder="请确认密码" show-password />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="formData.roles" placeholder="请选择角色" multiple filterable collapse-tags>
            <el-option v-for="role in roleOptions" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看账户详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="账户详情" width="500px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ detailData.username }}</el-descriptions-item>
        <el-descriptions-item label="真实姓名">{{ detailData.realName }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detailData.email }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag v-for="role in detailData.roles" :key="role" :type="getRoleType(role)" size="small">
            {{ role }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.status === 1 ? 'success' : 'danger'">
            {{ detailData.status === 1 ? "启用" : "禁用" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最后登录时间">{{ detailData.lastLoginTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="accountManage">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, View } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { useAuthButtons } from "@/hooks/useAuthButtons";

// 权限控制
const { hasPermission } = useAuthButtons();

// ProTable 实例
const proTable = ref();

// 对话框状态
const dialogVisible = ref(false);
const detailDialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const dialogTitle = computed(() => (dialogType.value === "add" ? "新增账户" : "编辑账户"));

// 表单实例
const formRef = ref();

// 表单数据
const formData = reactive({
  id: "",
  username: "",
  password: "",
  confirmPassword: "",
  realName: "",
  email: "",
  phone: "",
  roles: [] as string[],
  status: 1
});

// 详情数据
const detailData = reactive({
  id: "",
  username: "",
  realName: "",
  email: "",
  phone: "",
  roles: [] as string[],
  status: 1,
  createTime: "",
  lastLoginTime: ""
});

// 角色选项
const roleOptions = ref([
  { value: "admin", label: "管理员" },
  { value: "editor", label: "编辑" },
  { value: "viewer", label: "查看者" },
  { value: "user", label: "普通用户" }
]);

// 表单验证规则
const formRules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在 3 到 20 个字符", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9_]+$/, message: "用户名只能包含字母、数字和下划线", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== formData.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  realName: [
    { required: true, message: "请输入真实姓名", trigger: "blur" },
    { min: 2, max: 10, message: "真实姓名长度在 2 到 10 个字符", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式", trigger: "blur" }
  ],
  roles: [{ required: true, message: "请选择角色", trigger: "change" }]
});

// 表格列配置
const columns: ColumnProps[] = [
  { type: "selection", width: 55, align: "center" },
  { prop: "id", label: "ID", width: 80, align: "center" },
  { prop: "username", label: "用户名", search: { el: "input", order: 1 } },
  { prop: "realName", label: "真实姓名", search: { el: "input", order: 2 } },
  { prop: "email", label: "邮箱", search: { el: "input", order: 3 } },
  { prop: "phone", label: "手机号", search: { el: "input", order: 4 } },
  { prop: "role", label: "角色", width: 200, align: "center" },
  { prop: "status", label: "状态", width: 120, align: "center" },
  { prop: "createTime", label: "创建时间", width: 180, align: "center" },
  { prop: "lastLoginTime", label: "最后登录时间", width: 180, align: "center" },
  { prop: "operation", label: "操作", width: 250, fixed: "right", align: "center" }
];

// 获取角色标签类型
const getRoleType = (role: string) => {
  const roleMap: Record<string, string> = {
    admin: "danger",
    editor: "warning",
    viewer: "info",
    user: "success"
  };
  return roleMap[role] || "default";
};

// 模拟账户数据
const mockAccounts = ref([
  {
    id: "1",
    username: "admin",
    realName: "系统管理员",
    email: "admin@example.com",
    phone: "13800138000",
    roles: ["admin"],
    status: 1,
    createTime: "2023-01-01 10:00:00",
    lastLoginTime: "2023-10-01 10:00:00"
  },
  {
    id: "2",
    username: "editor",
    realName: "内容编辑",
    email: "editor@example.com",
    phone: "13800138001",
    roles: ["editor"],
    status: 1,
    createTime: "2023-02-01 10:00:00",
    lastLoginTime: "2023-09-25 15:30:00"
  },
  {
    id: "3",
    username: "viewer",
    realName: "数据查看者",
    email: "viewer@example.com",
    phone: "13800138002",
    roles: ["viewer"],
    status: 0,
    createTime: "2023-03-01 10:00:00",
    lastLoginTime: "2023-08-15 09:15:00"
  },
  {
    id: "4",
    username: "user1",
    realName: "普通用户1",
    email: "user1@example.com",
    phone: "13800138003",
    roles: ["user"],
    status: 1,
    createTime: "2023-04-01 10:00:00",
    lastLoginTime: "2023-09-30 14:45:00"
  },
  {
    id: "5",
    username: "user2",
    realName: "普通用户2",
    email: "user2@example.com",
    phone: "13800138004",
    roles: ["user"],
    status: 1,
    createTime: "2023-05-01 10:00:00",
    lastLoginTime: "2023-09-28 11:20:00"
  }
]);

// 获取账户列表
const getAccountList = async (params: any) => {
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 模拟数据过滤
    let filteredData = [...mockAccounts.value];

    if (params.username) {
      filteredData = filteredData.filter(item => item.username.toLowerCase().includes(params.username.toLowerCase()));
    }

    if (params.realName) {
      filteredData = filteredData.filter(item => item.realName.toLowerCase().includes(params.realName.toLowerCase()));
    }

    if (params.email) {
      filteredData = filteredData.filter(item => item.email.toLowerCase().includes(params.email.toLowerCase()));
    }

    if (params.phone) {
      filteredData = filteredData.filter(item => item.phone.includes(params.phone));
    }

    // 模拟分页
    const pageNum = params.pageNum || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);

    return {
      code: 200,
      data: pageData,
      total: filteredData.length
    };
  } catch (error) {
    console.error("获取账户列表失败:", error);
    return {
      code: 500,
      data: [],
      total: 0
    };
  }
};

// 新增账户
const addAccount = async (data: any) => {
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 检查用户名是否已存在
    const exists = mockAccounts.value.some(item => item.username === data.username);
    if (exists) {
      throw new Error("用户名已存在");
    }

    // 生成新的 ID
    const maxId = Math.max(...mockAccounts.value.map(item => parseInt(item.id)), 0);
    const newAccount = {
      id: (maxId + 1).toString(),
      username: data.username,
      realName: data.realName,
      email: data.email,
      phone: data.phone,
      roles: data.roles,
      status: data.status,
      createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
      lastLoginTime: ""
    };

    // 添加到模拟数据
    mockAccounts.value.push(newAccount);

    return {
      code: 200,
      message: "新增账户成功"
    };
  } catch (error) {
    console.error("新增账户失败:", error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "新增账户失败"
    };
  }
};

// 编辑账户
const editAccount = async (data: any) => {
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 找到要编辑的账户
    const index = mockAccounts.value.findIndex(item => item.id === data.id);
    if (index === -1) {
      throw new Error("账户不存在");
    }

    // 更新账户信息
    mockAccounts.value[index] = {
      ...mockAccounts.value[index],
      realName: data.realName,
      email: data.email,
      phone: data.phone,
      roles: data.roles,
      status: data.status
    };

    return {
      code: 200,
      message: "编辑账户成功"
    };
  } catch (error) {
    console.error("编辑账户失败:", error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "编辑账户失败"
    };
  }
};

// 删除账户
const deleteAccountApi = async (id: string) => {
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 找到要删除的账户
    const index = mockAccounts.value.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error("账户不存在");
    }

    // 删除账户
    mockAccounts.value.splice(index, 1);

    return {
      code: 200,
      message: "删除账户成功"
    };
  } catch (error) {
    console.error("删除账户失败:", error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "删除账户失败"
    };
  }
};

// 批量删除账户
const deleteSelectedAccountsApi = async (ids: string[]) => {
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 删除多个账户
    mockAccounts.value = mockAccounts.value.filter(item => !ids.includes(item.id));

    return {
      code: 200,
      message: "批量删除账户成功"
    };
  } catch (error) {
    console.error("批量删除账户失败:", error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "批量删除账户失败"
    };
  }
};

// 更新账户状态
const updateAccountStatusApi = async (data: any) => {
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 找到要更新的账户
    const index = mockAccounts.value.findIndex(item => item.id === data.id);
    if (index === -1) {
      throw new Error("账户不存在");
    }

    // 更新账户状态
    mockAccounts.value[index].status = data.status;

    return {
      code: 200,
      message: "更新账户状态成功"
    };
  } catch (error) {
    console.error("更新账户状态失败:", error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "更新账户状态失败"
    };
  }
};

// 打开新增对话框
const openAddDialog = () => {
  dialogType.value = "add";
  dialogVisible.value = true;
  resetForm();
};

// 打开编辑对话框
const openEditDialog = (row: any) => {
  dialogType.value = "edit";
  dialogVisible.value = true;
  // 填充表单数据
  formData.id = row.id;
  formData.username = row.username;
  formData.realName = row.realName;
  formData.email = row.email;
  formData.phone = row.phone;
  formData.roles = [...row.roles];
  formData.status = row.status;
};

// 查看账户详情
const viewAccount = (row: any) => {
  detailDialogVisible.value = true;
  // 填充详情数据
  Object.assign(detailData, row);
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    let result;
    if (dialogType.value === "add") {
      result = await addAccount(formData);
    } else {
      result = await editAccount(formData);
    }

    if (result.code === 200) {
      ElMessage.success(result.message);
      dialogVisible.value = false;
      // 刷新表格数据
      proTable.value?.getTableList();
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  // 重置表单数据
  Object.assign(formData, {
    id: "",
    username: "",
    password: "",
    confirmPassword: "",
    realName: "",
    email: "",
    phone: "",
    roles: [],
    status: 1
  });
};

// 删除账户
const deleteAccount = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除账户 "${row.username}" 吗？`, "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    const result = await deleteAccountApi(row.id);
    if (result.code === 200) {
      ElMessage.success(result.message);
      // 刷新表格数据
      proTable.value?.getTableList();
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除账户失败:", error);
      ElMessage.error("删除账户失败");
    }
  }
};

// 批量删除账户
const deleteSelectedAccounts = async () => {
  try {
    const selectedIds = proTable.value?.selectedListIds || [];
    if (selectedIds.length === 0) {
      ElMessage.warning("请选择要删除的账户");
      return;
    }

    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.length} 个账户吗？`, "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    const result = await deleteSelectedAccountsApi(selectedIds);
    if (result.code === 200) {
      ElMessage.success(result.message);
      // 刷新表格数据
      proTable.value?.getTableList();
      // 清空选择
      proTable.value?.clearSelection();
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除账户失败:", error);
      ElMessage.error("批量删除账户失败");
    }
  }
};

// 更新账户状态
const updateAccountStatus = async (row: any) => {
  try {
    const result = await updateAccountStatusApi(row);
    if (result.code === 200) {
      ElMessage.success(result.message);
      // 刷新表格数据
      proTable.value?.getTableList();
    } else {
      ElMessage.error(result.message);
      // 恢复原来的状态
      row.status = row.status === 1 ? 0 : 1;
    }
  } catch (error) {
    console.error("更新账户状态失败:", error);
    ElMessage.error("更新账户状态失败");
    // 恢复原来的状态
    row.status = row.status === 1 ? 0 : 1;
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  proTable.value?.getTableList();
});
</script>

<style scoped>
.table-box {
  padding: 20px;
}

.dialog-form {
  margin-top: 20px;
}
</style>
