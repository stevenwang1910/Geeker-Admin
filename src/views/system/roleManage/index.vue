<template>
  <div class="table-box">
    <ProTable ref="proTable" title="角色列表" row-key="id" :columns="columns" :data="roleData" :pagination="{ pageSize: 10 }">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="handleAddRole"> 新增角色 </el-button>
      </template>
      <!-- 角色状态 -->
      <template #status="scope">
        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)" />
      </template>
      <!-- 角色操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="handleEditRole(scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Key" @click="handleAssignPermission(scope.row)"> 分配权限 </el-button>
        <el-button type="primary" link :icon="User" @click="handleManageMembers(scope.row)"> 成员管理 </el-button>
        <el-button type="danger" link :icon="Delete" @click="handleDeleteRole(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="formData.description" placeholder="请输入角色描述" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog v-model="permissionDialogVisible" title="分配权限" width="600px" @close="handlePermissionDialogClose">
      <div class="permission-tree">
        <el-tree
          ref="permissionTreeRef"
          :data="permissionData"
          show-checkbox
          node-key="path"
          :props="{ label: 'meta.title', children: 'children' }"
          default-expand-all
        />
      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 成员管理对话框 -->
    <el-dialog v-model="membersDialogVisible" title="成员管理" width="700px" @close="handleMembersDialogClose">
      <div class="members-container">
        <div class="available-members">
          <h4>可选成员</h4>
          <el-input v-model="memberSearch" placeholder="搜索成员" style="margin-bottom: 10px" />
          <el-select
            v-model="selectedAvailableMembers"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请选择成员"
            :remote-method="remoteMethod"
            style="width: 100%; height: 200px"
          >
            <el-option v-for="member in availableMembers" :key="member.id" :label="member.name" :value="member.id" />
          </el-select>
        </div>
        <div class="member-buttons">
          <el-button type="primary" @click="handleAddMembers">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-button type="primary" @click="handleRemoveMembers">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
        </div>
        <div class="selected-members">
          <h4>已选成员</h4>
          <el-select v-model="selectedMembers" multiple filterable placeholder="已选成员" style="width: 100%; height: 200px">
            <el-option v-for="member in roleMembers" :key="member.id" :label="member.name" :value="member.id" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <el-button @click="membersDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleMembersSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="roleManage">
import { ref, reactive, onMounted, watch } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Key, User, ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import roleList from "@/assets/json/roleList.json";
import authMenuList from "@/assets/json/authMenuList.json";
import ProTable from "@/components/ProTable/index.vue";
import { ElMessage } from "element-plus";

const proTable = ref();
const formRef = ref();
const permissionTreeRef = ref();

// 角色数据
const roleData = ref(roleList.data);
// 权限数据
const permissionData = ref(authMenuList.data);
// 可选成员数据
const availableMembers = ref([
  { id: 1, name: "张三", email: "zhangsan@example.com" },
  { id: 2, name: "李四", email: "lisi@example.com" },
  { id: 3, name: "王五", email: "wangwu@example.com" },
  { id: 4, name: "赵六", email: "zhaoliu@example.com" },
  { id: 5, name: "孙七", email: "sunqi@example.com" }
]);
// 角色成员数据
const roleMembers = ref([]);

// 对话框状态
const dialogVisible = ref(false);
const permissionDialogVisible = ref(false);
const membersDialogVisible = ref(false);
// 对话框标题
const dialogTitle = ref("");
// 表单数据
const formData = reactive({
  id: 0,
  name: "",
  code: "",
  description: ""
});
// 表单验证规则
const formRules = reactive({
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, max: 20, message: "角色名称长度在 2 到 20 个字符", trigger: "blur" }
  ],
  code: [
    { required: true, message: "请输入角色编码", trigger: "blur" },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: "角色编码只能包含字母、数字和下划线，且必须以字母开头", trigger: "blur" }
  ],
  description: [{ max: 100, message: "角色描述长度不能超过 100 个字符", trigger: "blur" }]
});

// 选中的成员
const selectedAvailableMembers = ref([]);
const selectedMembers = ref([]);
// 成员搜索关键词
const memberSearch = ref("");

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "name", label: "角色名称", align: "left", search: { el: "input", order: 1 }, isShow: true },
  { prop: "code", label: "角色编码", search: { el: "input", order: 2 }, isShow: true },
  { prop: "description", label: "角色描述", width: 200, isShow: true },
  { prop: "status", label: "角色状态", width: 120, isShow: true },
  { prop: "createTime", label: "创建时间", width: 200, isShow: true },
  { prop: "updateTime", label: "更新时间", width: 200, isShow: true },
  { prop: "operation", label: "操作", width: 350, fixed: "right", isShow: true }
];

// 新增角色
const handleAddRole = () => {
  dialogTitle.value = "新增角色";
  // 重置表单数据
  Object.assign(formData, {
    id: 0,
    name: "",
    code: "",
    description: ""
  });
  // 重置表单验证
  if (formRef.value) {
    formRef.value.resetFields();
  }
  dialogVisible.value = true;
};

// 编辑角色
const handleEditRole = (row: any) => {
  dialogTitle.value = "编辑角色";
  // 填充表单数据
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description
  });
  // 重置表单验证
  if (formRef.value) {
    formRef.value.clearValidate();
  }
  dialogVisible.value = true;
};

// 分配权限
const handleAssignPermission = (row: any) => {
  permissionDialogVisible.value = true;
  // 未来将根据 row.id 获取角色已分配的权限，并设置默认选中
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const roleId = row.id;
  // 暂时模拟选中所有权限
  setTimeout(() => {
    if (permissionTreeRef.value) {
      const allKeys = permissionTreeRef.value.getCheckedKeys();
      permissionTreeRef.value.setCheckedKeys(allKeys);
    }
  }, 0);
};

// 管理成员
const handleManageMembers = (row: any) => {
  membersDialogVisible.value = true;
  // 未来将根据 row.id 获取角色已分配的成员
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const roleId = row.id;
  // 暂时模拟一些成员
  roleMembers.value = [
    { id: 1, name: "张三", email: "zhangsan@example.com" },
    { id: 2, name: "李四", email: "lisi@example.com" }
  ];
  // 设置已选成员
  selectedMembers.value = roleMembers.value.map(member => member.id);
};

// 删除角色
const handleDeleteRole = (row: any) => {
  // 模拟删除确认
  ElMessage.confirm("确定要删除角色 " + row.name + " 吗？", "删除角色", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      // 模拟删除操作
      const index = roleData.value.findIndex(item => item.id === row.id);
      if (index !== -1) {
        roleData.value.splice(index, 1);
        ElMessage.success("角色删除成功");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除角色");
    });
};

// 角色状态变更
const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? "启用" : "禁用";
  ElMessage.success("角色 " + row.name + " 已" + statusText);
};

// 关闭对话框
const handleDialogClose = () => {
  // 重置表单数据
  Object.assign(formData, {
    id: 0,
    name: "",
    code: "",
    description: ""
  });
  // 重置表单验证
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 关闭分配权限对话框
const handlePermissionDialogClose = () => {
  // 重置权限树选中状态
  if (permissionTreeRef.value) {
    permissionTreeRef.value.setCheckedKeys([]);
  }
};

// 关闭成员管理对话框
const handleMembersDialogClose = () => {
  // 重置成员选择
  selectedAvailableMembers.value = [];
  selectedMembers.value = [];
  memberSearch.value = "";
  roleMembers.value = [];
};

// 表单提交
const handleFormSubmit = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 模拟表单提交
      if (formData.id === 0) {
        // 新增角色
        const newId = Math.max(...roleData.value.map(item => item.id)) + 1;
        const newRole = {
          ...formData,
          id: newId,
          status: 1,
          createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
          updateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
        };
        roleData.value.push(newRole);
        ElMessage.success("角色新增成功");
      } else {
        // 编辑角色
        const index = roleData.value.findIndex(item => item.id === formData.id);
        if (index !== -1) {
          roleData.value[index] = {
            ...roleData.value[index],
            ...formData,
            updateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
          };
          ElMessage.success("角色编辑成功");
        }
      }
      dialogVisible.value = false;
    } else {
      ElMessage.error("表单验证失败，请检查输入内容");
      return false;
    }
  });
};

// 权限提交
const handlePermissionSubmit = () => {
  // 模拟权限提交
  if (permissionTreeRef.value) {
    const checkedKeys = permissionTreeRef.value.getCheckedKeys();
    const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys();
    const allKeys = [...checkedKeys, ...halfCheckedKeys];
    // 这里可以将权限数据提交到后端
    console.log("已分配权限:", allKeys);
  }
  permissionDialogVisible.value = false;
  ElMessage.success("权限分配成功");
};

// 添加成员
const handleAddMembers = () => {
  // 将选中的可选成员添加到已选成员中
  selectedAvailableMembers.value.forEach(memberId => {
    if (!selectedMembers.value.includes(memberId)) {
      selectedMembers.value.push(memberId);
      const member = availableMembers.value.find(item => item.id === memberId);
      if (member) {
        roleMembers.value.push(member);
      }
    }
  });
  // 清空选中的可选成员
  selectedAvailableMembers.value = [];
};

// 移除成员
const handleRemoveMembers = () => {
  // 将选中的已选成员移除
  selectedMembers.value.forEach(memberId => {
    const index = roleMembers.value.findIndex(item => item.id === memberId);
    if (index !== -1) {
      roleMembers.value.splice(index, 1);
    }
  });
  // 清空选中的已选成员
  selectedMembers.value = [];
};

// 成员提交
const handleMembersSubmit = () => {
  // 模拟成员提交
  console.log("已分配成员:", roleMembers.value);
  membersDialogVisible.value = false;
  ElMessage.success("成员管理成功");
};

// 远程搜索成员
const remoteMethod = (query: string) => {
  if (query !== "") {
    // 模拟远程搜索
    setTimeout(() => {
      // 这里可以根据搜索关键词从后端获取成员数据
      console.log("搜索成员:", query);
    }, 200);
  } else {
    // 清空搜索结果
  }
};

// 监听成员搜索关键词变化
watch(memberSearch, newValue => {
  // 这里可以根据搜索关键词过滤可选成员
  console.log("搜索成员:", newValue);
});

// 页面加载时初始化数据
onMounted(() => {
  console.log("角色管理页面加载完成");
});
</script>

<style scoped lang="scss">
@import "@/styles/common.scss";

.permission-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.members-container {
  display: flex;
  gap: 20px;
  align-items: stretch;

  .available-members,
  .selected-members {
    flex: 1;
    display: flex;
    flex-direction: column;

    h4 {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .member-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    button {
      width: 40px;
      height: 40px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .members-container {
    flex-direction: column;

    .member-buttons {
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
