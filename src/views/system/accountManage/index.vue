<template>
  <div class="account-manage">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title" aria-label="用户账户管理">用户账户管理</h1>
      <el-button type="primary" @click="showAddDialog" :disabled="!hasPermission('system:account:add')" aria-label="添加新账户">
        <el-icon><Plus /></el-icon>
        添加账户
      </el-button>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable @keyup.enter="fetchAccountList">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable @keyup.enter="fetchAccountList">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchAccountList" aria-label="搜索账户">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearchForm" aria-label="重置搜索条件">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 账户列表表格 -->
    <div class="table-section">
      <el-table v-loading="loading" :data="accountList" stripe border style="width: 100%" aria-label="用户账户列表">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名" min-width="120"></el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="150"></el-table-column>
        <el-table-column prop="role" label="角色" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
              {{ row.role === "admin" ? "管理员" : "普通用户" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="updateAccountStatus(row.id, row.status)"
              :disabled="!hasPermission('system:account:edit')"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              @click="showEditDialog(row)"
              :disabled="!hasPermission('system:account:edit')"
              aria-label="编辑账户"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteAccount(row.id, row.username)"
              :disabled="!hasPermission('system:account:delete')"
              aria-label="删除账户"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        aria-label="分页控制"
      ></el-pagination>
    </div>

    <!-- 添加账户对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加新账户" width="500px" @close="closeAddDialog" aria-label="添加账户对话框">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="addForm.confirmPassword" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="addForm.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addAccount" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑账户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑账户信息"
      width="500px"
      @close="closeEditDialog"
      aria-label="编辑账户对话框"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editAccount" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="accountManage">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDate } from "@/utils/index";
import { useAuthButtons } from "@/hooks/useAuthButtons"; // 权限控制hook

// 导入图标
import { Plus, Search, Edit, Delete, Refresh, Message } from "@element-plus/icons-vue";

// 权限控制
const { hasPermission } = useAuthButtons();

// 加载状态
const loading = ref<boolean>(false);
const submitting = ref<boolean>(false);

// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

// 搜索表单
const searchForm = reactive({
  username: "",
  email: "",
  status: ""
});

// 账户列表数据
const accountList = ref<any[]>([]);

// 对话框状态
const addDialogVisible = ref<boolean>(false);
const editDialogVisible = ref<boolean>(false);

// 添加表单数据
const addForm = reactive({
  username: "",
  nickname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "user",
  status: 1
});

// 编辑表单数据
const editForm = reactive({
  id: "",
  username: "",
  nickname: "",
  email: "",
  phone: "",
  role: "user",
  status: 1
});

// 添加表单验证规则
const addFormRules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在 3 到 20 个字符", trigger: "blur" }
  ],
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 15, message: "昵称长度在 2 到 15 个字符", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email" as const, message: "请输入有效的邮箱地址", trigger: "blur" }
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== addForm.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }]
});

// 编辑表单验证规则
const editFormRules = reactive({
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 15, message: "昵称长度在 2 到 15 个字符", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email" as const, message: "请输入有效的邮箱地址", trigger: "blur" }
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码", trigger: "blur" }],
  role: [{ required: true, message: "请选择角色", trigger: "change" }]
});

// 添加和编辑表单引用
const addFormRef = ref<any>();
const editFormRef = ref<any>();

// 模拟API数据
const mockAccounts = [
  {
    id: "1",
    username: "admin",
    nickname: "系统管理员",
    email: "admin@example.com",
    phone: "13800138000",
    role: "admin",
    status: 1,
    createTime: "2023-01-01 10:00:00"
  },
  {
    id: "2",
    username: "user1",
    nickname: "普通用户1",
    email: "user1@example.com",
    phone: "13800138001",
    role: "user",
    status: 1,
    createTime: "2023-01-02 11:00:00"
  },
  {
    id: "3",
    username: "user2",
    nickname: "普通用户2",
    email: "user2@example.com",
    phone: "13800138002",
    role: "user",
    status: 0,
    createTime: "2023-01-03 12:00:00"
  },
  {
    id: "4",
    username: "user3",
    nickname: "普通用户3",
    email: "user3@example.com",
    phone: "13800138003",
    role: "user",
    status: 1,
    createTime: "2023-01-04 13:00:00"
  },
  {
    id: "5",
    username: "user4",
    nickname: "普通用户4",
    email: "user4@example.com",
    phone: "13800138004",
    role: "user",
    status: 1,
    createTime: "2023-01-05 14:00:00"
  },
  {
    id: "6",
    username: "user5",
    nickname: "普通用户5",
    email: "user5@example.com",
    phone: "13800138005",
    role: "user",
    status: 1,
    createTime: "2023-01-06 15:00:00"
  },
  {
    id: "7",
    username: "user6",
    nickname: "普通用户6",
    email: "user6@example.com",
    phone: "13800138006",
    role: "user",
    status: 1,
    createTime: "2023-01-07 16:00:00"
  },
  {
    id: "8",
    username: "user7",
    nickname: "普通用户7",
    email: "user7@example.com",
    phone: "13800138007",
    role: "user",
    status: 1,
    createTime: "2023-01-08 17:00:00"
  },
  {
    id: "9",
    username: "user8",
    nickname: "普通用户8",
    email: "user8@example.com",
    phone: "13800138008",
    role: "user",
    status: 1,
    createTime: "2023-01-09 18:00:00"
  },
  {
    id: "10",
    username: "user9",
    nickname: "普通用户9",
    email: "user9@example.com",
    phone: "13800138009",
    role: "user",
    status: 1,
    createTime: "2023-01-10 19:00:00"
  },
  {
    id: "11",
    username: "user10",
    nickname: "普通用户10",
    email: "user10@example.com",
    phone: "13800138010",
    role: "user",
    status: 1,
    createTime: "2023-01-11 20:00:00"
  }
];

// 模拟API请求 - 获取账户列表
const fetchAccountList = () => {
  loading.value = true;

  // 模拟异步请求
  setTimeout(() => {
    try {
      // 应用搜索过滤
      let filteredAccounts = [...mockAccounts];

      if (searchForm.username) {
        filteredAccounts = filteredAccounts.filter(account =>
          account.username.toLowerCase().includes(searchForm.username.toLowerCase())
        );
      }

      if (searchForm.email) {
        filteredAccounts = filteredAccounts.filter(account =>
          account.email.toLowerCase().includes(searchForm.email.toLowerCase())
        );
      }

      if (searchForm.status !== "") {
        filteredAccounts = filteredAccounts.filter(account => account.status.toString() === searchForm.status);
      }

      // 分页处理
      const startIndex = (pagination.page - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;

      accountList.value = filteredAccounts.slice(startIndex, endIndex);
      pagination.total = filteredAccounts.length;

      ElMessage.success("账户列表加载成功");
    } catch (error) {
      ElMessage.error("账户列表加载失败");
      console.error("Error fetching account list:", error);
    } finally {
      loading.value = false;
    }
  }, 1000);
};

// 重置搜索表单
const resetSearchForm = () => {
  searchForm.username = "";
  searchForm.email = "";
  searchForm.status = "";

  // 重置到第一页
  pagination.page = 1;

  // 重新加载数据
  fetchAccountList();
};

// 分页大小变化
const handlePageSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.page = 1; // 重置到第一页
  fetchAccountList();
};

// 页码变化
const handleCurrentPageChange = (page: number) => {
  pagination.page = page;
  fetchAccountList();
};

// 显示添加账户对话框
const showAddDialog = () => {
  addDialogVisible.value = true;

  // 重置表单
  Object.assign(addForm, {
    username: "",
    nickname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
    status: 1
  });

  if (addFormRef.value) {
    addFormRef.value.clearValidate();
  }
};

// 关闭添加账户对话框
const closeAddDialog = () => {
  addDialogVisible.value = false;
};

// 显示编辑账户对话框
const showEditDialog = (row: any) => {
  editDialogVisible.value = true;

  // 填充表单数据
  Object.assign(editForm, {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    email: row.email,
    phone: row.phone,
    role: row.role,
    status: row.status
  });

  if (editFormRef.value) {
    editFormRef.value.clearValidate();
  }
};

// 关闭编辑账户对话框
const closeEditDialog = () => {
  editDialogVisible.value = false;
};

// 添加账户
const addAccount = () => {
  if (!addFormRef.value) return;

  addFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true;

      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 生成新ID
        const newId = (mockAccounts.length + 1).toString();

        // 添加到模拟数据
        mockAccounts.push({
          id: newId,
          username: addForm.username,
          nickname: addForm.nickname,
          email: addForm.email,
          phone: addForm.phone,
          role: addForm.role,
          status: addForm.status,
          createTime: new Date().toISOString().slice(0, 19).replace("T", " ")
        });

        ElMessage.success("账户添加成功");

        // 关闭对话框
        addDialogVisible.value = false;

        // 重新加载数据
        fetchAccountList();
      } catch (error) {
        ElMessage.error("账户添加失败");
        console.error("Error adding account:", error);
      } finally {
        submitting.value = false;
      }
    } else {
      return false;
    }
  });
};

// 编辑账户
const editAccount = () => {
  if (!editFormRef.value) return;

  editFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true;

      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 找到要编辑的账户索引
        const accountIndex = mockAccounts.findIndex(account => account.id === editForm.id);

        if (accountIndex !== -1) {
          // 更新模拟数据
          mockAccounts[accountIndex] = {
            ...mockAccounts[accountIndex],
            nickname: editForm.nickname,
            email: editForm.email,
            phone: editForm.phone,
            role: editForm.role,
            status: editForm.status
          };

          ElMessage.success("账户编辑成功");

          // 关闭对话框
          editDialogVisible.value = false;

          // 重新加载数据
          fetchAccountList();
        } else {
          ElMessage.error("账户不存在");
        }
      } catch (error) {
        ElMessage.error("账户编辑失败");
        console.error("Error editing account:", error);
      } finally {
        submitting.value = false;
      }
    } else {
      return false;
    }
  });
};

// 更新账户状态
const updateAccountStatus = (id: string, status: number) => {
  const statusText = status === 1 ? "启用" : "禁用";

  // 模拟API请求
  setTimeout(() => {
    try {
      // 找到要更新的账户索引
      const accountIndex = mockAccounts.findIndex(account => account.id === id);

      if (accountIndex !== -1) {
        // 更新模拟数据
        mockAccounts[accountIndex].status = status;

        ElMessage.success(`账户${statusText}成功`);

        // 重新加载数据
        fetchAccountList();
      } else {
        ElMessage.error("账户不存在");
      }
    } catch (error) {
      ElMessage.error(`账户${statusText}失败`);
      console.error(`Error updating account status to ${statusText}:`, error);
    }
  }, 500);
};

// 删除账户
const deleteAccount = (id: string, username: string) => {
  ElMessageBox.confirm(`确定要删除账户 "${username}" 吗？此操作不可撤销。`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      // 模拟API请求
      setTimeout(() => {
        try {
          // 找到要删除的账户索引
          const accountIndex = mockAccounts.findIndex(account => account.id === id);

          if (accountIndex !== -1) {
            // 从模拟数据中删除
            mockAccounts.splice(accountIndex, 1);

            ElMessage.success("账户删除成功");

            // 重新加载数据
            fetchAccountList();
          } else {
            ElMessage.error("账户不存在");
          }
        } catch (error) {
          ElMessage.error("账户删除失败");
          console.error("Error deleting account:", error);
        }
      }, 500);
    })
    .catch(() => {
      ElMessage.info("已取消删除账户");
    });
};

// 组件挂载时加载数据
onMounted(() => {
  fetchAccountList();
});
</script>

<style scoped>
.account-manage {
  padding: 20px;
  min-height: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.search-section {
  margin-bottom: 20px;
}

.search-form {
  padding: 15px;
  background-color: var(--el-fill-color-blank);
  border-radius: var(--el-border-radius);
  box-shadow: var(--el-box-shadow);
}

.table-section {
  margin-bottom: 20px;
  background-color: var(--el-fill-color-blank);
  border-radius: var(--el-border-radius);
  box-shadow: var(--el-box-shadow);
  overflow: hidden;
}

.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .account-manage {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .page-title {
    font-size: 20px;
  }

  .search-form {
    padding: 10px;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .pagination-section {
    padding: 10px 0;
  }
}

@media (max-width: 576px) {
  .account-manage {
    padding: 5px;
  }

  .page-title {
    font-size: 18px;
  }

  .search-form {
    padding: 5px;
  }

  .el-form-item__label {
    font-size: 12px;
  }

  .el-input__inner {
    font-size: 12px;
  }

  .el-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
