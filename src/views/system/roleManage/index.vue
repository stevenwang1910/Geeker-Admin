<template>
  <div class="role-manage-container">
    <!-- 角色列表 -->
    <div class="role-list-section">
      <div class="section-header">
        <h2>角色列表</h2>
        <el-button type="primary" @click="showCreateRoleDialog">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
      </div>

      <el-table :data="roleList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="角色ID" width="100" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="1" inactive-value="0" @change="changeRoleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="showEditRoleDialog(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="primary" link @click="showAssignPermissionsDialog(row)">
              <el-icon><Key /></el-icon>
              权限分配
            </el-button>
            <el-button type="primary" link @click="showRoleMembersDialog(row)">
              <el-icon><User /></el-icon>
              成员管理
            </el-button>
            <el-button type="danger" link @click="deleteRole(row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增角色对话框 -->
    <el-dialog v-model="createRoleDialogVisible" title="新增角色" width="500px" @close="resetCreateRoleForm">
      <el-form ref="createRoleFormRef" :model="createRoleForm" :rules="roleFormRules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="createRoleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="createRoleForm.description" placeholder="请输入角色描述" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="createRoleForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createRole">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog v-model="editRoleDialogVisible" title="编辑角色" width="500px" @close="resetEditRoleForm">
      <el-form ref="editRoleFormRef" :model="editRoleForm" :rules="roleFormRules" label-width="100px">
        <el-form-item label="角色ID" prop="id">
          <el-input v-model="editRoleForm.id" placeholder="角色ID" disabled />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editRoleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="editRoleForm.description" placeholder="请输入角色描述" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="editRoleForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editRole">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog v-model="assignPermissionsDialogVisible" title="权限分配" width="600px" @close="resetAssignPermissionsForm">
      <div class="permission-tree-container">
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTreeData"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="permissionTreeProps"
        />
      </div>
      <template #footer>
        <el-button @click="assignPermissionsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="assignPermissions">确定</el-button>
      </template>
    </el-dialog>

    <!-- 角色成员管理对话框 -->
    <el-dialog v-model="roleMembersDialogVisible" title="角色成员管理" width="800px" @close="resetRoleMembersForm">
      <div class="role-members-container">
        <div class="members-search">
          <el-input v-model="membersSearchKeyword" placeholder="请输入用户名或姓名" style="width: 300px; margin-right: 10px">
            <template #append>
              <el-button @click="searchMembers"
                ><el-icon><Search /></el-icon
              ></el-button>
            </template>
          </el-input>
          <el-button type="primary" @click="showAddMembersDialog">
            <el-icon><Plus /></el-icon>
            添加成员
          </el-button>
        </div>

        <el-table :data="roleMembersList" style="width: 100%" @selection-change="handleMembersSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="用户ID" width="100" />
          <el-table-column prop="username" label="用户名" width="150" />
          <el-table-column prop="name" label="姓名" width="150" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === '1' ? 'success' : 'danger'">
                {{ row.status === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button type="danger" link @click="removeMemberFromRole(row.id)">
                <el-icon><Delete /></el-icon>
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="membersPagination.currentPage"
            v-model:page-size="membersPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="membersPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleMembersSizeChange"
            @current-change="handleMembersCurrentChange"
          />
        </div>
      </div>
    </el-dialog>

    <!-- 添加成员对话框 -->
    <el-dialog v-model="addMembersDialogVisible" title="添加成员" width="800px" @close="resetAddMembersForm">
      <div class="add-members-container">
        <div class="members-search">
          <el-input v-model="addMembersSearchKeyword" placeholder="请输入用户名或姓名" style="width: 300px; margin-right: 10px">
            <template #append>
              <el-button @click="searchAddMembers"
                ><el-icon><Search /></el-icon
              ></el-button>
            </template>
          </el-input>
        </div>

        <el-table :data="addMembersList" style="width: 100%" @selection-change="handleAddMembersSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="用户ID" width="100" />
          <el-table-column prop="username" label="用户名" width="150" />
          <el-table-column prop="name" label="姓名" width="150" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === '1' ? 'success' : 'danger'">
                {{ row.status === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="addMembersPagination.currentPage"
            v-model:page-size="addMembersPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="addMembersPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleAddMembersSizeChange"
            @current-change="handleAddMembersCurrentChange"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="addMembersDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addMembersToRole">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="roleManage">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Edit, Delete, Key, User, Search } from "@element-plus/icons-vue";
import * as RoleAPI from "@/api/modules/role";

// 角色列表数据
const roleList = ref<any[]>([]);

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 选中的角色
const selectedRoles = ref<any[]>([]);

// 新增角色对话框
const createRoleDialogVisible = ref(false);
const createRoleFormRef = ref();
const createRoleForm = reactive({
  name: "",
  description: "",
  status: "1"
});

// 编辑角色对话框
const editRoleDialogVisible = ref(false);
const editRoleFormRef = ref();
const editRoleForm = reactive({
  id: "",
  name: "",
  description: "",
  status: "1"
});

// 权限分配对话框
const assignPermissionsDialogVisible = ref(false);
const permissionTreeRef = ref();
const permissionTreeData = ref<any[]>([]);
const permissionTreeProps = {
  label: "name",
  children: "children"
};
const currentRoleForPermissions = ref<any>(null);

// 角色成员管理对话框
const roleMembersDialogVisible = ref(false);
const roleMembersList = ref<any[]>([]);
const membersSearchKeyword = ref("");
const membersPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const selectedMembers = ref<any[]>([]);
const currentRoleForMembers = ref<any>(null);

// 添加成员对话框
const addMembersDialogVisible = ref(false);
const addMembersList = ref<any[]>([]);
const addMembersSearchKeyword = ref("");
const addMembersPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const selectedAddMembers = ref<any[]>([]);

// 表单验证规则
const roleFormRules = {
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, max: 20, message: "角色名称长度在 2 到 20 个字符", trigger: "blur" }
  ],
  description: [{ max: 100, message: "角色描述长度不能超过 100 个字符", trigger: "blur" }]
};

// 页面加载时获取角色列表
onMounted(() => {
  getRoleList();
});

// 获取角色列表
const getRoleList = async () => {
  try {
    const response = await RoleAPI.getRoleList({
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    roleList.value = response.data.list;
    pagination.total = response.data.total;
  } catch (error) {
    console.error("获取角色列表失败:", error);
    ElMessage.error("获取角色列表失败");
  }
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  getRoleList();
};

// 分页当前页变化
const handleCurrentChange = (page: number) => {
  pagination.currentPage = page;
  getRoleList();
};

// 角色选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRoles.value = selection;
};

// 显示新增角色对话框
const showCreateRoleDialog = () => {
  createRoleDialogVisible.value = true;
};

// 重置新增角色表单
const resetCreateRoleForm = () => {
  createRoleFormRef.value?.resetFields();
  createRoleForm.name = "";
  createRoleForm.description = "";
  createRoleForm.status = "1";
};

// 新增角色
const createRole = async () => {
  try {
    await createRoleFormRef.value?.validate();

    await RoleAPI.addRole(createRoleForm);

    ElMessage.success("角色创建成功");
    createRoleDialogVisible.value = false;
    resetCreateRoleForm();
    getRoleList();
  } catch (error: any) {
    if (error.name === "Error") {
      console.error("创建角色失败:", error);
      ElMessage.error("创建角色失败");
    }
  }
};

// 显示编辑角色对话框
const showEditRoleDialog = (row: any) => {
  editRoleForm.id = row.id;
  editRoleForm.name = row.name;
  editRoleForm.description = row.description;
  editRoleForm.status = row.status;
  editRoleDialogVisible.value = true;
};

// 重置编辑角色表单
const resetEditRoleForm = () => {
  editRoleFormRef.value?.resetFields();
  editRoleForm.id = "";
  editRoleForm.name = "";
  editRoleForm.description = "";
  editRoleForm.status = "1";
};

// 编辑角色
const editRole = async () => {
  try {
    await editRoleFormRef.value?.validate();

    await RoleAPI.editRole(editRoleForm);

    ElMessage.success("角色编辑成功");
    editRoleDialogVisible.value = false;
    resetEditRoleForm();
    getRoleList();
  } catch (error: any) {
    if (error.name === "Error") {
      console.error("编辑角色失败:", error);
      ElMessage.error("编辑角色失败");
    }
  }
};

// 改变角色状态
const changeRoleStatus = async (row: any) => {
  try {
    await RoleAPI.changeRoleStatus({ id: row.id, status: row.status });

    ElMessage.success("角色状态修改成功");
  } catch (error) {
    console.error("修改角色状态失败:", error);
    ElMessage.error("修改角色状态失败");
    // 失败时恢复原来的状态
    row.status = row.status === "1" ? "0" : "1";
  }
};

// 删除角色
const deleteRole = async (id: string) => {
  try {
    await ElMessageBox.confirm("确定要删除这个角色吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    await RoleAPI.deleteRole({ id: [id] });

    ElMessage.success("角色删除成功");
    getRoleList();
  } catch (error: any) {
    if (error.name !== "Error") {
      ElMessage.info("已取消删除");
    } else {
      console.error("删除角色失败:", error);
      ElMessage.error("删除角色失败");
    }
  }
};

// 显示权限分配对话框
const showAssignPermissionsDialog = (row: any) => {
  currentRoleForPermissions.value = row;
  getPermissionTree();
  assignPermissionsDialogVisible.value = true;
};

// 获取权限树
const getPermissionTree = async () => {
  try {
    const response = await RoleAPI.getPermissionTree();
    permissionTreeData.value = response.data;

    // 根据角色 ID 获取已分配的权限，并设置默认选中
    const permissionsResponse = await RoleAPI.getRolePermissions({ roleId: currentRoleForPermissions.value.id });
    const permissions = permissionsResponse.data;
    permissionTreeRef.value?.setCheckedKeys(permissions);
  } catch (error) {
    console.error("获取权限树失败:", error);
    ElMessage.error("获取权限树失败");
  }
};

// 重置权限分配表单
const resetAssignPermissionsForm = () => {
  currentRoleForPermissions.value = null;
  permissionTreeData.value = [];
};

// 分配权限
const assignPermissions = async () => {
  try {
    const checkedKeys = permissionTreeRef.value?.getCheckedKeys();

    await RoleAPI.assignPermissionsToRole({ roleId: currentRoleForPermissions.value.id, permissions: checkedKeys });

    ElMessage.success("权限分配成功");
    assignPermissionsDialogVisible.value = false;
    resetAssignPermissionsForm();
  } catch (error) {
    console.error("权限分配失败:", error);
    ElMessage.error("权限分配失败");
  }
};

// 显示角色成员管理对话框
const showRoleMembersDialog = (row: any) => {
  currentRoleForMembers.value = row;
  getRoleMembers();
  roleMembersDialogVisible.value = true;
};

// 获取角色成员列表
const getRoleMembers = async () => {
  try {
    const response = await RoleAPI.getRoleMembers({
      roleId: currentRoleForMembers.value.id,
      pageNum: membersPagination.currentPage,
      pageSize: membersPagination.pageSize,
      keyword: membersSearchKeyword.value
    });
    roleMembersList.value = response.data.list;
    membersPagination.total = response.data.total;
  } catch (error) {
    console.error("获取角色成员列表失败:", error);
    ElMessage.error("获取角色成员列表失败");
  }
};

// 搜索角色成员
const searchMembers = () => {
  membersPagination.currentPage = 1;
  getRoleMembers();
};

// 角色成员分页大小变化
const handleMembersSizeChange = (size: number) => {
  membersPagination.pageSize = size;
  getRoleMembers();
};

// 角色成员分页当前页变化
const handleMembersCurrentChange = (page: number) => {
  membersPagination.currentPage = page;
  getRoleMembers();
};

// 角色成员选择变化
const handleMembersSelectionChange = (selection: any[]) => {
  selectedMembers.value = selection;
};

// 重置角色成员表单
const resetRoleMembersForm = () => {
  currentRoleForMembers.value = null;
  roleMembersList.value = [];
  membersSearchKeyword.value = "";
  membersPagination.currentPage = 1;
  membersPagination.pageSize = 10;
  membersPagination.total = 0;
  selectedMembers.value = [];
};

// 显示添加成员对话框
const showAddMembersDialog = () => {
  getAddMembersList();
  addMembersDialogVisible.value = true;
};

// 获取可添加的成员列表
const getAddMembersList = async () => {
  try {
    const response = await RoleAPI.getAddMembersList({
      roleId: currentRoleForMembers.value.id,
      pageNum: addMembersPagination.currentPage,
      pageSize: addMembersPagination.pageSize,
      keyword: addMembersSearchKeyword.value
    });
    addMembersList.value = response.data.list;
    addMembersPagination.total = response.data.total;
  } catch (error) {
    console.error("获取可添加成员列表失败:", error);
    ElMessage.error("获取可添加成员列表失败");
  }
};

// 搜索可添加的成员
const searchAddMembers = () => {
  addMembersPagination.currentPage = 1;
  getAddMembersList();
};

// 可添加成员分页大小变化
const handleAddMembersSizeChange = (size: number) => {
  addMembersPagination.pageSize = size;
  getAddMembersList();
};

// 可添加成员分页当前页变化
const handleAddMembersCurrentChange = (page: number) => {
  addMembersPagination.currentPage = page;
  getAddMembersList();
};

// 可添加成员选择变化
const handleAddMembersSelectionChange = (selection: any[]) => {
  selectedAddMembers.value = selection;
};

// 重置添加成员表单
const resetAddMembersForm = () => {
  addMembersList.value = [];
  addMembersSearchKeyword.value = "";
  addMembersPagination.currentPage = 1;
  addMembersPagination.pageSize = 10;
  addMembersPagination.total = 0;
  selectedAddMembers.value = [];
};

// 添加成员到角色
const addMembersToRole = async () => {
  try {
    if (selectedAddMembers.value.length === 0) {
      ElMessage.warning("请选择要添加的成员");
      return;
    }

    const userIds = selectedAddMembers.value.map(item => item.id);

    await RoleAPI.addMembersToRole({ roleId: currentRoleForMembers.value.id, userIds: userIds });

    ElMessage.success("成员添加成功");
    addMembersDialogVisible.value = false;
    resetAddMembersForm();
    getRoleMembers();
  } catch (error) {
    console.error("添加成员失败:", error);
    ElMessage.error("添加成员失败");
  }
};

// 从角色中移除成员
const removeMemberFromRole = async (userId: string) => {
  try {
    await ElMessageBox.confirm("确定要将这个成员从角色中移除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    await RoleAPI.removeMemberFromRole({ roleId: currentRoleForMembers.value.id, userId: userId });

    ElMessage.success("成员移除成功");
    getRoleMembers();
  } catch (error: any) {
    if (error.name !== "Error") {
      ElMessage.info("已取消移除");
    } else {
      console.error("移除成员失败:", error);
      ElMessage.error("移除成员失败");
    }
  }
};
</script>

<style scoped>
.role-manage-container {
  padding: 20px;
}

.role-list-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.permission-tree-container {
  max-height: 400px;
  overflow-y: auto;
}

.role-members-container,
.add-members-container {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.members-search {
  margin-bottom: 20px;
}

.role-members-container .el-table,
.add-members-container .el-table {
  flex: 1;
}

.role-members-container .pagination-container,
.add-members-container .pagination-container {
  margin-top: 10px;
}
</style>
