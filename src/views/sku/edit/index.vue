<template>
  <div class="sku-edit-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isNew ? "新增SKU" : "编辑SKU" }}</span>
          <el-button type="primary" plain :icon="ArrowLeft" @click="handleBack"> 返回列表 </el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="skuForm" :rules="rules" label-width="120px">
        <!-- 基本信息 -->
        <el-divider>基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属商品" prop="productName">
              <el-input v-model="skuForm.productName" disabled placeholder="请选择商品" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input v-model="skuForm.skuCode" placeholder="请输入SKU编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SKU名称" prop="skuName">
              <el-input v-model="skuForm.skuName" placeholder="请输入SKU名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch v-model="skuForm.status" active-value="1" inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="skuForm.sort" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="skuForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 规格配置 -->
        <el-divider>规格配置</el-divider>
        <div v-for="(group, groupIndex) in skuForm.specGroups" :key="group.id || `group-${groupIndex}`" class="spec-group">
          <div class="group-header">
            <el-form-item
              :prop="`specGroups.${groupIndex}.name`"
              :rules="[{ required: true, message: '规格组名称不能为空', trigger: 'blur' }]"
            >
              <el-input
                v-model="group.name"
                placeholder="请输入规格组名称（如：颜色、容量）"
                prefix-icon="el-icon-collection-tag"
              />
            </el-form-item>
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              @click="handleDeleteGroup(groupIndex)"
              v-if="skuForm.specGroups.length > 1"
            />
          </div>

          <div class="spec-values">
            <div
              v-for="(value, valueIndex) in group.values"
              :key="value.id || `value-${groupIndex}-${valueIndex}`"
              class="spec-value-item"
            >
              <el-form-item
                :prop="`specGroups.${groupIndex}.values.${valueIndex}.name`"
                :rules="[{ required: true, message: '规格值不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="value.name" placeholder="请输入规格值（如：红色、128G）" style="width: 200px" />
              </el-form-item>
              <el-button
                type="danger"
                plain
                icon="el-icon-close"
                @click="handleDeleteValue(groupIndex, valueIndex)"
                v-if="group.values.length > 1"
              />
            </div>
            <el-button type="primary" plain icon="el-icon-plus" @click="handleAddValue(groupIndex)"> 添加规格值 </el-button>
          </div>
        </div>

        <el-button type="primary" plain icon="el-icon-plus" @click="handleAddGroup" v-if="skuForm.specGroups.length < 4">
          添加规格组
        </el-button>
        <el-alert
          v-if="skuForm.specGroups.length >= 4"
          title="最多支持4个规格组"
          type="warning"
          :closable="false"
          style="margin-top: 10px"
        />

        <!-- SKU组合生成 -->
        <el-divider>SKU组合</el-divider>
        <el-button type="primary" @click="generateCombinations" style="margin-bottom: 20px"> 生成SKU组合 </el-button>

        <!-- 批量操作区 -->
        <div class="batch-operation" v-if="skuForm.skuCombinations.length > 0">
          <el-checkbox v-model="selectAll">全选</el-checkbox>
          <el-button type="primary" plain @click="handleBatchSetPrice">批量设置价格</el-button>
          <el-button type="primary" plain @click="handleBatchSetStock">批量设置库存</el-button>
          <el-button type="primary" plain @click="handleBatchUploadImage">批量更换主图</el-button>
        </div>

        <!-- SKU组合表格 -->
        <el-table v-if="skuForm.skuCombinations.length > 0" :data="skuForm.skuCombinations" border style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="skuCode" label="SKU编码" min-width="150">
            <template #default="scope">
              <el-input v-model="scope.row.skuCode" placeholder="自动生成" />
            </template>
          </el-table-column>
          <el-table-column label="规格组合" min-width="200">
            <template #default="scope">
              <span v-for="(val, key) in scope.row.specValues" :key="key" class="spec-tag"> {{ key }}: {{ val }} </span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="120">
            <template #default="scope">
              <el-input-number v-model="scope.row.price" :min="0" :precision="2" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="120">
            <template #default="scope">
              <el-input-number v-model="scope.row.stock" :min="0" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column prop="image" label="主图" width="120">
            <template #default="scope">
              <el-upload
                class="avatar-uploader"
                action=""
                :auto-upload="false"
                :on-change="file => handleImageUpload(scope.row, file)"
                :show-file-list="false"
              >
                <img v-if="scope.row.image" :src="scope.row.image" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </template>
          </el-table-column>
        </el-table>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
          <el-button @click="handleBack">取消</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 批量设置价格弹窗 -->
    <el-dialog v-model="dialogVisible.price" title="批量设置价格" width="400px">
      <el-form-item label="价格">
        <el-input-number v-model="batchPrice" :min="0" :precision="2" style="width: 100%" />
      </el-form-item>
      <template #footer>
        <el-button @click="dialogVisible.price = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchSetPrice">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量设置库存弹窗 -->
    <el-dialog v-model="dialogVisible.stock" title="批量设置库存" width="400px">
      <el-form-item label="库存">
        <el-input-number v-model="batchStock" :min="0" style="width: 100%" />
      </el-form-item>
      <template #footer>
        <el-button @click="dialogVisible.stock = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchSetStock">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="skuEdit">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowLeft, Plus } from "@element-plus/icons-vue";
import { SkuFull, SpecGroup, SkuCombination } from "@/api/interface/sku";
import { getSkuDetail, saveSku } from "@/api/modules/sku";

const route = useRoute();
const router = useRouter();
const formRef = ref();
const loading = ref(false);

// 判断是否为新增
const isNew = computed(() => route.params.id === "new");

// SKU表单数据
const skuForm = reactive<SkuFull>({
  id: "",
  skuCode: "",
  skuName: "",
  productId: "P001", // 模拟数据
  productName: "iPhone 15 Pro", // 模拟数据
  status: 1,
  sort: 0,
  remark: "",
  price: 0,
  stock: 0,
  specGroups: [
    {
      name: "颜色",
      values: [{ name: "红色" }, { name: "蓝色" }]
    },
    {
      name: "容量",
      values: [{ name: "128G" }, { name: "256G" }]
    }
  ],
  skuCombinations: []
});

// 表单验证规则
const rules = reactive({
  skuCode: [{ required: true, message: "请输入SKU编码", trigger: "blur" }],
  skuName: [{ required: true, message: "请输入SKU名称", trigger: "blur" }]
});

// 批量操作相关
const selectAll = ref(false);
const dialogVisible = reactive({
  price: false,
  stock: false
});
const batchPrice = ref(0);
const batchStock = ref(0);

// 获取SKU详情
const loadSkuDetail = async () => {
  if (isNew.value) return;

  loading.value = true;
  try {
    const res = await getSkuDetail(route.params.id as string);
    if (res.code === "0") {
      Object.assign(skuForm, res.data);
    } else {
      ElMessage.error(res.msg);
      router.push("/sku/list");
    }
  } catch (error) {
    ElMessage.error("获取SKU详情失败");
    router.push("/sku/list");
  } finally {
    loading.value = false;
  }
};

// 生成SKU组合
const generateCombinations = () => {
  // 校验规格组和规格值
  let isValid = true;
  skuForm.specGroups.forEach((group, groupIndex) => {
    if (!group.name.trim()) {
      isValid = false;
      ElMessage.error(`第${groupIndex + 1}个规格组名称不能为空`);
    }
    group.values.forEach((value, valueIndex) => {
      if (!value.name.trim()) {
        isValid = false;
        ElMessage.error(`${group.name}的第${valueIndex + 1}个规格值不能为空`);
      }
    });
  });

  if (!isValid) return;

  // 生成所有规格组合
  const combinations = generateAllCombinations(skuForm.specGroups);

  // 生成SKU组合数据
  skuForm.skuCombinations = combinations.map((specValues, index) => {
    // 生成规格描述
    const specDesc = Object.entries(specValues)
      .map(([, value]) => value)
      .join(" ");

    return {
      id: `temp-${index}`,
      skuCode: `${skuForm.skuCode || "SKU"}${index + 1}`,
      skuName: `${skuForm.skuName || "未命名"} ${specDesc}`,
      productId: skuForm.productId,
      productName: skuForm.productName,
      status: skuForm.status,
      price: skuForm.price,
      stock: skuForm.stock,
      sort: index + 1,
      remark: skuForm.remark,
      specValues
    };
  });

  ElMessage.success(`成功生成${skuForm.skuCombinations.length}个SKU组合`);
};

// 递归生成所有规格组合
const generateAllCombinations = (specGroups: SpecGroup[]): Record<string, string>[] => {
  if (specGroups.length === 0) return [{}];

  const [firstGroup, ...restGroups] = specGroups;
  const restCombinations = generateAllCombinations(restGroups);
  const result: Record<string, string>[] = [];

  firstGroup.values.forEach(value => {
    restCombinations.forEach(combo => {
      result.push({
        ...combo,
        [firstGroup.name]: value.name
      });
    });
  });

  return result;
};

// 添加规格组
const handleAddGroup = () => {
  skuForm.specGroups.push({
    name: "",
    values: [{ name: "" }]
  });
};

// 删除规格组
const handleDeleteGroup = (index: number) => {
  ElMessageBox.confirm("删除规格组将会重新生成SKU组合，确定要删除吗？", "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      skuForm.specGroups.splice(index, 1);
      // 清空现有组合
      skuForm.skuCombinations = [];
      ElMessage.success("规格组删除成功");
    })
    .catch(() => {
      ElMessage.info("操作已取消");
    });
};

// 添加规格值
const handleAddValue = (groupIndex: number) => {
  // 实现添加规格值的逻辑
  const newSpecValue = {
    id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: ""
  };
  skuForm.specGroups[groupIndex].values.push(newSpecValue);
};

// 删除规格值
const handleDeleteValue = (groupIndex: number, valueIndex: number) => {
  skuForm.specGroups[groupIndex].values.splice(valueIndex, 1);
};

// 处理图片上传
const handleImageUpload = (row: SkuCombination, file: any) => {
  // 模拟图片上传，使用本地预览
  const reader = new FileReader();
  reader.onload = e => {
    row.image = e.target?.result as string;
  };
  reader.readAsDataURL(file.raw);
};

// 批量设置价格
const handleBatchSetPrice = () => {
  dialogVisible.price = true;
};

// 确认批量设置价格
const confirmBatchSetPrice = () => {
  // 这里应该获取选中的行，暂时设置全部
  skuForm.skuCombinations.forEach(item => {
    item.price = batchPrice.value;
  });
  dialogVisible.price = false;
  ElMessage.success("价格设置成功");
};

// 批量设置库存
const handleBatchSetStock = () => {
  dialogVisible.stock = true;
};

// 确认批量设置库存
const confirmBatchSetStock = () => {
  // 这里应该获取选中的行，暂时设置全部
  skuForm.skuCombinations.forEach(item => {
    item.stock = batchStock.value;
  });
  dialogVisible.stock = false;
  ElMessage.success("库存设置成功");
};

// 批量上传图片
const handleBatchUploadImage = () => {
  ElMessage.info("图片批量上传功能开发中...");
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate();

  // 校验SKU组合
  if (skuForm.skuCombinations.length === 0) {
    ElMessage.error("请先生成SKU组合");
    return;
  }

  // 校验每个SKU的价格和库存
  const invalidSkus = skuForm.skuCombinations.filter(sku => !sku.price || sku.stock === undefined);
  if (invalidSkus.length > 0) {
    ElMessage.error("请为每个SKU设置价格和库存");
    return;
  }

  loading.value = true;
  try {
    const res = await saveSku();
    if (res.code === "0") {
      ElMessage.success(res.msg);
      router.push("/sku/list");
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error("保存失败");
  } finally {
    loading.value = false;
  }
};

// 返回列表
const handleBack = () => {
  router.push("/sku/list");
};

// 组件挂载
onMounted(() => {
  loadSkuDetail();
});
</script>

<style scoped lang="scss">
.sku-edit-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-group {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.spec-values {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-value-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.spec-tag {
  background-color: #ecf5ff;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 5px;
  font-size: 12px;
}

.batch-operation {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
  width: 80px;
  height: 80px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #c0c4cc;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
}

.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
