<template>
  <div class="sku-edit-container">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <!-- 基本信息 -->
      <el-card title="基本信息" class="card-wrapper">
        <el-form-item label="商品名称" prop="product_name">
          <el-input v-model="formData.product_name" placeholder="请选择商品" readonly />
        </el-form-item>
        <el-form-item label="SKU编码" prop="sku_code">
          <el-input v-model="formData.sku_code" placeholder="请输入SKU编码" />
        </el-form-item>
        <el-form-item label="SKU名称" prop="sku_name">
          <el-input v-model="formData.sku_name" placeholder="请输入SKU名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" :rows="3" />
        </el-form-item>
      </el-card>

      <!-- 规格配置 -->
      <el-card title="规格配置" class="card-wrapper">
        <div v-for="(group, groupIndex) in formData.spec_groups" :key="groupIndex" class="spec-group-item">
          <div class="spec-group-header">
            <el-form-item
              :label="`规格组 ${groupIndex + 1}`"
              :prop="`spec_groups.${groupIndex}.group_name`"
              :rules="[{ required: true, message: '规格组名称不能为空', trigger: 'blur' }]"
            >
              <el-input v-model="group.group_name" placeholder="请输入规格组名称" />
            </el-form-item>
            <el-button
              type="danger"
              size="small"
              @click="deleteSpecGroup(groupIndex)"
              :disabled="formData.spec_groups.length === 1"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
          <div class="spec-values-container">
            <div v-for="(value, valueIndex) in group.spec_values" :key="valueIndex" class="spec-value-item">
              <el-form-item
                :prop="`spec_groups.${groupIndex}.spec_values.${valueIndex}.value_name`"
                :rules="[{ required: true, message: '规格值不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="value.value_name" placeholder="请输入规格值" />
              </el-form-item>
              <el-button type="danger" size="small" @click="deleteSpecValue(groupIndex, valueIndex)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button type="primary" size="small" @click="addSpecValue(groupIndex)">
              <el-icon><Plus /></el-icon>
              添加规格值
            </el-button>
          </div>
        </div>
        <el-button type="primary" @click="addSpecGroup">
          <el-icon><Plus /></el-icon>
          添加规格组
        </el-button>
      </el-card>

      <!-- SKU组合 -->
      <el-card title="SKU组合" class="card-wrapper" v-if="formData.sku_combinations.length > 0">
        <div class="batch-operation-bar">
          <el-button type="primary" size="small" @click="showBatchPriceModal = true">
            <el-icon><Money /></el-icon>
            批量设置价格
          </el-button>
          <el-button type="primary" size="small" @click="showBatchStockModal = true">
            <el-icon><Goods /></el-icon>
            批量设置库存
          </el-button>
          <el-button type="primary" size="small" @click="showBatchImageModal = true">
            <el-icon><Picture /></el-icon>
            批量更换主图
          </el-button>
        </div>
        <el-table v-model:selection="selectedCombinations" :data="formData.sku_combinations" border stripe>
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="(group, groupIndex) in formData.spec_groups"
            :key="groupIndex"
            :label="group.group_name"
            width="150"
          >
            <template #default="{ row }">
              {{ row.spec_values[group.group_name] }}
            </template>
          </el-table-column>
          <el-table-column label="主图" width="100">
            <template #default="{ row }">
              <el-image
                v-if="row.main_image"
                :src="row.main_image"
                :preview-src-list="[row.main_image]"
                style="width: 50px; height: 50px"
              />
              <el-button v-else type="primary" size="small" @click="uploadMainImage(row.id)">
                <el-icon><Upload /></el-icon>
                上传
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="100">
            <template #default="{ row }">
              <el-input-number v-model="row.price" :min="0" placeholder="请输入价格" />
            </template>
          </el-table-column>
          <el-table-column label="库存" width="100">
            <template #default="{ row }">
              <el-input-number v-model="row.stock" :min="0" placeholder="请输入库存" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-form>

    <!-- 批量设置价格弹窗 -->
    <el-dialog v-model="showBatchPriceModal" title="批量设置价格" width="400px" @close="showBatchPriceModal = false">
      <el-form
        ref="batchPriceFormRef"
        :model="batchPriceForm"
        :rules="{ price: [{ required: true, message: '价格不能为空', trigger: 'blur' }] }"
        label-width="80px"
      >
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="batchPriceForm.price" :min="0" placeholder="请输入价格" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchPriceModal = false">取消</el-button>
        <el-button type="primary" @click="handleBatchSetPrice">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量设置库存弹窗 -->
    <el-dialog v-model="showBatchStockModal" title="批量设置库存" width="400px" @close="showBatchStockModal = false">
      <el-form
        ref="batchStockFormRef"
        :model="batchStockForm"
        :rules="{ stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }] }"
        label-width="80px"
      >
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="batchStockForm.stock" :min="0" placeholder="请输入库存" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchStockModal = false">取消</el-button>
        <el-button type="primary" @click="handleBatchSetStock">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量更换主图弹窗 -->
    <el-dialog v-model="showBatchImageModal" title="批量更换主图" width="400px" @close="showBatchImageModal = false">
      <el-form
        ref="batchImageFormRef"
        :model="batchImageForm"
        :rules="{ main_image: [{ required: true, message: '请上传主图', trigger: 'change' }] }"
        label-width="80px"
      >
        <el-form-item label="主图" prop="main_image">
          <el-upload
            v-model:file-list="batchImageFileList"
            action=""
            :show-file-list="false"
            :before-upload="beforeBatchImageUpload"
          >
            <el-image
              v-if="batchImageForm.main_image"
              :src="batchImageForm.main_image"
              :preview-src-list="[batchImageForm.main_image]"
              style="width: 100px; height: 100px; cursor: pointer"
            />
            <el-button v-else type="primary" size="small">
              <el-icon><Upload /></el-icon>
              上传
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchImageModal = false">取消</el-button>
        <el-button type="primary" @click="handleBatchSetImage">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete, Money, Goods, Picture, Upload } from "@element-plus/icons-vue";
import { getSkuDetail, saveSku } from "@/api/modules/sku";

const router = useRouter();
const route = useRoute();

// 表单引用
const formRef = ref();

// 表单数据
const formData = ref({
  id: "",
  sku_code: "",
  sku_name: "",
  product_id: "",
  product_name: "",
  status: 1,
  sort: 0,
  remark: "",
  spec_groups: [
    {
      id: "",
      group_name: "",
      spec_values: [
        {
          id: "",
          value_name: ""
        }
      ]
    }
  ],
  sku_combinations: []
});

// 表单规则
const rules = {
  sku_code: [{ required: true, message: "SKU编码不能为空", trigger: "blur" }],
  sku_name: [{ required: true, message: "SKU名称不能为空", trigger: "blur" }],
  product_name: [{ required: true, message: "请选择商品", trigger: "blur" }]
};

// 选中的组合
const selectedCombinations = ref([]);

// 批量设置价格弹窗
const showBatchPriceModal = ref(false);
const batchPriceFormRef = ref();
const batchPriceForm = ref({
  price: 0
});

// 批量设置库存弹窗
const showBatchStockModal = ref(false);
const batchStockFormRef = ref();
const batchStockForm = ref({
  stock: 0
});

// 批量更换主图弹窗
const showBatchImageModal = ref(false);
const batchImageFormRef = ref();
const batchImageForm = ref({
  main_image: ""
});
const batchImageFileList = ref([]);

// 添加规格组
const addSpecGroup = () => {
  formData.value.spec_groups.push({
    id: "",
    group_name: "",
    spec_values: [
      {
        id: "",
        value_name: ""
      }
    ]
  });
};

// 删除规格组
const deleteSpecGroup = (index: number) => {
  ElMessageBox.confirm("删除规格组后将会重新生成SKU组合，确定要删除吗？", "删除确认", {
    type: "warning"
  })
    .then(() => {
      formData.value.spec_groups.splice(index, 1);
      generateSkuCombinations();
      ElMessage.success("规格组删除成功");
    })
    .catch(() => {
      // 用户取消删除
    });
};

// 添加规格值
const addSpecValue = (groupIndex: number) => {
  formData.value.spec_groups[groupIndex].spec_values.push({
    id: "",
    value_name: ""
  });
};

// 删除规格值
const deleteSpecValue = (groupIndex: number, valueIndex: number) => {
  formData.value.spec_groups[groupIndex].spec_values.splice(valueIndex, 1);
  generateSkuCombinations();
  ElMessage.success("规格值删除成功");
};

// 生成SKU组合
const generateSkuCombinations = () => {
  // 获取所有规格组的名称和值
  const specGroups = formData.value.spec_groups.map(group => ({
    name: group.group_name,
    values: group.spec_values.map(value => value.value_name)
  }));

  // 生成所有可能的组合
  const combinations = generateCombinations(specGroups);

  // 转换为SKU组合格式
  formData.value.sku_combinations = combinations.map(combination => ({
    id: "",
    sku_id: formData.value.id,
    spec_values: combination,
    price: 0,
    stock: 0,
    main_image: ""
  }));
};

// 递归生成组合
const generateCombinations = (specGroups: any[], index: number = 0, current: any = {}): any[] => {
  if (index >= specGroups.length) {
    return [current];
  }

  const group = specGroups[index];
  let result: any[] = [];

  for (const value of group.values) {
    const newCurrent = { ...current };
    newCurrent[group.name] = value;
    result = result.concat(generateCombinations(specGroups, index + 1, newCurrent));
  }

  return result;
};

// 上传主图
const uploadMainImage = () => {
  // TODO: 实现图片上传功能
  ElMessage.info("图片上传功能待实现");
};

// 批量设置价格前的校验
const beforeBatchSetPrice = () => {
  if (selectedCombinations.value.length === 0) {
    ElMessage.warning("请先选择要设置价格的SKU组合");
    return false;
  }
  return true;
};

// 批量设置价格
const handleBatchSetPrice = () => {
  batchPriceFormRef.value.validate((valid: boolean) => {
    if (valid && beforeBatchSetPrice()) {
      selectedCombinations.value.forEach(combination => {
        combination.price = batchPriceForm.value.price;
      });
      showBatchPriceModal.value = false;
      batchPriceForm.value.price = 0;
      ElMessage.success("价格设置成功");
    }
  });
};

// 批量设置库存前的校验
const beforeBatchSetStock = () => {
  if (selectedCombinations.value.length === 0) {
    ElMessage.warning("请先选择要设置库存的SKU组合");
    return false;
  }
  return true;
};

// 批量设置库存
const handleBatchSetStock = () => {
  batchStockFormRef.value.validate((valid: boolean) => {
    if (valid && beforeBatchSetStock()) {
      selectedCombinations.value.forEach(combination => {
        combination.stock = batchStockForm.value.stock;
      });
      showBatchStockModal.value = false;
      batchStockForm.value.stock = 0;
      ElMessage.success("库存设置成功");
    }
  });
};

// 批量更换主图前的校验
const beforeBatchSetImage = () => {
  if (selectedCombinations.value.length === 0) {
    ElMessage.warning("请先选择要更换主图的SKU组合");
    return false;
  }
  return true;
};

// 批量更换主图前的上传校验
const beforeBatchImageUpload = () => {
  // TODO: 实现图片上传功能
  ElMessage.info("图片上传功能待实现");
  return false;
};

// 批量更换主图
const handleBatchSetImage = () => {
  batchImageFormRef.value.validate((valid: boolean) => {
    if (valid && beforeBatchSetImage()) {
      selectedCombinations.value.forEach(combination => {
        combination.main_image = batchImageForm.value.main_image;
      });
      showBatchImageModal.value = false;
      batchImageForm.value.main_image = "";
      batchImageFileList.value = [];
      ElMessage.success("主图更换成功");
    }
  });
};

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 校验是否至少勾选了一个SKU组合
      if (formData.value.sku_combinations.length === 0) {
        ElMessage.warning("请先配置规格并生成SKU组合");
        return;
      }

      // 校验每个SKU组合是否都填写了价格和库存
      const invalidCombinations = formData.value.sku_combinations.filter(combination => {
        return combination.price <= 0 || combination.stock < 0;
      });

      if (invalidCombinations.length > 0) {
        ElMessage.warning("所有SKU组合都必须填写有效的价格和库存");
        return;
      }

      // 提交数据
      saveSku(formData.value)
        .then(response => {
          if (response.code === 200) {
            ElMessage.success("保存成功");
            router.push("/sku/list");
          } else {
            ElMessage.error(response.msg);
          }
        })
        .catch(() => {
          ElMessage.error("保存失败");
        });
    }
  });
};

// 重置表单
const handleReset = () => {
  formRef.value.resetFields();
};

// 返回列表页
const handleBack = () => {
  router.push("/sku/list");
};

// 页面加载时获取数据
onMounted(() => {
  const id = route.params.id;
  if (id && id !== "new") {
    // 编辑模式，获取SKU详情
    getSkuDetail(id)
      .then(response => {
        if (response.code === 200) {
          formData.value = response.data;
        } else {
          ElMessage.error(response.msg);
        }
      })
      .catch(() => {
        ElMessage.error("获取SKU详情失败");
      });
  } else {
    // 新增模式，初始化表单数据
    formData.value = {
      id: "",
      sku_code: "",
      sku_name: "",
      product_id: "",
      product_name: "",
      status: 1,
      sort: 0,
      remark: "",
      spec_groups: [
        {
          id: "",
          group_name: "",
          spec_values: [
            {
              id: "",
              value_name: ""
            }
          ]
        }
      ],
      sku_combinations: []
    };
  }
});

// 监听规格组或规格值变化，自动生成SKU组合
watch(
  () => [formData.value.spec_groups],
  () => {
    generateSkuCombinations();
  },
  { deep: true }
);
</script>

<style scoped>
.sku-edit-container {
  padding: 20px;
}

.card-wrapper {
  margin-bottom: 20px;
}

.spec-group-item {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.spec-group-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.spec-group-header .el-form-item {
  flex: 1;
  margin-bottom: 0;
}

.spec-values-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-value-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.spec-value-item .el-form-item {
  margin-bottom: 0;
}

.batch-operation-bar {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 30px;
  justify-content: center;
}
</style>
