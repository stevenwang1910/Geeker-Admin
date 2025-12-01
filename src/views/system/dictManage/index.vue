<template>
  <div class="dict-manage-container">
    <el-card class="dict-manage-card">
      <!-- 字典类型管理 -->
      <div class="dict-type-section">
        <div class="section-header">
          <h3>字典类型管理</h3>
          <el-button type="primary" @click="openAddDictTypeDialog">
            <el-icon><Plus /></el-icon>
            新增字典类型
          </el-button>
        </div>

        <!-- 搜索表单 -->
        <el-form :model="dictTypeSearchForm" inline class="search-form">
          <el-form-item label="字典名称">
            <el-input v-model="dictTypeSearchForm.typeName" placeholder="请输入字典名称" clearable />
          </el-form-item>
          <el-form-item label="字典编码">
            <el-input v-model="dictTypeSearchForm.typeCode" placeholder="请输入字典编码" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="dictTypeSearchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDictTypeList">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="resetDictTypeSearchForm">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 字典类型表格 -->
        <el-table v-loading="dictTypeLoading" :data="dictTypeList" border stripe class="dict-table">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="typeName" label="字典名称" min-width="150" />
          <el-table-column prop="typeCode" label="字典编码" min-width="150" />
          <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
                @change="changeDictTypeStatus(scope.row.id, scope.row.status)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="updateTime" label="更新时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewDictItems(scope.row.id)">
                <el-icon><List /></el-icon>
                字典项
              </el-button>
              <el-button size="small" @click="openEditDictTypeDialog(scope.row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="deleteDictType([scope.row.id])">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="dictTypePagination.pageNum"
            v-model:page-size="dictTypePagination.pageSize"
            :total="dictTypePagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="getDictTypeList"
            @current-change="getDictTypeList"
          />
        </div>
      </div>

      <!-- 字典项管理（默认隐藏） -->
      <div class="dict-item-section" v-if="selectedDictTypeId">
        <div class="section-header">
          <div class="back-button">
            <el-button @click="backToDictType">
              <el-icon><ArrowLeft /></el-icon>
              返回字典类型
            </el-button>
            <span class="dict-type-name">{{ selectedDictTypeName }}</span>
          </div>
          <el-button type="primary" @click="openAddDictItemDialog">
            <el-icon><Plus /></el-icon>
            新增字典项
          </el-button>
        </div>

        <!-- 搜索表单 -->
        <el-form :model="dictItemSearchForm" inline class="search-form">
          <el-form-item label="字典项名称">
            <el-input v-model="dictItemSearchForm.itemName" placeholder="请输入字典项名称" clearable />
          </el-form-item>
          <el-form-item label="字典项值">
            <el-input v-model="dictItemSearchForm.itemValue" placeholder="请输入字典项值" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="dictItemSearchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDictItemList">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="resetDictItemSearchForm">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 字典项树形表格 -->
        <el-table
          v-loading="dictItemLoading"
          :data="dictItemTreeList"
          border
          stripe
          class="dict-table"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="itemName" label="字典项名称" min-width="150" />
          <el-table-column prop="itemValue" label="字典项值" min-width="150" />
          <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
          <el-table-column prop="sort" label="排序" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
                @change="changeDictItemStatus(scope.row.id, scope.row.status)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="updateTime" label="更新时间" width="180" />
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="openAddDictItemDialog(scope.row.id)">
                <el-icon><Plus /></el-icon>
                新增子项
              </el-button>
              <el-button size="small" @click="openEditDictItemDialog(scope.row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="deleteDictItem([scope.row.id])">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="dictItemPagination.pageNum"
            v-model:page-size="dictItemPagination.pageSize"
            :total="dictItemPagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="getDictItemList"
            @current-change="getDictItemList"
          />
        </div>
      </div>
    </el-card>

    <!-- 新增字典类型对话框 -->
    <el-dialog v-model="addDictTypeDialogVisible" title="新增字典类型" width="500px" @close="closeAddDictTypeDialog">
      <el-form ref="addDictTypeFormRef" :model="addDictTypeForm" :rules="dictTypeFormRules" label-width="100px">
        <el-form-item label="字典名称" prop="typeName">
          <el-input v-model="addDictTypeForm.typeName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编码" prop="typeCode">
          <el-input v-model="addDictTypeForm.typeCode" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addDictTypeForm.description" placeholder="请输入描述" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="addDictTypeForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDictTypeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDictType">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑字典类型对话框 -->
    <el-dialog v-model="editDictTypeDialogVisible" title="编辑字典类型" width="500px" @close="closeEditDictTypeDialog">
      <el-form ref="editDictTypeFormRef" :model="editDictTypeForm" :rules="dictTypeFormRules" label-width="100px">
        <el-form-item label="字典名称" prop="typeName">
          <el-input v-model="editDictTypeForm.typeName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编码" prop="typeCode">
          <el-input v-model="editDictTypeForm.typeCode" placeholder="请输入字典编码" disabled />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editDictTypeForm.description" placeholder="请输入描述" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="editDictTypeForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDictTypeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editDictType">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增字典项对话框 -->
    <el-dialog v-model="addDictItemDialogVisible" title="新增字典项" width="500px" @close="closeAddDictItemDialog">
      <el-form ref="addDictItemFormRef" :model="addDictItemForm" :rules="dictItemFormRules" label-width="100px">
        <el-form-item label="字典项名称" prop="itemName">
          <el-input v-model="addDictItemForm.itemName" placeholder="请输入字典项名称" />
        </el-form-item>
        <el-form-item label="字典项值" prop="itemValue">
          <el-input v-model="addDictItemForm.itemValue" placeholder="请输入字典项值" />
        </el-form-item>
        <el-form-item label="父级字典项" prop="parentId" v-if="addDictItemForm.parentId">
          <el-input v-model="addDictItemParentName" placeholder="父级字典项" disabled />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="addDictItemForm.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addDictItemForm.description" placeholder="请输入描述" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="addDictItemForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDictItemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDictItem">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑字典项对话框 -->
    <el-dialog v-model="editDictItemDialogVisible" title="编辑字典项" width="500px" @close="closeEditDictItemDialog">
      <el-form ref="editDictItemFormRef" :model="editDictItemForm" :rules="dictItemFormRules" label-width="100px">
        <el-form-item label="字典项名称" prop="itemName">
          <el-input v-model="editDictItemForm.itemName" placeholder="请输入字典项名称" />
        </el-form-item>
        <el-form-item label="字典项值" prop="itemValue">
          <el-input v-model="editDictItemForm.itemValue" placeholder="请输入字典项值" />
        </el-form-item>
        <el-form-item label="父级字典项" prop="parentId" v-if="editDictItemForm.parentId">
          <el-input v-model="editDictItemParentName" placeholder="父级字典项" disabled />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="editDictItemForm.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editDictItemForm.description" placeholder="请输入描述" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="editDictItemForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDictItemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editDictItem">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search, Refresh, List, Edit, Delete, ArrowLeft } from "@element-plus/icons-vue";
import {
  getDictTypeList as apiGetDictTypeList,
  addDictType as apiAddDictType,
  editDictType as apiEditDictType,
  deleteDictType as apiDeleteDictType,
  changeDictTypeStatus as apiChangeDictTypeStatus,
  getDictItemTreeList as apiGetDictItemTreeList,
  addDictItem as apiAddDictItem,
  editDictItem as apiEditDictItem,
  deleteDictItem as apiDeleteDictItem,
  changeDictItemStatus as apiChangeDictItemStatus
} from "@/api/modules/dict";
import type { Dict } from "@/api/interface/index";

// 字典类型管理相关数据
const dictTypeLoading = ref(false);
const dictTypeList = ref<Dict.ResDictTypeList[]>([]);
const dictTypePagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const dictTypeSearchForm = reactive({
  typeName: "",
  typeCode: "",
  status: undefined,
  createTime: [] as string[]
});

// 字典项管理相关数据
const selectedDictTypeId = ref<string>("");
const selectedDictTypeName = ref<string>("");
const dictItemLoading = ref(false);
const dictItemTreeList = ref<Dict.ResDictItemTree[]>([]);
const dictItemPagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const dictItemSearchForm = reactive({
  itemName: "",
  itemValue: "",
  status: undefined,
  createTime: [] as string[]
});

// 对话框相关数据
const addDictTypeDialogVisible = ref(false);
const editDictTypeDialogVisible = ref(false);
const addDictItemDialogVisible = ref(false);
const editDictItemDialogVisible = ref(false);

// 表单相关数据
const addDictTypeFormRef = ref();
const editDictTypeFormRef = ref();
const addDictItemFormRef = ref();
const editDictItemFormRef = ref();

const addDictTypeForm = reactive({
  typeName: "",
  typeCode: "",
  description: "",
  status: 1
});

const editDictTypeForm = reactive({
  id: "",
  typeName: "",
  typeCode: "",
  description: "",
  status: 1
});

const addDictItemForm = reactive({
  typeId: "",
  itemName: "",
  itemValue: "",
  parentId: "",
  sort: 0,
  description: "",
  status: 1
});

const addDictItemParentName = ref<string>("");

const editDictItemForm = reactive({
  id: "",
  typeId: "",
  itemName: "",
  itemValue: "",
  parentId: "",
  sort: 0,
  description: "",
  status: 1
});

const editDictItemParentName = ref<string>("");

// 表单验证规则
const dictTypeFormRules = reactive({
  typeName: [
    { required: true, message: "请输入字典名称", trigger: "blur" },
    { min: 1, max: 50, message: "字典名称长度在 1 到 50 个字符", trigger: "blur" }
  ],
  typeCode: [
    { required: true, message: "请输入字典编码", trigger: "blur" },
    { min: 1, max: 50, message: "字典编码长度在 1 到 50 个字符", trigger: "blur" },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: "字典编码只能包含字母、数字和下划线，且必须以字母开头", trigger: "blur" }
  ],
  description: [{ max: 200, message: "描述长度不能超过 200 个字符", trigger: "blur" }]
});

const dictItemFormRules = reactive({
  itemName: [
    { required: true, message: "请输入字典项名称", trigger: "blur" },
    { min: 1, max: 50, message: "字典项名称长度在 1 到 50 个字符", trigger: "blur" }
  ],
  itemValue: [
    { required: true, message: "请输入字典项值", trigger: "blur" },
    { min: 1, max: 50, message: "字典项值长度在 1 到 50 个字符", trigger: "blur" }
  ],
  sort: [{ type: "number", message: "排序必须是数字", trigger: "blur" }],
  description: [{ max: 200, message: "描述长度不能超过 200 个字符", trigger: "blur" }]
});

// 生命周期钩子
onMounted(() => {
  getDictTypeList();
});

// 获取字典类型列表
const getDictTypeList = async () => {
  dictTypeLoading.value = true;
  try {
    const params = {
      ...dictTypeSearchForm,
      pageNum: dictTypePagination.pageNum,
      pageSize: dictTypePagination.pageSize
    };
    const response = await apiGetDictTypeList(params);
    if (response.code === "0") {
      dictTypeList.value = response.data.list;
      dictTypePagination.total = response.data.total;
    } else {
      ElMessage.error(response.msg || "获取字典类型列表失败");
    }
  } catch (error) {
    ElMessage.error("获取字典类型列表失败");
    console.error(error);
  } finally {
    dictTypeLoading.value = false;
  }
};

// 重置字典类型搜索表单
const resetDictTypeSearchForm = () => {
  Object.assign(dictTypeSearchForm, {
    typeName: "",
    typeCode: "",
    status: undefined,
    createTime: []
  });
  dictTypePagination.pageNum = 1;
  getDictTypeList();
};

// 打开新增字典类型对话框
const openAddDictTypeDialog = () => {
  addDictTypeDialogVisible.value = true;
  // 重置表单
  setTimeout(() => {
    addDictTypeFormRef.value?.resetFields();
    Object.assign(addDictTypeForm, {
      typeName: "",
      typeCode: "",
      description: "",
      status: 1
    });
  }, 100);
};

// 关闭新增字典类型对话框
const closeAddDictTypeDialog = () => {
  addDictTypeFormRef.value?.resetFields();
  Object.assign(addDictTypeForm, {
    typeName: "",
    typeCode: "",
    description: "",
    status: 1
  });
};

// 新增字典类型
const addDictType = async () => {
  try {
    const valid = await addDictTypeFormRef.value?.validate();
    if (!valid) return;

    const response = await apiAddDictType(addDictTypeForm);
    if (response.code === "0") {
      ElMessage.success("新增字典类型成功");
      addDictTypeDialogVisible.value = false;
      getDictTypeList();
    } else {
      ElMessage.error(response.msg || "新增字典类型失败");
    }
  } catch (error) {
    ElMessage.error("新增字典类型失败");
    console.error(error);
  }
};

// 打开编辑字典类型对话框
const openEditDictTypeDialog = (row: Dict.ResDictTypeList) => {
  editDictTypeDialogVisible.value = true;
  // 填充表单数据
  setTimeout(() => {
    Object.assign(editDictTypeForm, {
      id: row.id,
      typeName: row.typeName,
      typeCode: row.typeCode,
      description: row.description,
      status: row.status
    });
  }, 100);
};

// 关闭编辑字典类型对话框
const closeEditDictTypeDialog = () => {
  editDictTypeFormRef.value?.resetFields();
  Object.assign(editDictTypeForm, {
    id: "",
    typeName: "",
    typeCode: "",
    description: "",
    status: 1
  });
};

// 编辑字典类型
const editDictType = async () => {
  try {
    const valid = await editDictTypeFormRef.value?.validate();
    if (!valid) return;

    const response = await apiEditDictType(editDictTypeForm);
    if (response.code === "0") {
      ElMessage.success("编辑字典类型成功");
      editDictTypeDialogVisible.value = false;
      getDictTypeList();
    } else {
      ElMessage.error(response.msg || "编辑字典类型失败");
    }
  } catch (error) {
    ElMessage.error("编辑字典类型失败");
    console.error(error);
  }
};

// 删除字典类型
const deleteDictType = async (ids: string[]) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的${ids.length}个字典类型吗？删除后该字典类型下的所有字典项也将被删除。`,
      "确认删除",
      {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    );

    const response = await apiDeleteDictType({ id: ids });
    if (response.code === "0") {
      ElMessage.success("删除字典类型成功");
      getDictTypeList();
    } else {
      ElMessage.error(response.msg || "删除字典类型失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除字典类型失败");
      console.error(error);
    }
  }
};

// 切换字典类型状态
const changeDictTypeStatus = async (id: string, status: number) => {
  try {
    const response = await apiChangeDictTypeStatus({ id, status });
    if (response.code === "0") {
      ElMessage.success("切换字典类型状态成功");
      getDictTypeList();
    } else {
      ElMessage.error(response.msg || "切换字典类型状态失败");
      // 状态切换失败，恢复原来的状态
      const row = dictTypeList.value.find(item => item.id === id);
      if (row) {
        row.status = status === 1 ? 0 : 1;
      }
    }
  } catch (error) {
    ElMessage.error("切换字典类型状态失败");
    // 状态切换失败，恢复原来的状态
    const row = dictTypeList.value.find(item => item.id === id);
    if (row) {
      row.status = status === 1 ? 0 : 1;
    }
    console.error(error);
  }
};

// 查看字典项
const viewDictItems = (id: string) => {
  selectedDictTypeId.value = id;
  const row = dictTypeList.value.find(item => item.id === id);
  if (row) {
    selectedDictTypeName.value = row.typeName;
  }
  getDictItemList();
};

// 返回字典类型管理
const backToDictType = () => {
  selectedDictTypeId.value = "";
  selectedDictTypeName.value = "";
  dictItemTreeList.value = [];
  Object.assign(dictItemSearchForm, {
    itemName: "",
    itemValue: "",
    status: undefined,
    createTime: []
  });
  dictItemPagination.pageNum = 1;
};

// 获取字典项列表
const getDictItemList = async () => {
  if (!selectedDictTypeId.value) return;

  dictItemLoading.value = true;
  try {
    const response = await apiGetDictItemTreeList({ typeId: selectedDictTypeId.value });
    if (response.code === "0") {
      dictItemTreeList.value = response.data;
      // 计算总条数
      const countTotal = (data: Dict.ResDictItemTree[]) => {
        let total = 0;
        data.forEach(item => {
          total++;
          if (item.children && item.children.length > 0) {
            total += countTotal(item.children);
          }
        });
        return total;
      };
      dictItemPagination.total = countTotal(response.data);
    } else {
      ElMessage.error(response.msg || "获取字典项列表失败");
    }
  } catch (error) {
    ElMessage.error("获取字典项列表失败");
    console.error(error);
  } finally {
    dictItemLoading.value = false;
  }
};

// 重置字典项搜索表单
const resetDictItemSearchForm = () => {
  Object.assign(dictItemSearchForm, {
    itemName: "",
    itemValue: "",
    status: undefined,
    createTime: []
  });
  dictItemPagination.pageNum = 1;
  getDictItemList();
};

// 打开新增字典项对话框
const openAddDictItemDialog = (parentId: string = "") => {
  addDictItemDialogVisible.value = true;
  // 重置表单
  setTimeout(() => {
    addDictItemFormRef.value?.resetFields();
    Object.assign(addDictItemForm, {
      typeId: selectedDictTypeId.value,
      itemName: "",
      itemValue: "",
      parentId: parentId,
      sort: 0,
      description: "",
      status: 1
    });

    // 获取父级字典项名称
    if (parentId) {
      const findParentName = (data: Dict.ResDictItemTree[], id: string): string => {
        for (const item of data) {
          if (item.id === id) {
            return item.itemName;
          }
          if (item.children && item.children.length > 0) {
            const name = findParentName(item.children, id);
            if (name) return name;
          }
        }
        return "";
      };
      addDictItemParentName.value = findParentName(dictItemTreeList.value, parentId);
    } else {
      addDictItemParentName.value = "";
    }
  }, 100);
};

// 关闭新增字典项对话框
const closeAddDictItemDialog = () => {
  addDictItemFormRef.value?.resetFields();
  Object.assign(addDictItemForm, {
    typeId: "",
    itemName: "",
    itemValue: "",
    parentId: "",
    sort: 0,
    description: "",
    status: 1
  });
  addDictItemParentName.value = "";
};

// 新增字典项
const addDictItem = async () => {
  try {
    const valid = await addDictItemFormRef.value?.validate();
    if (!valid) return;

    const response = await apiAddDictItem(addDictItemForm);
    if (response.code === "0") {
      ElMessage.success("新增字典项成功");
      addDictItemDialogVisible.value = false;
      getDictItemList();
    } else {
      ElMessage.error(response.msg || "新增字典项失败");
    }
  } catch (error) {
    ElMessage.error("新增字典项失败");
    console.error(error);
  }
};

// 打开编辑字典项对话框
const openEditDictItemDialog = (row: Dict.ResDictItemTree) => {
  editDictItemDialogVisible.value = true;
  // 填充表单数据
  setTimeout(() => {
    Object.assign(editDictItemForm, {
      id: row.id,
      typeId: row.typeId,
      itemName: row.itemName,
      itemValue: row.itemValue,
      parentId: row.parentId,
      sort: row.sort,
      description: row.description,
      status: row.status
    });

    // 获取父级字典项名称
    if (row.parentId) {
      const findParentName = (data: Dict.ResDictItemTree[], id: string): string => {
        for (const item of data) {
          if (item.id === id) {
            return item.itemName;
          }
          if (item.children && item.children.length > 0) {
            const name = findParentName(item.children, id);
            if (name) return name;
          }
        }
        return "";
      };
      editDictItemParentName.value = findParentName(dictItemTreeList.value, row.parentId);
    } else {
      editDictItemParentName.value = "";
    }
  }, 100);
};

// 关闭编辑字典项对话框
const closeEditDictItemDialog = () => {
  editDictItemFormRef.value?.resetFields();
  Object.assign(editDictItemForm, {
    id: "",
    typeId: "",
    itemName: "",
    itemValue: "",
    parentId: "",
    sort: 0,
    description: "",
    status: 1
  });
  editDictItemParentName.value = "";
};

// 编辑字典项
const editDictItem = async () => {
  try {
    const valid = await editDictItemFormRef.value?.validate();
    if (!valid) return;

    const response = await apiEditDictItem(editDictItemForm);
    if (response.code === "0") {
      ElMessage.success("编辑字典项成功");
      editDictItemDialogVisible.value = false;
      getDictItemList();
    } else {
      ElMessage.error(response.msg || "编辑字典项失败");
    }
  } catch (error) {
    ElMessage.error("编辑字典项失败");
    console.error(error);
  }
};

// 删除字典项
const deleteDictItem = async (ids: string[]) => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的${ids.length}个字典项吗？删除后该字典项的所有子项也将被删除。`, "确认删除", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });

    const response = await apiDeleteDictItem({ id: ids });
    if (response.code === "0") {
      ElMessage.success("删除字典项成功");
      getDictItemList();
    } else {
      ElMessage.error(response.msg || "删除字典项失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除字典项失败");
      console.error(error);
    }
  }
};

// 切换字典项状态
const changeDictItemStatus = async (id: string, status: number) => {
  try {
    const response = await apiChangeDictItemStatus({ id, status });
    if (response.code === "0") {
      ElMessage.success("切换字典项状态成功");
      getDictItemList();
    } else {
      ElMessage.error(response.msg || "切换字典项状态失败");
      // 状态切换失败，恢复原来的状态
      const findRow = (data: Dict.ResDictItemTree[], id: string): Dict.ResDictItemTree | null => {
        for (const item of data) {
          if (item.id === id) {
            return item;
          }
          if (item.children && item.children.length > 0) {
            const row = findRow(item.children, id);
            if (row) return row;
          }
        }
        return null;
      };
      const row = findRow(dictItemTreeList.value, id);
      if (row) {
        row.status = status === 1 ? 0 : 1;
      }
    }
  } catch (error) {
    ElMessage.error("切换字典项状态失败");
    // 状态切换失败，恢复原来的状态
    const findRow = (data: Dict.ResDictItemTree[], id: string): Dict.ResDictItemTree | null => {
      for (const item of data) {
        if (item.id === id) {
          return item;
        }
        if (item.children && item.children.length > 0) {
          const row = findRow(item.children, id);
          if (row) return row;
        }
      }
      return null;
    };
    const row = findRow(dictItemTreeList.value, id);
    if (row) {
      row.status = status === 1 ? 0 : 1;
    }
    console.error(error);
  }
};
</script>

<style scoped>
.dict-manage-container {
  padding: 20px;
}
.dict-manage-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}
.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
.search-form {
  padding: 15px;
  margin-bottom: 20px;
  background-color: #fafafa;
  border-radius: 8px;
}
.dict-table {
  margin-bottom: 20px;
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.back-button {
  display: flex;
  gap: 10px;
  align-items: center;
}
.dict-type-name {
  font-size: 16px;
  font-weight: 500;
  color: #409eff;
}
</style>
