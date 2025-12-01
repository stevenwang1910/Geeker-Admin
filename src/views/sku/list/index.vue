<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="SKU列表"
      row-key="id"
      :columns="columns"
      :data-source="getSkuList"
      :params="reqParams"
      :row-selection="{}"
      :pagination="{ pageSizes: [10, 20, 50] }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增SKU</el-button>
      </template>

      <!-- 状态列 -->
      <template #status="scope">
        <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="handleStatusChange(scope.row)" />
      </template>

      <!-- 操作列 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="skuList">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import { getSkuList, deleteSku as deleteSkuApi, changeSkuStatus as changeSkuStatusApi } from "@/api/modules/sku";
import { SkuBase } from "@/api/interface/sku";

const router = useRouter();
const proTable = ref<ProTableInstance>();

// 请求参数
const reqParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keyword: "",
  skuCode: "",
  status: undefined
});

// 表格配置项
const columns = ref<ColumnProps<SkuBase>[]>([
  { type: "selection", width: 80 },
  { type: "index", label: "#", width: 80 },
  {
    prop: "skuCode",
    label: "SKU编码",
    width: 180,
    search: { el: "input" }
  },
  {
    prop: "skuName",
    label: "SKU名称",
    minWidth: 200,
    search: { el: "input" }
  },
  {
    prop: "productName",
    label: "所属商品",
    minWidth: 180
  },
  {
    prop: "status",
    label: "状态",
    width: 120,
    search: { el: "select" },
    enum: [
      { label: "全部", value: undefined },
      { label: "启用", value: 1 },
      { label: "停用", value: 0 }
    ]
  },
  {
    prop: "price",
    label: "价格",
    width: 120,
    formatter: (row: SkuBase) => `¥${row.price.toFixed(2)}`
  },
  {
    prop: "stock",
    label: "库存",
    width: 100
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 180,
    sortable: true
  },
  {
    prop: "operation",
    label: "操作",
    width: 200,
    fixed: "right"
  }
]);

// 新增SKU
const handleAdd = () => {
  router.push("/sku/edit/new");
};

// 编辑SKU
const handleEdit = (row: SkuBase) => {
  router.push(`/sku/edit/${row.id}`);
};

// 删除SKU
const handleDelete = async (row: SkuBase) => {
  try {
    await ElMessageBox.confirm(`确定要删除SKU「${row.skuName}」吗？`, "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    const res = await deleteSkuApi();
    if (res.code === "0") {
      ElMessage.success(res.msg);
      proTable.value?.getTableList();
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    // 用户取消删除
  }
};

// 切换状态
const handleStatusChange = async (row: SkuBase) => {
  try {
    const res = await changeSkuStatusApi();
    if (res.code === "0") {
      ElMessage.success(res.msg);
    } else {
      ElMessage.error(res.msg);
      // 恢复原状态
      row.status = row.status === 1 ? 0 : 1;
    }
  } catch (error) {
    // 恢复原状态
    row.status = row.status === 1 ? 0 : 1;
    ElMessage.error("操作失败");
  }
};

// 组件挂载时的操作
onMounted(() => {
  // 可以在这里添加一些初始化逻辑
});
</script>

<style scoped lang="scss">
.table-box {
  padding: 20px;
  height: 100%;
}
</style>
