<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerProps.title}菜单`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="drawerProps.row!.menuName" placeholder="请填写菜单名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单路径" prop="path">
        <el-input v-model="drawerProps.row!.path" placeholder="请填写菜单路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="drawerProps.row!.component" placeholder="请填写组件路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="meta.icon">
        <el-input v-model="drawerProps.row!.meta.icon" placeholder="请填写菜单图标" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="sort">
        <el-input v-model.number="drawerProps.row!.sort" placeholder="请填写排序号" clearable type="number"></el-input>
      </el-form-item>
      <el-form-item label="权限标识" prop="perm">
        <el-input v-model="drawerProps.row!.perm" placeholder="请填写权限标识" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-select v-model="drawerProps.row!.type" placeholder="请选择菜单类型" clearable>
          <el-option label="目录" value="0" />
          <el-option label="菜单" value="1" />
          <el-option label="按钮" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentId">
        <el-select v-model="drawerProps.row!.parentId" placeholder="请选择上级菜单" clearable>
          <el-option label="无" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="缓存">
        <el-switch v-model="drawerProps.row!.meta.isKeepAlive" />
      </el-form-item>
      <el-form-item label="固定">
        <el-switch v-model="drawerProps.row!.meta.isAffix" />
      </el-form-item>
      <el-form-item label="隐藏">
        <el-switch v-model="drawerProps.row!.meta.isHide" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="MenuDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Menu } from "@/api/modules/menu";

const rules = reactive({
  menuName: [{ required: true, message: "请填写菜单名称", trigger: "blur" }],
  path: [{ required: true, message: "请填写菜单路径", trigger: "blur" }],
  type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
  sort: [{ required: true, message: "请填写排序号", trigger: "blur" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Menu.ResMenuList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {
    meta: {
      isKeepAlive: false,
      isAffix: false,
      isHide: false
    }
  }
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}菜单成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
