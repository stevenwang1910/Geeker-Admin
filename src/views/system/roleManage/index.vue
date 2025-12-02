<template>
  <div class="table-box">
    <ProTable ref="proTable" title="角色管理" :columns="columns" :request-api="getRoleList" :row-key="row => row.id">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')"> 新增角色 </el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="Edit" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Setting" @click="openPermissionDialog(scope.row)"> 分配权限 </el-button>
        <el-button type="primary" link :icon="User" @click="openMemberDialog(scope.row)"> 成员管理 </el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelete(scope.row)"> 删除 </el-button>
      </template>

      <!-- 角色状态 -->
      <template #status="scope">
        <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="handleStatusChange(scope.row)">
        </el-switch>
      </template>
    </ProTable>

    <!-- 角色编辑抽屉 -->
    <el-drawer v-model="drawerVisible" :title="drawerTitle" size="500px" destroy-on-close>
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="100px" style="padding-right: 20px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="roleForm.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色排序" prop="roleSort">
          <el-input-number v-model="roleForm.roleSort" :min="0" placeholder="请输入角色排序" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="角色状态">
          <el-switch v-model="roleForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRoleForm">确认</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 权限分配对话框 -->
    <el-dialog v-model="permissionDialogVisible" title="分配权限" width="70%" destroy-on-close>
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTreeData"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        check-strictly
      ></el-tree>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPermission">确认分配</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 成员管理对话框 -->
    <el-dialog v-model="memberDialogVisible" title="角色成员" width="70%" destroy-on-close>
      <div class="member-container">
        <div class="member-left">
          <div class="member-header">
            <span>可选用户</span>
            <el-input v-model="memberSearch" placeholder="搜索用户" clearable style="width: 200px"> </el-input>
          </div>
          <el-transfer
            ref="memberTransferRef"
            v-model="memberTransferValue"
            :data="memberList"
            :titles="['可选用户', '已选用户']"
            :filter-method="filterMember"
            filter-placeholder="请输入用户昵称"
          ></el-transfer>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="memberDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitMember">确认保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="roleManage">
import { ref, reactive, nextTick, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { CirclePlus, Edit, Setting, User, Delete } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import type { ProTableProps } from "@/components/ProTable/index.vue";

// ProTable 实例
const proTable = ref<InstanceType<typeof ProTableProps>>();

// 页面加载时初始化表格
onMounted(() => {
  proTable.value?.getTableData();
});

// 表格列配置
const columns: ProTableProps["columns"] = [
  {
    label: "角色名称",
    prop: "roleName",
    minWidth: 120,
    isSearch: true
  },
  {
    label: "角色编码",
    prop: "roleCode",
    minWidth: 120,
    isSearch: true
  },
  {
    label: "角色排序",
    prop: "roleSort",
    width: 100,
    align: "center"
  },
  {
    label: "角色状态",
    prop: "status",
    width: 100,
    align: "center",
    slot: "status"
  },
  {
    label: "创建时间",
    prop: "createTime",
    minWidth: 160,
    isSearch: true,
    search: "rangePicker"
  },
  {
    label: "更新时间",
    prop: "updateTime",
    minWidth: 160
  },
  {
    label: "操作",
    width: 300,
    fixed: "right",
    slot: "operation"
  }
];

// 获取角色列表
const getRoleList = async (params: any) => {
  // 模拟接口请求
  const result = {
    code: 200,
    msg: "success",
    data: {
      list: [
        {
          id: "1",
          roleName: "超级管理员",
          roleCode: "admin",
          roleSort: 1,
          status: "1",
          description: "系统超级管理员，拥有所有权限",
          createTime: "2024-01-01 12:00:00",
          updateTime: "2024-01-01 12:00:00"
        },
        {
          id: "2",
          roleName: "普通管理员",
          roleCode: "common",
          roleSort: 2,
          status: "1",
          description: "系统普通管理员，拥有部分权限",
          createTime: "2024-01-02 12:00:00",
          updateTime: "2024-01-02 12:00:00"
        }
      ],
      total: 2,
      pageNum: params.pageNum,
      pageSize: params.pageSize
    }
  };
  return result;
};

// 抽屉相关
const drawerVisible = ref(false);
const drawerTitle = ref("");
const roleFormRef = ref<FormInstance>();
const roleForm = reactive({
  id: "",
  roleName: "",
  roleCode: "",
  roleSort: 0,
  description: "",
  status: "1"
});

// 表单校验规则
const roleRules: FormRules = {
  roleName: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, max: 20, message: "角色名称长度在 2 到 20 个字符", trigger: "blur" }
  ],
  roleCode: [
    { required: true, message: "请输入角色编码", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9_]+$/, message: "角色编码只能包含字母、数字和下划线", trigger: "blur" }
  ],
  roleSort: [{ required: true, message: "请输入角色排序", trigger: "blur" }]
};

// 打开抽屉
const openDrawer = (title: string, row?: any) => {
  drawerTitle.value = title;
  drawerVisible.value = true;
  if (row) {
    Object.assign(roleForm, row);
  } else {
    Object.assign(roleForm, {
      id: "",
      roleName: "",
      roleCode: "",
      roleSort: 0,
      description: "",
      status: "1"
    });
  }
};

// 提交角色表单
const submitRoleForm = async () => {
  if (!roleFormRef.value) return;
  await roleFormRef.value.validate();
  try {
    // 模拟接口请求
    ElMessage.success(drawerTitle.value === "新增" ? "角色创建成功" : "角色编辑成功");
    drawerVisible.value = false;
    proTable.value?.getTableData();
  } catch (error) {
    ElMessage.error("操作失败");
  }
};

// 切换角色状态
const handleStatusChange = async (row: any) => {
  try {
    // 模拟接口请求
    ElMessage.success(`角色【${row.roleName}】${row.status === "1" ? "启用" : "禁用"}成功`);
  } catch (error) {
    row.status = row.status === "1" ? "0" : "1";
    ElMessage.error("操作失败");
  }
};

// 删除角色
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色【${row.roleName}】吗？`, "提示", {
      type: "warning"
    });
    // 模拟接口请求
    ElMessage.success(`角色【${row.roleName}】删除成功`);
    proTable.value?.getTableData();
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

// 批量删除
const batchDelete = async (ids: string[]) => {
  try {
    await ElMessageBox.confirm(`确定要批量删除这${ids.length}个角色吗？`, "提示", {
      type: "warning"
    });
    // 模拟接口请求
    ElMessage.success(`成功删除${ids.length}个角色`);
    proTable.value?.getTableData();
  } catch (error) {
    ElMessage.error("批量删除失败");
  }
};

// 权限分配相关
const permissionDialogVisible = ref(false);
const permissionTreeRef = ref();
const permissionTreeData = ref([
  {
    id: "1",
    label: "系统管理",
    children: [
      {
        id: "1-1",
        label: "用户管理",
        children: [
          { id: "1-1-1", label: "查询" },
          { id: "1-1-2", label: "新增" },
          { id: "1-1-3", label: "编辑" },
          { id: "1-1-4", label: "删除" }
        ]
      },
      {
        id: "1-2",
        label: "角色管理",
        children: [
          { id: "1-2-1", label: "查询" },
          { id: "1-2-2", label: "新增" },
          { id: "1-2-3", label: "编辑" },
          { id: "1-2-4", label: "删除" },
          { id: "1-2-5", label: "分配权限" }
        ]
      }
    ]
  }
]);

const treeProps = {
  label: "label",
  children: "children"
};

// 打开权限分配对话框
const openPermissionDialog = (row: any) => {
  permissionDialogVisible.value = true;
  // 模拟根据角色ID获取已分配权限并回显
  console.log(`Loading permissions for role: ${row.roleName}`);
  nextTick(() => {
    permissionTreeRef.value?.setCheckedKeys(["1-1-1", "1-2-1"]);
  });
};

// 提交权限分配
const submitPermission = async () => {
  try {
    const checkedKeys = permissionTreeRef.value?.getCheckedKeys();
    // 模拟接口请求
    ElMessage.success(`成功分配${checkedKeys?.length ?? 0}项权限`);
    permissionDialogVisible.value = false;
  } catch (error) {
    ElMessage.error("权限分配失败");
  }
};

// 成员管理相关
const memberDialogVisible = ref(false);
const memberTransferRef = ref();
const memberSearch = ref("");
const memberTransferValue = ref<string[]>(["1"]);
const memberList = ref([
  { key: "1", label: "管理员" },
  { key: "2", label: "用户1" },
  { key: "3", label: "用户2" },
  { key: "4", label: "用户3" }
]);

// 搜索成员
const filterMember = (query: string, item: any) => {
  return item.label.toLowerCase().includes(query.toLowerCase());
};

// 打开成员管理对话框
const openMemberDialog = (row: any) => {
  memberDialogVisible.value = true;
  // 模拟根据角色ID获取已选成员
  console.log(`Loading members for role: ${row.roleName}`);
};

// 提交成员管理
const submitMember = async () => {
  try {
    // 模拟接口请求
    ElMessage.success("成员分配成功");
    memberDialogVisible.value = false;
  } catch (error) {
    ElMessage.error("成员分配失败");
  }
};
</script>

<style scoped lang="scss">
.table-box {
  padding: 20px;
}
.dialog-footer {
  text-align: right;
}
.member-container {
  display: flex;
  width: 100%;
  height: 500px;
  .member-left {
    flex: 1;
    .member-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
}

// 响应式设计适配
@media screen and (width <= 1200px) {
  :deep(.el-table__fixed-right) {
    display: none;
  }
}

@media screen and (width <= 768px) {
  .table-box {
    padding: 10px;
  }
  :deep(.el-button) {
    padding: 8px 10px;
    margin: 0 4px 4px 0;
    font-size: 12px;
  }
  :deep(.el-table) {
    font-size: 12px;
  }
  :deep(.el-table th) {
    padding: 8px 0;
  }
  :deep(.el-table td) {
    padding: 8px 0;
  }
  .member-container {
    height: 300px;
  }
}

@media screen and (width <= 480px) {
  :deep(.el-table) {
    --el-table-header-text-color: var(--el-text-color-secondary);
    --el-table-row-hover-bg: var(--el-fill-color-light);
  }
  :deep(.el-table__header) {
    font-size: 11px;
  }
  :deep(.el-table__body) {
    font-size: 11px;
  }
}
</style>
