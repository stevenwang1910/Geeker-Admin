<template>
  <div class="dict-manage-container">
    <!-- 标签页 -->
    <el-tabs v-model:active-name="activeName" @tab-click="handleTabClick">
      <!-- 字典类型标签页 -->
      <el-tab-pane label="字典类型" name="dictType">
        <div class="dict-type-content">
          <!-- 搜索栏 -->
          <el-form :model="dictTypeSearchForm" inline>
            <el-form-item label="字典名称">
              <el-input v-model="dictTypeSearchForm.dictName" placeholder="请输入字典名称" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="字典类型">
              <el-input v-model="dictTypeSearchForm.dictType" placeholder="请输入字典类型" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="dictTypeSearchForm.status" placeholder="请选择状态" style="width: 120px">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="dictTypeSearchForm.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 300px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleDictTypeSearch">查询</el-button>
              <el-button @click="handleDictTypeReset">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 工具栏 -->
          <div class="toolbar">
            <el-button type="primary" @click="handleAddDictType">
              <el-icon><Plus /></el-icon>
              新增
            </el-button>
            <el-button @click="handleExportDictType">
              <el-icon><Download /></el-icon>
              导出
            </el-button>
            <el-button @click="handleImportDictType">
              <el-icon><Upload /></el-icon>
              导入
            </el-button>
          </div>

          <!-- 字典类型表格 -->
          <el-table v-loading="dictTypeLoading" :data="dictTypeList" @selection-change="handleDictTypeSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="dictName" label="字典名称" width="200"></el-table-column>
            <el-table-column prop="dictType" label="字典类型" width="200"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-switch
                  v-model="row.status"
                  active-value="1"
                  inactive-value="0"
                  @change="handleDictTypeStatusChange(row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="handleEditDictType(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDeleteDictType(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            v-model:current-page="dictTypePageInfo.pageNum"
            v-model:page-size="dictTypePageInfo.pageSize"
            :total="dictTypePageInfo.total"
            @size-change="handleDictTypePageSizeChange"
            @current-change="handleDictTypeCurrentPageChange"
          ></el-pagination>
        </div>
      </el-tab-pane>

      <!-- 字典项标签页 -->
      <el-tab-pane label="字典项" name="dictItem">
        <div class="dict-item-content">
          <!-- 字典类型选择 -->
          <el-form :model="dictItemSearchForm" inline style="margin-bottom: 16px">
            <el-form-item label="字典类型">
              <el-select
                v-model="dictItemSearchForm.dictType"
                placeholder="请选择字典类型"
                style="width: 200px"
                @change="handleDictTypeChange"
              >
                <el-option
                  v-for="item in dictTypeOptions"
                  :key="item.dictType"
                  :label="item.dictName"
                  :value="item.dictType"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <!-- 搜索栏 -->
          <el-form :model="dictItemSearchForm" inline>
            <el-form-item label="字典标签">
              <el-input v-model="dictItemSearchForm.dictLabel" placeholder="请输入字典标签" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="字典值">
              <el-input v-model="dictItemSearchForm.dictValue" placeholder="请输入字典值" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="dictItemSearchForm.status" placeholder="请选择状态" style="width: 120px">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleDictItemSearch">查询</el-button>
              <el-button @click="handleDictItemReset">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 工具栏 -->
          <div class="toolbar">
            <el-button type="primary" @click="handleAddDictItem" :disabled="!dictItemSearchForm.dictType">
              <el-icon><Plus /></el-icon>
              新增
            </el-button>
            <el-button @click="handleExportDictItem" :disabled="!dictItemSearchForm.dictType">
              <el-icon><Download /></el-icon>
              导出
            </el-button>
          </div>

          <!-- 字典项树形表格 -->
          <el-table
            v-loading="dictItemLoading"
            :data="dictItemTreeList"
            row-key="dictValue"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @selection-change="handleDictItemSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="dictLabel" label="字典标签" width="200"></el-table-column>
            <el-table-column prop="dictValue" label="字典值" width="200"></el-table-column>
            <el-table-column prop="sort" label="排序" width="100"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-switch
                  v-model="row.status"
                  active-value="1"
                  inactive-value="0"
                  @change="handleDictItemStatusChange(row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="handleEditDictItem(row)">编辑</el-button>
                <el-button size="small" @click="handleAddSubDictItem(row)">新增子项</el-button>
                <el-button size="small" type="danger" @click="handleDeleteDictItem(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            v-model:current-page="dictItemPageInfo.pageNum"
            v-model:page-size="dictItemPageInfo.pageSize"
            :total="dictItemPageInfo.total"
            @size-change="handleDictItemPageSizeChange"
            @current-change="handleDictItemCurrentPageChange"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 字典类型弹窗 -->
    <el-dialog
      v-model:visible="dictTypeDialogVisible"
      :title="dictTypeDialogTitle"
      width="500px"
      @close="handleDictTypeDialogClose"
    >
      <el-form :model="dictTypeForm" :rules="dictTypeRules" ref="dictTypeFormRef" label-width="100px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="dictTypeForm.dictName" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="dictTypeForm.dictType" placeholder="请输入字典类型"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dictTypeForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dictTypeForm.remark" placeholder="请输入备注" type="textarea" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dictTypeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDictTypeSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 字典项弹窗 -->
    <el-dialog
      v-model:visible="dictItemDialogVisible"
      :title="dictItemDialogTitle"
      width="500px"
      @close="handleDictItemDialogClose"
    >
      <el-form :model="dictItemForm" :rules="dictItemRules" ref="dictItemFormRef" label-width="100px">
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="dictItemForm.dictLabel" placeholder="请输入字典标签"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="dictItemForm.dictValue" placeholder="请输入字典值"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="dictItemForm.sort" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dictItemForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dictItemForm.remark" placeholder="请输入备注" type="textarea" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dictItemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDictItemSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导入字典数据弹窗 -->
    <el-dialog v-model:visible="importDictDialogVisible" title="导入字典数据" width="500px" @close="handleImportDictDialogClose">
      <el-upload
        ref="importDictUploadRef"
        :action="importDictUrl"
        :headers="importDictHeaders"
        :file-list="importDictFileList"
        :before-upload="handleBeforeImportDict"
        :on-success="handleImportDictSuccess"
        :on-error="handleImportDictError"
        accept=".xlsx,.xls"
        drag
      >
        <el-icon size="48"><Upload /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">请上传.xlsx或.xls格式的文件</div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDictDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="dictManage">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Download, Upload } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import type { Dict } from "@/api/interface/index";
import {
  getDictTypeList,
  addDictType,
  editDictType,
  deleteDictType,
  changeDictTypeStatus,
  exportDictTypeInfo,
  getDictItemList,
  getDictItemTreeList,
  addDictItem,
  editDictItem,
  deleteDictItem,
  changeDictItemStatus,
  exportDictItemInfo
} from "@/api/modules/dict";

// 标签页激活名称
const activeName = ref<string>("dictType");

// 字典类型相关数据
const dictTypeLoading = ref<boolean>(false);
const dictTypeList = ref<Dict.ResDictTypeList[]>([]);
const dictTypePageInfo = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const dictTypeSearchForm = reactive<Dict.ReqDictTypeParams>({
  pageNum: 1,
  pageSize: 10,
  dictName: "",
  dictType: "",
  status: -1,
  createTime: []
});
const dictTypeSelection = ref<Dict.ResDictTypeList[]>([]);
const dictTypeDialogVisible = ref<boolean>(false);
const dictTypeDialogTitle = ref<string>("新增字典类型");
const dictTypeForm = reactive<Dict.ResDictTypeList>({
  id: "",
  dictName: "",
  dictType: "",
  status: 1,
  remark: "",
  createTime: "",
  updateTime: ""
});
const dictTypeFormRef = ref<FormInstance>();
const dictTypeRules = {
  dictName: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  dictType: [{ required: true, message: "请输入字典类型", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
};

// 字典项相关数据
const dictItemLoading = ref<boolean>(false);
const dictItemList = ref<Dict.ResDictItemList[]>([]);
const dictItemTreeList = ref<Dict.ResDictItemList[]>([]);
const dictItemPageInfo = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const dictItemSearchForm = reactive<Dict.ReqDictItemParams>({
  pageNum: 1,
  pageSize: 10,
  dictType: "",
  dictLabel: "",
  dictValue: "",
  status: -1,
  parentValue: ""
});
const dictTypeOptions = ref<Dict.ResDictTypeList[]>([]);
const dictItemSelection = ref<Dict.ResDictItemList[]>([]);
const dictItemDialogVisible = ref<boolean>(false);
const dictItemDialogTitle = ref<string>("新增字典项");
const dictItemForm = reactive<Dict.ResDictItemList>({
  id: "",
  dictType: "",
  dictLabel: "",
  dictValue: "",
  status: 1,
  remark: "",
  sort: 0,
  parentValue: "",
  children: [],
  createTime: "",
  updateTime: ""
});
const dictItemFormRef = ref<FormInstance>();
const dictItemRules = {
  dictLabel: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
  dictValue: [{ required: true, message: "请输入字典值", trigger: "blur" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
};

// 导入字典数据相关数据
const importDictDialogVisible = ref<boolean>(false);
const importDictUploadRef = ref();
const importDictUrl = ref<string>("/api/dict/import");
const importDictHeaders = ref<Record<string, string>>({
  "Content-Type": "multipart/form-data"
});
const importDictFileList = ref<any[]>([]);

// 标签页切换事件
const handleTabClick = (tab: any) => {
  if (tab.name === "dictItem") {
    // 加载字典类型选项
    loadDictTypeOptions();
  }
};

// 加载字典类型列表
const loadDictTypeList = async () => {
  dictTypeLoading.value = true;
  try {
    const response = await getDictTypeList(dictTypeSearchForm);
    if (response.code === "0") {
      dictTypeList.value = response.data.list;
      dictTypePageInfo.total = response.data.total;
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error) {
    ElMessage.error("加载字典类型列表失败");
  } finally {
    dictTypeLoading.value = false;
  }
};

// 字典类型查询事件
const handleDictTypeSearch = () => {
  dictTypeSearchForm.pageNum = 1;
  loadDictTypeList();
};

// 字典类型重置事件
const handleDictTypeReset = () => {
  dictTypeSearchForm.dictName = "";
  dictTypeSearchForm.dictType = "";
  dictTypeSearchForm.status = -1;
  dictTypeSearchForm.createTime = [];
  dictTypeSearchForm.pageNum = 1;
  loadDictTypeList();
};

// 字典类型分页大小变化事件
const handleDictTypePageSizeChange = (pageSize: number) => {
  dictTypeSearchForm.pageSize = pageSize;
  dictTypePageInfo.pageSize = pageSize;
  loadDictTypeList();
};

// 字典类型当前页变化事件
const handleDictTypeCurrentPageChange = (pageNum: number) => {
  dictTypeSearchForm.pageNum = pageNum;
  loadDictTypeList();
};

// 字典类型选择变化事件
const handleDictTypeSelectionChange = (selection: Dict.ResDictTypeList[]) => {
  dictTypeSelection.value = selection;
};

// 新增字典类型事件
const handleAddDictType = () => {
  dictTypeDialogTitle.value = "新增字典类型";
  dictTypeForm.id = "";
  dictTypeForm.dictName = "";
  dictTypeForm.dictType = "";
  dictTypeForm.status = 1;
  dictTypeForm.remark = "";
  dictTypeDialogVisible.value = true;
};

// 编辑字典类型事件
const handleEditDictType = (row: Dict.ResDictTypeList) => {
  dictTypeDialogTitle.value = "编辑字典类型";
  dictTypeForm.id = row.id;
  dictTypeForm.dictName = row.dictName;
  dictTypeForm.dictType = row.dictType;
  dictTypeForm.status = row.status;
  dictTypeForm.remark = row.remark;
  dictTypeDialogVisible.value = true;
};

// 删除字典类型事件
const handleDeleteDictType = async (id: string) => {
  try {
    await ElMessageBox.confirm("确定要删除该字典类型吗？", "删除确认", {
      type: "warning"
    });
    const response = await deleteDictType({ id: [id] });
    if (response.code === "0") {
      ElMessage.success("删除成功");
      loadDictTypeList();
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

// 字典类型状态变化事件
const handleDictTypeStatusChange = async (row: Dict.ResDictTypeList) => {
  try {
    const response = await changeDictTypeStatus({ id: row.id, status: row.status });
    if (response.code !== "0") {
      ElMessage.error(response.msg);
      // 恢复原来的状态
      row.status = row.status === 1 ? 0 : 1;
    }
  } catch (error) {
    ElMessage.error("状态切换失败");
    // 恢复原来的状态
    row.status = row.status === 1 ? 0 : 1;
  }
};

// 导出字典类型事件
const handleExportDictType = async () => {
  try {
    await exportDictTypeInfo(dictTypeSearchForm);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

// 导入字典类型事件
const handleImportDictType = () => {
  importDictDialogVisible.value = true;
};

// 字典类型弹窗关闭事件
const handleDictTypeDialogClose = () => {
  dictTypeFormRef.value?.resetFields();
};

// 字典类型提交事件
const handleDictTypeSubmit = async () => {
  try {
    await dictTypeFormRef.value?.validate();
    let response;
    if (dictTypeForm.id) {
      // 编辑
      response = await editDictType(dictTypeForm);
    } else {
      // 新增
      response = await addDictType(dictTypeForm);
    }
    if (response.code === "0") {
      ElMessage.success(dictTypeForm.id ? "编辑成功" : "新增成功");
      dictTypeDialogVisible.value = false;
      loadDictTypeList();
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error: any) {
    if (error.name !== "Error") {
      ElMessage.error("表单验证失败");
    }
  }
};

// 加载字典类型选项
const loadDictTypeOptions = async () => {
  try {
    const response = await getDictTypeList({ pageNum: 1, pageSize: 100, dictName: "", dictType: "", status: 1, createTime: [] });
    if (response.code === "0") {
      dictTypeOptions.value = response.data.list;
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error) {
    ElMessage.error("加载字典类型选项失败");
  }
};

// 字典类型变化事件
const handleDictTypeChange = () => {
  if (dictItemSearchForm.dictType) {
    // 加载字典项树形列表
    loadDictItemTreeList();
  } else {
    dictItemTreeList.value = [];
  }
};

// 加载字典项列表
const loadDictItemList = async () => {
  dictItemLoading.value = true;
  try {
    const response = await getDictItemList(dictItemSearchForm);
    if (response.code === "0") {
      dictItemList.value = response.data.list;
      dictItemPageInfo.total = response.data.total;
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error) {
    ElMessage.error("加载字典项列表失败");
  } finally {
    dictItemLoading.value = false;
  }
};

// 加载字典项树形列表
const loadDictItemTreeList = async () => {
  dictItemLoading.value = true;
  try {
    const response = await getDictItemTreeList({ dictType: dictItemSearchForm.dictType });
    if (response.code === "0") {
      dictItemTreeList.value = response.data;
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error) {
    ElMessage.error("加载字典项树形列表失败");
  } finally {
    dictItemLoading.value = false;
  }
};

// 字典项查询事件
const handleDictItemSearch = () => {
  dictItemSearchForm.pageNum = 1;
  loadDictItemList();
};

// 字典项重置事件
const handleDictItemReset = () => {
  dictItemSearchForm.dictLabel = "";
  dictItemSearchForm.dictValue = "";
  dictItemSearchForm.status = -1;
  dictItemSearchForm.parentValue = "";
  dictItemSearchForm.pageNum = 1;
  loadDictItemList();
};

// 字典项分页大小变化事件
const handleDictItemPageSizeChange = (pageSize: number) => {
  dictItemSearchForm.pageSize = pageSize;
  dictItemPageInfo.pageSize = pageSize;
  loadDictItemList();
};

// 字典项当前页变化事件
const handleDictItemCurrentPageChange = (pageNum: number) => {
  dictItemSearchForm.pageNum = pageNum;
  loadDictItemList();
};

// 字典项选择变化事件
const handleDictItemSelectionChange = (selection: Dict.ResDictItemList[]) => {
  dictItemSelection.value = selection;
};

// 新增字典项事件
const handleAddDictItem = () => {
  dictItemDialogTitle.value = "新增字典项";
  dictItemForm.id = "";
  dictItemForm.dictType = dictItemSearchForm.dictType;
  dictItemForm.dictLabel = "";
  dictItemForm.dictValue = "";
  dictItemForm.status = 1;
  dictItemForm.remark = "";
  dictItemForm.sort = 0;
  dictItemForm.parentValue = "";
  dictItemDialogVisible.value = true;
};

// 编辑字典项事件
const handleEditDictItem = (row: Dict.ResDictItemList) => {
  dictItemDialogTitle.value = "编辑字典项";
  dictItemForm.id = row.id;
  dictItemForm.dictType = row.dictType;
  dictItemForm.dictLabel = row.dictLabel;
  dictItemForm.dictValue = row.dictValue;
  dictItemForm.status = row.status;
  dictItemForm.remark = row.remark;
  dictItemForm.sort = row.sort;
  dictItemForm.parentValue = row.parentValue;
  dictItemDialogVisible.value = true;
};

// 新增子字典项事件
const handleAddSubDictItem = (row: Dict.ResDictItemList) => {
  dictItemDialogTitle.value = "新增子字典项";
  dictItemForm.id = "";
  dictItemForm.dictType = row.dictType;
  dictItemForm.dictLabel = "";
  dictItemForm.dictValue = "";
  dictItemForm.status = 1;
  dictItemForm.remark = "";
  dictItemForm.sort = 0;
  dictItemForm.parentValue = row.dictValue;
  dictItemDialogVisible.value = true;
};

// 删除字典项事件
const handleDeleteDictItem = async (id: string) => {
  try {
    await ElMessageBox.confirm("确定要删除该字典项吗？", "删除确认", {
      type: "warning"
    });
    const response = await deleteDictItem({ id: [id] });
    if (response.code === "0") {
      ElMessage.success("删除成功");
      loadDictItemTreeList();
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

// 字典项状态变化事件
const handleDictItemStatusChange = async (row: Dict.ResDictItemList) => {
  try {
    const response = await changeDictItemStatus({ id: row.id, status: row.status });
    if (response.code !== "0") {
      ElMessage.error(response.msg);
      // 恢复原来的状态
      row.status = row.status === 1 ? 0 : 1;
    }
  } catch (error) {
    ElMessage.error("状态切换失败");
    // 恢复原来的状态
    row.status = row.status === 1 ? 0 : 1;
  }
};

// 导出字典项事件
const handleExportDictItem = async () => {
  try {
    await exportDictItemInfo(dictItemSearchForm);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

// 字典项弹窗关闭事件
const handleDictItemDialogClose = () => {
  dictItemFormRef.value?.resetFields();
};

// 字典项提交事件
const handleDictItemSubmit = async () => {
  try {
    await dictItemFormRef.value?.validate();
    let response;
    if (dictItemForm.id) {
      // 编辑
      response = await editDictItem(dictItemForm);
    } else {
      // 新增
      response = await addDictItem(dictItemForm);
    }
    if (response.code === "0") {
      ElMessage.success(dictItemForm.id ? "编辑成功" : "新增成功");
      dictItemDialogVisible.value = false;
      loadDictItemTreeList();
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error: any) {
    if (error.name !== "Error") {
      ElMessage.error("表单验证失败");
    }
  }
};

// 导入字典数据之前的事件
const handleBeforeImportDict = (file: File) => {
  const isExcel =
    file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    ElMessage.error("请上传Excel文件");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("上传文件大小不能超过 2MB");
    return false;
  }
  return true;
};

// 导入字典数据成功事件
const handleImportDictSuccess = (response: any) => {
  if (response.code === "0") {
    ElMessage.success("导入成功");
    importDictDialogVisible.value = false;
    importDictFileList.value = [];
    // 重新加载字典类型列表
    if (activeName.value === "dictType") {
      loadDictTypeList();
    } else {
      // 重新加载字典项树形列表
      loadDictItemTreeList();
    }
  } else {
    ElMessage.error(response.msg);
  }
};

// 导入字典数据失败事件
const handleImportDictError = () => {
  ElMessage.error("导入失败");
};

// 导入字典数据弹窗关闭事件
const handleImportDictDialogClose = () => {
  importDictFileList.value = [];
  importDictUploadRef.value?.clearFiles();
};

// 页面加载时初始化数据
onMounted(() => {
  // 加载字典类型列表
  loadDictTypeList();
});
</script>

<style scoped>
.dict-manage-container {
  padding: 20px;
}

.toolbar {
  margin-bottom: 16px;
}

.toolbar .el-button {
  margin-right: 8px;
}

.el-table {
  margin-bottom: 16px;
}
</style>
