<template>
  <div class="system-account-manage">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">账号管理</h2>
      <p class="page-description">管理系统用户账户信息，包括增删改查等操作</p>
    </div>

    <!-- 表格区域 -->
    <div class="table-wrapper">
      <el-card shadow="hover" class="table-card">
        <!-- 操作按钮区域 -->
        <div class="table-actions mb-4">
          <el-button type="primary" icon="Plus" @click="handleAdd" v-auth="['accountManage:add']"> 新增账号 </el-button>
          <el-button type="success" icon="Upload" @click="handleImport" v-auth="['accountManage:batchAdd']"> 批量导入 </el-button>
          <el-button type="warning" icon="Download" @click="handleExport" v-auth="['accountManage:export']"> 导出数据 </el-button>
          <el-button
            type="danger"
            icon="Delete"
            @click="handleBatchDelete"
            :disabled="selectedRowKeys.length === 0"
            v-auth="['accountManage:batchDelete']"
          >
            批量删除
          </el-button>
        </div>

        <!-- 表格配置 -->
        <ProTable
          ref="proTableRef"
          :columns="columns"
          :request="getUserListData"
          :row-key="record => record.id"
          :default-params="{ page: 1, pageSize: 10 }"
          :scroll="{ x: 1000 }"
          :pagination="{ showTotal: total => `共 ${total} 条数据` }"
          v-model:selected-row-keys="selectedRowKeys"
          :show-select="true"
          :show-index="true"
          :index-label="'序号'"
          :loading="loading"
        >
          <!-- 自定义操作列 -->
          <template #action="{ row }">
            <el-button type="primary" size="small" icon="Edit" @click="handleEdit(row)" v-auth="['accountManage:edit']">
              编辑
            </el-button>
            <el-button type="success" size="small" icon="Switch" @click="handleStatus(row)" v-auth="['accountManage:status']">
              {{ row.status === 1 ? "禁用" : "启用" }}
            </el-button>
            <el-button
              type="warning"
              size="small"
              icon="Refresh"
              @click="handleResetPassword(row)"
              v-auth="['accountManage:resetPassword']"
            >
              重置密码
            </el-button>
            <el-button type="danger" size="small" icon="Delete" @click="handleDelete(row)" v-auth="['accountManage:delete']">
              删除
            </el-button>
          </template>

          <!-- 自定义性别列 -->
          <template #gender="{ row }">
            <el-tag :type="row.gender === 1 ? 'success' : 'info'">
              {{ row.gender === 1 ? "男" : "女" }}
            </el-tag>
          </template>

          <!-- 自定义状态列 -->
          <template #status="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
              v-auth="['accountManage:status']"
            >
            </el-switch>
          </template>
        </ProTable>
      </el-card>
    </div>

    <!-- 用户编辑抽屉 -->
    <UserDrawer
      ref="userDrawerRef"
      v-model:visible="drawerVisible"
      :title="drawerTitle"
      :data="currentUser"
      :is-edit="isEdit"
      @success="handleDrawerSuccess"
    />

    <!-- 导入组件 -->
    <ImportExcel
      ref="importExcelRef"
      v-model:visible="importVisible"
      :api="BatchAddUser"
      :template-url="'/template/user.xlsx'"
      @success="handleImportSuccess"
    />
  </div>
</template>

<script lang="ts" setup name="SystemAccountManage">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import type { ColumnType } from "@/components/ProTable/interface";
import type { User } from "@/api/interface/index";

// 导入API
import { getUserList, deleteUser, changeUserStatus, resetUserPassWord, exportUserInfo, BatchAddUser } from "@/api/modules/user";

// 导入组件
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";

// 表格引用
const proTableRef = ref<InstanceType<typeof ProTable>>();
// 用户抽屉引用
const userDrawerRef = ref<InstanceType<typeof UserDrawer>>();
// 导入组件引用
const importExcelRef = ref<InstanceType<typeof ImportExcel>>();

// 加载状态
const loading = ref(false);
// 选中的行
const selectedRowKeys = ref<number[]>([]);
// 抽屉可见性
const drawerVisible = ref(false);
// 导入可见性
const importVisible = ref(false);
// 是否编辑模式
const isEdit = ref(false);
// 抽屉标题
const drawerTitle = ref("");
// 当前用户数据
const currentUser = ref<User.ResUserList>({} as User.ResUserList);

// 表格列配置
const columns: ColumnType[] = [
  {
    label: "用户名",
    prop: "username",
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    label: "姓名",
    prop: "name",
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    label: "性别",
    prop: "gender",
    width: 80,
    slot: "gender"
  },
  {
    label: "身份证号",
    prop: "idCard",
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    label: "邮箱",
    prop: "email",
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    label: "手机号",
    prop: "phone",
    minWidth: 130,
    showOverflowTooltip: true
  },
  {
    label: "部门",
    prop: "department",
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    label: "角色",
    prop: "role",
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    slot: "status"
  },
  {
    label: "创建时间",
    prop: "createTime",
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    label: "操作",
    width: 280,
    slot: "action",
    fixed: "right"
  }
];

// 获取用户列表
const getUserListData = async (params: User.ReqUserParams) => {
  loading.value = true;
  try {
    const res = await getUserList(params);
    return {
      list: res.data.records,
      total: res.data.total
    };
  } catch (error) {
    ElMessage.error("获取用户列表失败");
    return {
      list: [],
      total: 0
    };
  } finally {
    loading.value = false;
  }
};

// 新增用户
const handleAdd = () => {
  isEdit.value = false;
  drawerTitle.value = "新增账号";
  currentUser.value = {} as User.ResUserList;
  drawerVisible.value = true;
};

// 编辑用户
const handleEdit = (row: User.ResUserList) => {
  isEdit.value = true;
  drawerTitle.value = "编辑账号";
  currentUser.value = { ...row };
  drawerVisible.value = true;
};

// 删除用户
const handleDelete = (row: User.ResUserList) => {
  ElMessageBox.confirm("确定要删除该用户吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        await deleteUser({ id: [row.id] });
        ElMessage.success("删除成功");
        proTableRef.value?.refresh();
      } catch (error) {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }

  ElMessageBox.confirm("确定要删除选中的用户吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        await deleteUser({ id: selectedRowKeys.value });
        ElMessage.success("批量删除成功");
        proTableRef.value?.refresh();
        selectedRowKeys.value = [];
      } catch (error) {
        ElMessage.error("批量删除失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 切换用户状态
const handleStatus = (row: User.ResUserList) => {
  const newStatus = row.status === 1 ? 0 : 1;
  const statusText = newStatus === 1 ? "启用" : "禁用";

  ElMessageBox.confirm(`确定要${statusText}该用户吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        await changeUserStatus({ id: row.id, status: newStatus });
        ElMessage.success(`${statusText}成功`);
        proTableRef.value?.refresh();
      } catch (error) {
        ElMessage.error(`${statusText}失败`);
      }
    })
    .catch(() => {
      ElMessage.info(`已取消${statusText}`);
    });
};

// 状态切换回调
const handleStatusChange = (row: User.ResUserList) => {
  handleStatus(row);
};

// 重置密码
const handleResetPassword = (row: User.ResUserList) => {
  ElMessageBox.confirm("确定要重置该用户的密码吗？重置后密码将变为默认密码123456", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        await resetUserPassWord({ id: row.id });
        ElMessage.success("密码重置成功");
        ElNotification.success({
          title: "密码重置成功",
          message: `用户${row.username}的密码已重置为123456`,
          duration: 5000
        });
      } catch (error) {
        ElMessage.error("密码重置失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消重置");
    });
};

// 导出数据
const handleExport = () => {
  ElMessageBox.confirm("确定要导出用户数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info"
  })
    .then(async () => {
      try {
        await exportUserInfo({ page: 1, pageSize: 9999 });
        ElMessage.success("导出成功");
      } catch (error) {
        ElMessage.error("导出失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消导出");
    });
};

// 导入数据
const handleImport = () => {
  importVisible.value = true;
};

// 抽屉成功回调
const handleDrawerSuccess = () => {
  proTableRef.value?.refresh();
  drawerVisible.value = false;
};

// 导入成功回调
const handleImportSuccess = () => {
  proTableRef.value?.refresh();
  importVisible.value = false;
};

// 页面加载时初始化
onMounted(() => {
  console.log("账号管理页面已加载");
});
</script>

<style lang="scss" scoped>
.system-account-manage {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;

  .page-header {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .page-title {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }

    .page-description {
      margin: 0;
      font-size: 14px;
      color: #909399;
    }
  }

  .table-wrapper {
    .table-card {
      .table-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .el-button {
          margin-bottom: 8px;
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    padding: 10px;

    .page-header {
      padding: 15px;

      .page-title {
        font-size: 18px;
      }
    }

    .table-wrapper {
      .table-card {
        .table-actions {
          flex-direction: column;

          .el-button {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
