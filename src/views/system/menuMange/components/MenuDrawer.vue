<template>
  <el-drawer
    :title="drawerProps.title"
    :visible.sync="drawerVisible"
    size="450px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="ruleFormRef" :model="drawerProps.row" :rules="rules" label-width="100px">
      <el-form-item label="菜单名称" prop="meta.title">
        <el-input v-model="drawerProps.row.meta.title" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="菜单路径" prop="path">
        <el-input v-model="drawerProps.row.path" placeholder="请输入菜单路径" />
      </el-form-item>
      <el-form-item label="菜单name" prop="name">
        <el-input v-model="drawerProps.row.name" placeholder="请输入菜单name" />
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="drawerProps.row.component" placeholder="请输入组件路径" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="meta.icon">
        <SelectIcon v-model="drawerProps.row.meta.icon" />
      </el-form-item>
      <el-form-item label="排序号" prop="meta.sort">
        <el-input-number v-model="drawerProps.row.meta.sort" :min="0" :max="999" placeholder="请输入排序号" />
      </el-form-item>
      <el-form-item label="是否显示" prop="meta.visible">
        <el-switch v-model="drawerProps.row.meta.visible" active-value="true" inactive-value="false" />
      </el-form-item>
      <el-form-item label="是否缓存" prop="meta.isKeepAlive">
        <el-switch v-model="drawerProps.row.meta.isKeepAlive" active-value="true" inactive-value="false" />
      </el-form-item>
      <el-form-item label="是否固定" prop="meta.isAffix">
        <el-switch v-model="drawerProps.row.meta.isAffix" active-value="true" inactive-value="false" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="MenuDrawer">
import { ref, reactive } from "vue";
import { FormInstance, ElMessage } from "element-plus";
import SelectIcon from "@/components/SelectIcon/index.vue";
import { addMenu, editMenu } from "@/api/modules/menu";
import { useRouter } from "vue-router";

const router = useRouter();
const drawerVisible = ref(false);
const ruleFormRef = ref<FormInstance>();

interface DrawerProps {
  title: string;
  row: any;
}

const drawerProps = reactive<DrawerProps>({
  title: "",
  row: {
    meta: {
      title: "",
      icon: "",
      sort: 0,
      visible: true,
      isKeepAlive: false,
      isAffix: false
    },
    path: "",
    name: "",
    component: "",
    children: []
  }
});

// 表单验证规则
const rules = {
  "meta.title": [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  "path": [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
  "name": [{ required: true, message: "请输入菜单name", trigger: "blur" }],
  "component": [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  "meta.icon": [{ required: true, message: "请选择菜单图标", trigger: "change" }],
  "meta.sort": [{ required: true, message: "请输入排序号", trigger: "blur" }]
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.title = params.title;
  // 深拷贝数据，防止修改原数据
  drawerProps.row = JSON.parse(JSON.stringify(params.row));
  // 初始化默认值
  drawerProps.row.meta = drawerProps.row.meta || {
    title: "",
    icon: "",
    sort: 0,
    visible: true,
    isKeepAlive: false,
    isAffix: false
  };
  drawerProps.row.path = drawerProps.row.path || "";
  drawerProps.row.name = drawerProps.row.name || "";
  drawerProps.row.component = drawerProps.row.component || "";
  drawerProps.row.children = drawerProps.row.children || [];
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return;
    try {
      const api = drawerProps.title === "新增" ? addMenu : editMenu;
      await api(drawerProps.row);
      ElMessage.success(`${drawerProps.title}菜单成功！`);
      // 刷新页面
      router.go(0);
    } catch (error) {
      console.log(error);
    }
  });
};

// 关闭抽屉
const handleClose = () => {
  drawerVisible.value = false;
  // 重置表单
  ruleFormRef.value!.resetFields();
};

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}
</style>