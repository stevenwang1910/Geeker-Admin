<template>
  <div class="card content-box">
    <span class="text">商品详情批量管理 🍓🍇🍈🍉</span>

    <!-- 商品列表 -->
    <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="商品ID" width="120" sortable />
      <el-table-column prop="name" label="商品名称" min-width="200" />
      <el-table-column prop="category" label="商品分类" width="150" sortable />
      <el-table-column prop="price" label="价格" width="120" sortable />
      <el-table-column prop="stock" label="库存" width="120" sortable />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
            {{ scope.row.status === "1" ? "上架" : "下架" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" sortable />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleViewDetail(scope.row)"> 查看详情 </el-button>
          <el-button type="warning" size="small" @click="handleEdit(scope.row)"> 编辑 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; text-align: right"
    />

    <!-- 批量操作按钮 -->
    <el-space style="margin-bottom: 20px">
      <el-button type="primary" :icon="Upload" @click="handleBatchImport"> 批量导入 </el-button>
      <el-button type="success" :icon="Download" @click="handleBatchExport" :disabled="selectedRows.length === 0">
        批量导出 ({{ selectedRows.length }})
      </el-button>
      <el-button type="warning" :icon="Refresh" @click="handleRefresh"> 刷新数据 </el-button>
    </el-space>

    <!-- 导入弹窗 -->
    <ImportExcel ref="importRef" />

    <!-- 商品详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="商品详情" width="800px" :destroy-on-close="true">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="商品ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="商品分类">{{ detailData.category }}</el-descriptions-item>
        <el-descriptions-item label="价格">{{ detailData.price }}</el-descriptions-item>
        <el-descriptions-item label="库存">{{ detailData.stock }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.status === '1' ? 'success' : 'danger'">
            {{ detailData.status === "1" ? "上架" : "下架" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="商品描述" :span="2">{{ detailData.description }}</el-descriptions-item>
        <el-descriptions-item label="规格参数" :span="2">
          <el-table :data="detailData.specs" border stripe style="width: 100%">
            <el-table-column prop="name" label="规格名称" width="150" />
            <el-table-column prop="value" label="规格值" />
          </el-table>
        </el-descriptions-item>
        <el-descriptions-item label="商品图片" :span="2">
          <el-image
            v-for="(image, index) in detailData.images"
            :key="index"
            :src="image"
            style="width: 100px; height: 100px; margin-right: 10px"
            fit="cover"
          />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑商品" width="800px" :destroy-on-close="true" @close="handleEditClose">
      <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editRules">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择商品分类">
            <el-option label="食品类" value="食品类" />
            <el-option label="服装类" value="服装类" />
            <el-option label="家具类" value="家具类" />
            <el-option label="日用品类" value="日用品类" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="editForm.price" :min="0" :precision="2" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="editForm.stock" :min="0" placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="editForm.status" :active-value="'1'" :inactive-value="'0'" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" rows="3" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="规格参数" prop="specs">
          <el-table :data="editForm.specs" border stripe style="width: 100%">
            <el-table-column prop="name" label="规格名称" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.name" placeholder="请输入规格名称" />
              </template>
            </el-table-column>
            <el-table-column prop="value" label="规格值">
              <template #default="scope">
                <el-input v-model="scope.row.value" placeholder="请输入规格值" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button type="danger" size="small" @click="handleDeleteSpec(scope.$index)"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="handleAddSpec" style="margin-top: 10px"> 添加规格 </el-button>
        </el-form-item>
        <el-form-item label="商品图片" prop="images">
          <UploadImgs v-model:file-list="editForm.images" height="100px" width="100px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleEditSubmit"> 提交 </el-button>
          <el-button @click="editDialogVisible = false"> 取消 </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="batchMall">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Upload, Download, Refresh } from "@element-plus/icons-vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import { getGoodsList, batchImportGoods, batchExportGoods, updateGoods } from "@/api/modules/goods";

// 表格数据
const tableData = ref<any[]>([]);
// 加载状态
const loading = ref(false);
// 选中的行
const selectedRows = ref<any[]>([]);
// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 导入组件引用
const importRef = ref();
// 详情弹窗可见性
const detailDialogVisible = ref(false);
// 详情数据
const detailData = reactive({
  id: "",
  name: "",
  category: "",
  price: 0,
  stock: 0,
  status: "",
  createTime: "",
  updateTime: "",
  description: "",
  specs: [] as any[],
  images: [] as any[]
});

// 编辑弹窗可见性
const editDialogVisible = ref(false);
// 编辑表单引用
const editFormRef = ref<FormInstance>();
// 编辑表单数据
const editForm = reactive({
  id: "",
  name: "",
  category: "",
  price: 0,
  stock: 0,
  status: "1",
  description: "",
  specs: [] as any[],
  images: [] as any[]
});
// 编辑表单规则
const editRules = reactive({
  name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  category: [{ required: true, message: "请选择商品分类", trigger: "change" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" }],
  stock: [{ required: true, message: "请输入库存", trigger: "blur" }]
});

// 获取商品列表
const getGoodsListData = async () => {
  loading.value = true;
  try {
    const { data } = await getGoodsList({
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    tableData.value = data.list;
    pagination.total = data.total;
  } catch (error) {
    ElMessage.error("获取商品列表失败");
  } finally {
    loading.value = false;
  }
};

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val;
};

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  getGoodsListData();
};

// 处理当前页变化
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  getGoodsListData();
};

// 批量导入
const handleBatchImport = () => {
  let params = {
    title: "商品",
    tempApi: () => batchExportGoods([]), // 使用导出接口作为模板下载
    importApi: batchImportGoods,
    getTableList: getGoodsListData
  };
  importRef.value.acceptParams(params);
};

// 批量导出
const handleBatchExport = async () => {
  try {
    await batchExportGoods(selectedRows.value.map(item => item.id));
    ElMessage.success("批量导出成功");
  } catch (error) {
    ElMessage.error("批量导出失败");
  }
};

// 刷新数据
const handleRefresh = () => {
  getGoodsListData();
};

// 查看详情
const handleViewDetail = (row: any) => {
  detailData.id = row.id;
  detailData.name = row.name;
  detailData.category = row.category;
  detailData.price = row.price;
  detailData.stock = row.stock;
  detailData.status = row.status;
  detailData.createTime = row.createTime;
  detailData.updateTime = row.updateTime;
  detailData.description = row.description;
  detailData.specs = row.specs || [];
  detailData.images = row.images || [];
  detailDialogVisible.value = true;
};

// 编辑商品
const handleEdit = (row: any) => {
  editForm.id = row.id;
  editForm.name = row.name;
  editForm.category = row.category;
  editForm.price = row.price;
  editForm.stock = row.stock;
  editForm.status = row.status;
  editForm.description = row.description;
  editForm.specs = row.specs ? [...row.specs] : [];
  editForm.images = row.images ? [...row.images] : [];
  editDialogVisible.value = true;
};

// 关闭编辑弹窗
const handleEditClose = () => {
  editFormRef.value?.resetFields();
  editForm.specs = [];
  editForm.images = [];
};

// 添加规格
const handleAddSpec = () => {
  editForm.specs.push({ name: "", value: "" });
};

// 删除规格
const handleDeleteSpec = (index: number) => {
  editForm.specs.splice(index, 1);
};

// 提交编辑
const handleEditSubmit = async () => {
  if (!editFormRef.value) return;
  try {
    await editFormRef.value.validate();
    await updateGoods(editForm);
    ElMessage.success("编辑成功");
    editDialogVisible.value = false;
    getGoodsListData();
  } catch (error) {
    ElMessage.error("编辑失败");
  }
};

// 组件挂载时获取商品列表
onMounted(() => {
  getGoodsListData();
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
