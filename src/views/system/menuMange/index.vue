<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="path"
      :indent="20"
      :columns="columns"
      :data="tableData"
      @selection-change="handleSelectionChange"
      @search="search"
      @reset="reset"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openAddDialog">新增菜单 </el-button>
        <el-button type="danger" :icon="Delete" :disabled="selectedRows.length === 0" @click="batchDeleteMenu"
          >批量删除</el-button
        >
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openEditDialog(scope.row)"> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteMenu(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>

    <!-- 新增/编辑菜单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="resetForm">
      <el-form ref="menuForm" :model="menuFormData" :rules="menuRules" label-width="80px">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="menuFormData.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="menuFormData.path" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menuFormData.icon" placeholder="请输入菜单图标名称" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input-number v-model="menuFormData.sort" :min="1" :max="999" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menuFormData.component" placeholder="请输入组件路径" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref, reactive, onMounted } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { useTable } from "@/hooks/useTable";
import { addMenu, editMenu, deleteMenu as deleteMenuApi, getMenuList } from "@/api/modules/menu";

const proTable = ref();
const menuForm = ref();

// 集成 useTable hook
const { tableData, getTableList, search, reset, handleSizeChange, handleCurrentChange } = useTable(getMenuList, {}, true);

const selectedRows = ref<any[]>([]);

// 页面加载时获取菜单数据
onMounted(() => {
  getTableList();
});

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);

// 表单数据
const menuFormData = reactive({
  title: "",
  path: "",
  icon: "",
  sort: 1,
  component: ""
});

// 表单验证规则
const menuRules = reactive({
  title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  path: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
  icon: [{ required: true, message: "请输入菜单图标", trigger: "blur" }],
  sort: [{ required: true, message: "请输入排序号", trigger: "blur" }]
});

// 表格配置项
const columns: ColumnProps[] = [
  { type: "selection", width: 55 },
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input", placeholder: "请输入菜单名称", width: 200 } },
  { prop: "meta.icon", label: "菜单图标" },
  { prop: "name", label: "菜单 name", search: { el: "input", placeholder: "请输入菜单name", width: 200 } },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input", placeholder: "请输入路径", width: 200 } },
  { prop: "component", label: "组件路径", width: 300 },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 选择行变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
};

// 打开新增对话框
const openAddDialog = () => {
  isEdit.value = false;
  dialogTitle.value = "新增菜单";
  dialogVisible.value = true;
  resetForm();
};

// 打开编辑对话框
const openEditDialog = (row: any) => {
  isEdit.value = true;
  dialogTitle.value = "编辑菜单";
  dialogVisible.value = true;

  // 填充表单数据
  menuFormData.title = row.meta?.title || "";
  menuFormData.path = row.path || "";
  menuFormData.icon = row.meta?.icon || "";
  menuFormData.sort = row.meta?.sort || 1;
  menuFormData.component = row.component || "";
};

// 重置表单
const resetForm = () => {
  if (menuForm.value) {
    menuForm.value.resetFields();
  }

  // 重置表单数据
  menuFormData.title = "";
  menuFormData.path = "";
  menuFormData.icon = "";
  menuFormData.sort = 1;
  menuFormData.component = "";
};

// 提交表单
const submitForm = () => {
  if (menuForm.value) {
    menuForm.value.validate((valid: boolean) => {
      if (valid) {
        // 构造提交数据
        const formData = {
          title: menuFormData.title,
          path: menuFormData.path,
          icon: menuFormData.icon,
          sort: menuFormData.sort,
          component: menuFormData.component
        };

        if (isEdit.value) {
          // 编辑菜单
          editMenu(formData)
            .then(() => {
              ElMessage.success("菜单编辑成功");
              dialogVisible.value = false;
              // 更新菜单列表
              getTableList();
            })
            .catch(() => {
              ElMessage.error("菜单编辑失败");
            });
        } else {
          // 新增菜单
          addMenu(formData)
            .then(() => {
              ElMessage.success("菜单新增成功");
              dialogVisible.value = false;
              // 更新菜单列表
              getTableList();
            })
            .catch(() => {
              ElMessage.error("菜单新增失败");
            });
        }
      }
    });
  }
};

// 删除单个菜单
const deleteMenu = (row: any) => {
  ElMessageBox.confirm(`确定要删除菜单"${row.meta?.title}"吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteMenuApi({ id: [row.path] })
        .then(() => {
          ElMessage.success("菜单删除成功");
          // 更新菜单列表
          getTableList();
        })
        .catch(() => {
          ElMessage.error("菜单删除失败");
        });
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 批量删除菜单
const batchDeleteMenu = () => {
  const menuNames = selectedRows.value.map(row => row.meta?.title).join(", ");

  ElMessageBox.confirm(`确定要删除选中的菜单：${menuNames}吗？`, "批量删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      const menuIds = selectedRows.value.map(row => row.path);
      deleteMenuApi({ id: menuIds })
        .then(() => {
          ElMessage.success("菜单批量删除成功");
          // 更新菜单列表
          getTableList();
        })
        .catch(() => {
          ElMessage.error("菜单批量删除失败");
        });
    })
    .catch(() => {
      ElMessage.info("已取消批量删除");
    });
};
</script>
