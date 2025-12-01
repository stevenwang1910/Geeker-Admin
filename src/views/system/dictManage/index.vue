<template>
  <div class="table-box">
    <ProTable ref="proTable" title="字典类型列表" :columns="columns" :request="getDictTypeList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openAddDialog" v-auth="'dict:add'">新增字典类型</el-button>
        <el-button type="success" :icon="Download" @click="exportDictData" v-auth="'dict:export'">导出字典数据</el-button>
        <el-upload
          :show-file-list="false"
          :on-success="importSuccess"
          accept=".xlsx,.xls"
          action="#"
          :http-request="importDictData"
        >
          <el-button type="warning" :icon="Upload" v-auth="'dict:import'">导入字典数据</el-button>
        </el-upload>
      </template>
      <!-- 字典状态 -->
      <template #status="scope">
        <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="changeStatus(scope.row)" />
      </template>
      <!-- 字典操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openEditDialog(scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Setting" @click="openItemDialog(scope.row)"> 字典项管理 </el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteDictType(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>

    <!-- 新增/编辑字典类型弹窗 -->
    <el-dialog v-model="dialogVisible" title="字典类型" width="500px" @close="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="formData.dictType" placeholder="请输入字典类型（英文大写，如：USER_STATUS）" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formData.status" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 字典项管理弹窗 -->
    <el-dialog v-model="itemDialogVisible" title="字典项管理" width="900px" @close="resetItemForm">
      <div class="mb-4">
        <el-button type="primary" :icon="CirclePlus" @click="openAddItemDialog" v-auth="'dict:item:add'">新增字典项</el-button>
      </div>
      <el-table :data="dictItemList" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" border>
        <el-table-column prop="dictLabel" label="字典标签" width="200" />
        <el-table-column prop="dictValue" label="字典值" width="150" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="changeItemStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" width="200" />
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="scope">
            <el-button type="primary" link :icon="EditPen" @click="openEditItemDialog(scope.row)" v-auth="'dict:item:edit'">
              编辑
            </el-button>
            <el-button type="primary" link :icon="CirclePlus" @click="openAddChildItemDialog(scope.row)" v-auth="'dict:item:add'">
              新增子项
            </el-button>
            <el-button type="danger" link :icon="Delete" @click="deleteDictItem(scope.row)" v-auth="'dict:item:delete'">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑字典项弹窗 -->
      <el-dialog v-model="itemFormVisible" title="字典项" width="500px" @close="resetItemForm">
        <el-form ref="itemFormRef" :model="itemFormData" :rules="itemRules" label-width="100px">
          <el-form-item label="字典标签" prop="dictLabel">
            <el-input v-model="itemFormData.dictLabel" placeholder="请输入字典标签" />
          </el-form-item>
          <el-form-item label="字典值" prop="dictValue">
            <el-input v-model="itemFormData.dictValue" placeholder="请输入字典值" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="itemFormData.sort" :min="0" :max="999" placeholder="请输入排序号" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="itemFormData.status" active-value="1" inactive-value="0" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="itemFormData.remark" type="textarea" placeholder="请输入备注信息" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="itemFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitItemForm">确定</el-button>
        </template>
      </el-dialog>
    </el-dialog>

    <!-- 变更历史弹窗 -->
    <el-dialog v-model="historyDialogVisible" title="字典变更历史" width="1000px">
      <el-table :data="historyList" border stripe>
        <el-table-column prop="operateType" label="操作类型" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.operateType === 'add' ? 'success' : scope.row.operateType === 'edit' ? 'primary' : 'danger'">
              {{ scope.row.operateType === "add" ? "新增" : scope.row.operateType === "edit" ? "编辑" : "删除" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operateContent" label="操作内容" min-width="300" />
        <el-table-column prop="operateUser" label="操作人" width="120" />
        <el-table-column prop="operateTime" label="操作时间" width="200" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
      <el-pagination
        v-model:current-page="historyPage.pageNum"
        v-model:page-size="historyPage.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="100"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleHistoryPageChange"
        @current-change="handleHistoryPageChange"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="dictManage">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Setting, Download, Upload } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import {
  getDictTypeList,
  addDictType,
  editDictType,
  deleteDictType as deleteDictTypeApi,
  changeDictTypeStatus,
  exportDictData,
  importDictData as importDictDataApi,
  getDictItemList,
  addDictItem,
  editDictItem,
  deleteDictItem as deleteDictItemApi,
  changeDictItemStatus,
  getDictHistoryList
} from "@/api/modules/dict";

const proTable = ref();
const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const isEdit = ref(false);

// 字典项相关变量
const itemDialogVisible = ref(false);
const itemFormVisible = ref(false);
const itemFormRef = ref<FormInstance>();
const currentDictId = ref("");
const isItemEdit = ref(false);
const dictItemList = ref<any[]>([]);

// 变更历史相关变量
const historyDialogVisible = ref(false);
const historyList = ref<any[]>([]);
const currentHistoryDictId = ref("");
const historyPage = ref({ pageNum: 1, pageSize: 10 });

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "dictName", label: "字典名称", align: "left", search: { el: "input" } },
  { prop: "dictType", label: "字典类型", search: { el: "input" } },
  { prop: "status", label: "状态", width: 120 },
  { prop: "remark", label: "备注" },
  { prop: "createTime", label: "创建时间", width: 200, search: { el: "datePicker", props: { type: "daterange" } } },
  {
    label: "操作",
    key: "action",
    width: 280,
    fixed: "right",
    align: "center",
    render: (scope: any) => {
      return h("div", {}, [
        h(
          ElButton,
          {
            size: "small",
            type: "info",
            onClick: () => openItemDialog(scope.row),
            directives: [{ name: "auth", value: "dict:item" }]
          },
          "字典项"
        ),
        h(
          ElButton,
          {
            size: "small",
            type: "primary",
            onClick: () => openEditDialog(scope.row),
            style: { marginLeft: "8px" },
            directives: [{ name: "auth", value: "dict:edit" }]
          },
          "编辑"
        ),
        h(
          ElButton,
          {
            size: "small",
            type: "success",
            onClick: () => changeStatus(scope.row),
            style: { marginLeft: "8px" },
            directives: [{ name: "auth", value: "dict:status" }]
          },
          scope.row.status === 1 ? "禁用" : "启用"
        ),
        h(
          ElButton,
          {
            size: "small",
            type: "danger",
            onClick: () => deleteDictType(scope.row),
            style: { marginLeft: "8px" },
            directives: [{ name: "auth", value: "dict:delete" }]
          },
          "删除"
        ),
        h(
          ElButton,
          {
            size: "small",
            type: "default",
            onClick: () => openHistoryDialog(scope.row),
            style: { marginLeft: "8px" },
            directives: [{ name: "auth", value: "dict:history" }]
          },
          "历史"
        )
      ]);
    }
  }
];

// 表单数据
const formData = reactive({
  id: "",
  dictName: "",
  dictType: "",
  status: 1,
  remark: ""
});

// 表单校验规则
const rules: FormRules = {
  dictName: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  dictType: [{ required: true, message: "请输入字典类型", trigger: "blur" }]
};

// 字典项表单数据
const itemFormData = reactive({
  id: "",
  dictId: "",
  dictLabel: "",
  dictValue: "",
  status: 1,
  sort: 0,
  parentId: "0",
  remark: ""
});

// 字典项表单校验规则
const itemRules: FormRules = {
  dictLabel: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
  dictValue: [{ required: true, message: "请输入字典值", trigger: "blur" }]
};

// 打开新增弹窗
const openAddDialog = () => {
  isEdit.value = false;
  dialogVisible.value = true;
};

// 打开编辑弹窗
const openEditDialog = (row: any) => {
  isEdit.value = true;
  dialogVisible.value = true;
  Object.assign(formData, row);
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  Object.assign(formData, { id: "", dictName: "", dictType: "", status: 1, remark: "" });
};

// 提交表单
const submitForm = () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      try {
        if (isEdit.value) {
          await editDictType(formData);
          ElMessage.success("编辑成功");
        } else {
          await addDictType(formData);
          ElMessage.success("新增成功");
        }
        dialogVisible.value = false;
        proTable.value?.getTableData();
      } catch (error) {
        ElMessage.error("操作失败");
      }
    }
  });
};

// 切换状态
const changeStatus = async (row: any) => {
  try {
    await changeDictTypeStatus({ id: row.id, status: row.status });
    ElMessage.success("状态切换成功");
  } catch (error) {
    row.status = row.status === 1 ? 0 : 1;
    ElMessage.error("状态切换失败");
  }
};

// 删除字典类型
const deleteDictType = (row: any) => {
  ElMessageBox.confirm("确定要删除该字典类型吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteDictTypeApi(row.id);
    ElMessage.success("删除成功");
    proTable.value?.getTableData();
  });
};

// 打开字典项管理弹窗
const openItemDialog = (row: any) => {
  currentDictId.value = row.id;
  itemDialogVisible.value = true;
  loadDictItemList();
};

// 加载字典项列表
const loadDictItemList = async () => {
  const res = await getDictItemList({ dictId: currentDictId.value });
  dictItemList.value = res.data.list;
};

// 打开新增字典项弹窗
const openAddItemDialog = (parentId = "0") => {
  isItemEdit.value = false;
  Object.assign(itemFormData, {
    id: "",
    dictId: currentDictId.value,
    parentId,
    dictLabel: "",
    dictValue: "",
    status: 1,
    sort: 0,
    remark: ""
  });
  itemFormVisible.value = true;
};

// 打开编辑字典项弹窗
const openEditItemDialog = (row: any) => {
  isItemEdit.value = true;
  Object.assign(itemFormData, { ...row });
  itemFormVisible.value = true;
};

// 保存字典项
const submitItemForm = async () => {
  await itemFormRef.value?.validate();
  if (isItemEdit.value) {
    await editDictItem(itemFormData);
    ElMessage.success("编辑成功");
  } else {
    await addDictItem(itemFormData);
    ElMessage.success("新增成功");
  }
  itemFormVisible.value = false;
  loadDictItemList();
};

// 删除字典项
const deleteDictItem = (row: any) => {
  ElMessageBox.confirm("确定要删除该字典项吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteDictItemApi(row.id);
    ElMessage.success("删除成功");
    loadDictItemList();
  });
};

// 修改字典项状态
const changeItemStatus = async (row: any) => {
  try {
    await changeDictItemStatus({ id: row.id, status: row.status });
    ElMessage.success("状态修改成功");
  } catch (error) {
    row.status = row.status === 1 ? 0 : 1;
    ElMessage.error("状态修改失败");
  }
};

// 打开变更历史弹窗
const openHistoryDialog = (row: any) => {
  currentHistoryDictId.value = row.id;
  historyDialogVisible.value = true;
  loadHistoryList();
};

// 加载变更历史列表
const loadHistoryList = async () => {
  const res = await getDictHistoryList({ ...historyPage.value, dictId: currentHistoryDictId.value });
  historyList.value = res.data.list;
};

// 分页变更
const handleHistoryPageChange = (page: number, pageSize: number) => {
  historyPage.value = { pageNum: page, pageSize };
  loadHistoryList();
};

// 导出字典数据
const exportDictData = async () => {
  try {
    await exportDictData({ pageNum: 1, pageSize: 100 });
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

// 导入字典数据
const importDictData = async (options: any) => {
  try {
    const formData = new FormData();
    formData.append("file", options.file);
    await importDictDataApi(formData);
    ElMessage.success("导入成功");
    proTable.value?.getTableData();
  } catch (error) {
    ElMessage.error("导入失败");
  }
};

// 导入成功回调
const importSuccess = () => {
  ElMessage.success("导入成功");
};
</script>
