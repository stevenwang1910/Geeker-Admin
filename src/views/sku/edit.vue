<template>
  <div class="sku-edit-container">
    <el-card class="basic-info-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
        </div>
      </template>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="formData.productName" readonly />
        </el-form-item>
        <el-form-item label="SKU编码" prop="skuCode">
          <el-input v-model="formData.skuCode" placeholder="请输入SKU编码" />
        </el-form-item>
        <el-form-item label="SKU名称" prop="skuName">
          <el-input v-model="formData.skuName" placeholder="请输入SKU名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formData.status" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="spec-config-card">
      <template #header>
        <div class="card-header">
          <span>规格配置</span>
          <el-button type="primary" size="small" @click="addSpecGroup">新增规格组</el-button>
        </div>
      </template>
      <div v-for="(group, groupIndex) in formData.specGroups" :key="groupIndex" class="spec-group-item">
        <div class="spec-group-header">
          <el-form-item
            :prop="`specGroups.${groupIndex}.name`"
            :rules="[{ required: true, message: '规格组名称不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="group.name" placeholder="请输入规格组名称" style="width: 200px" />
          </el-form-item>
          <el-button type="danger" size="small" @click="deleteSpecGroup(groupIndex)">删除规格组</el-button>
        </div>
        <div class="spec-values-container">
          <el-input
            v-model="group.newValue"
            placeholder="请输入规格值"
            style="width: 200px; margin-right: 10px"
            @keyup.enter="addSpecValue(groupIndex)"
          >
            <template #append>
              <el-button @click="addSpecValue(groupIndex)">添加</el-button>
            </template>
          </el-input>
          <div class="spec-values-list">
            <el-tag
              v-for="(value, valueIndex) in group.values"
              :key="valueIndex"
              closable
              @close="deleteSpecValue(groupIndex, valueIndex)"
            >
              {{ value }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="sku-combination-card">
      <template #header>
        <div class="card-header">
          <span>SKU组合</span>
          <div class="batch-operation-buttons">
            <el-button type="primary" size="small" @click="batchSetPrice">批量设置价格</el-button>
            <el-button type="primary" size="small" @click="batchSetStock">批量设置库存</el-button>
            <el-button type="primary" size="small" @click="batchSetImage">批量更换主图</el-button>
          </div>
        </div>
      </template>
      <el-table v-loading="combinationLoading" :data="skuCombinations" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="规格组合" min-width="200">
          <template #default="{ row }">
            <span v-for="(value, key) in row.specs" :key="key" class="spec-value-tag">{{ value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" min-width="100">
          <template #default="{ row }">
            <el-upload
              v-model:file-list="row.imageList"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="(response, file) => handleImageUploadSuccess(response, file, row)"
            >
              <el-image
                v-if="row.imageUrl"
                :src="row.imageUrl"
                style="width: 80px; height: 80px; object-fit: cover; cursor: pointer"
              />
              <el-button v-else type="primary" size="small">上传图片</el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="100">
          <template #default="{ row }">
            <el-input-number v-model="row.price" :min="0" :precision="2" style="width: 150px" />
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="100">
          <template #default="{ row }">
            <el-input-number v-model="row.stock" :min="0" style="width: 150px" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="form-actions">
      <el-button @click="$router.back">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox, ElForm, ElLoading } from "element-plus";

const route = useRoute();
const router = useRouter();

// 表单引用
const formRef = ref<InstanceType<typeof ElForm>>();

// 加载状态
const combinationLoading = ref(false);

// 表单数据
const formData = reactive({
  id: "",
  productName: "iPhone 15 Pro",
  skuCode: "",
  skuName: "",
  status: "1",
  sort: 0,
  remark: "",
  specGroups: [
    {
      name: "颜色",
      values: ["深空黑色", "白色", "金色", "银色"],
      newValue: ""
    },
    {
      name: "存储容量",
      values: ["128GB", "256GB", "512GB", "1TB"],
      newValue: ""
    }
  ]
});

// 表单验证规则
const rules = {
  skuCode: [{ required: true, message: "SKU编码不能为空", trigger: "blur" }],
  skuName: [{ required: true, message: "SKU名称不能为空", trigger: "blur" }]
};

// SKU组合数据
interface SkuCombination {
  id: number;
  specs: Record<string, string>;
  imageUrl: string;
  imageList: any[];
  price: number;
  stock: number;
}
const skuCombinations = ref<SkuCombination[]>([]);

// 生成SKU组合
const generateSkuCombinations = () => {
  combinationLoading.value = true;
  try {
    // 模拟延迟
    setTimeout(() => {
      // 这里应该实现真正的SKU组合生成逻辑
      // 暂时使用模拟数据
      skuCombinations.value = [
        {
          id: 1,
          specs: { 颜色: "深空黑色", 存储容量: "128GB" },
          imageUrl: "",
          imageList: [],
          price: 7999,
          stock: 100
        },
        {
          id: 2,
          specs: { 颜色: "深空黑色", 存储容量: "256GB" },
          imageUrl: "",
          imageList: [],
          price: 8999,
          stock: 50
        },
        {
          id: 3,
          specs: { 颜色: "深空黑色", 存储容量: "512GB" },
          imageUrl: "",
          imageList: [],
          price: 10999,
          stock: 30
        },
        {
          id: 4,
          specs: { 颜色: "深空黑色", 存储容量: "1TB" },
          imageUrl: "",
          imageList: [],
          price: 12999,
          stock: 20
        },
        {
          id: 5,
          specs: { 颜色: "白色", 存储容量: "128GB" },
          imageUrl: "",
          imageList: [],
          price: 7999,
          stock: 80
        }
      ];
      combinationLoading.value = false;
    }, 500);
  } catch (error) {
    ElMessage.error("生成SKU组合失败");
    combinationLoading.value = false;
  }
};

// 添加规格组
const addSpecGroup = () => {
  formData.specGroups.push({
    name: "",
    values: [],
    newValue: ""
  });
};

// 删除规格组
const deleteSpecGroup = (index: number) => {
  if (formData.specGroups.length <= 1) {
    ElMessage.warning("至少保留一个规格组");
    return;
  }

  ElMessageBox.confirm("删除规格组后将重新生成SKU组合，确定要删除吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      formData.specGroups.splice(index, 1);
      generateSkuCombinations();
    })
    .catch(() => {
      // 用户取消删除
    });
};

// 添加规格值
const addSpecValue = (groupIndex: number) => {
  const group = formData.specGroups[groupIndex];
  if (!group.newValue.trim()) {
    ElMessage.warning("规格值不能为空");
    return;
  }

  if (group.values.includes(group.newValue.trim())) {
    ElMessage.warning("该规格值已存在");
    return;
  }

  group.values.push(group.newValue.trim());
  group.newValue = "";
  generateSkuCombinations();
};

// 删除规格值
const deleteSpecValue = (groupIndex: number, valueIndex: number) => {
  formData.specGroups[groupIndex].values.splice(valueIndex, 1);
  generateSkuCombinations();
};

// 批量设置价格
const batchSetPrice = () => {
  ElMessageBox.prompt("请输入批量设置的价格", "批量设置价格", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^\d+(\.\d{1,2})?$/,
    inputErrorMessage: "请输入有效的价格格式（最多两位小数）"
  })
    .then(({ value }) => {
      const price = parseFloat(value);
      skuCombinations.value.forEach((item: any) => {
        item.price = price;
      });
      ElMessage.success("价格设置成功");
    })
    .catch(() => {
      // 用户取消设置
    });
};

// 批量设置库存
const batchSetStock = () => {
  ElMessageBox.prompt("请输入批量设置的库存", "批量设置库存", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^\d+$/,
    inputErrorMessage: "请输入有效的库存格式（整数）"
  })
    .then(({ value }) => {
      const stock = parseInt(value);
      skuCombinations.value.forEach((item: any) => {
        item.stock = stock;
      });
      ElMessage.success("库存设置成功");
    })
    .catch(() => {
      // 用户取消设置
    });
};

// 批量更换主图
const batchSetImage = () => {
  ElMessage.info("批量更换主图功能开发中");
};

// 图片上传前校验
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("请上传图片文件");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB");
    return false;
  }
  return true;
};

// 图片上传成功处理
const handleImageUploadSuccess = (response: any, file: any, row: any) => {
  // 模拟上传成功，实际项目中应该使用response返回的图片URL
  row.imageUrl = URL.createObjectURL(file.raw);
  ElMessage.success("图片上传成功");
};

// 提交表单
const handleSubmit = () => {
  if (!formRef.value) return;

  formRef.value.validate(valid => {
    if (valid) {
      // 验证SKU组合是否都填写了价格和库存
      const invalidCombinations = skuCombinations.value.filter((item: any) => !item.price || !item.stock);
      if (invalidCombinations.length > 0) {
        ElMessage.error("所有SKU组合必须填写价格和库存");
        return;
      }

      // 模拟API请求
      const submitLoading = ElLoading.service({ text: "提交中..." });
      setTimeout(() => {
        submitLoading.close();
        ElMessage.success("提交成功");
        router.push("/sku/list");
      }, 1000);
    } else {
      ElMessage.error("表单验证失败，请检查填写内容");
    }
  });
};

// 监听规格组变化，重新生成SKU组合
watch(
  () => formData.specGroups,
  () => {
    generateSkuCombinations();
  },
  { deep: true }
);

// 页面挂载时初始化数据
onMounted(() => {
  const id = route.params.id;
  if (id && id !== "new") {
    // 编辑模式，获取SKU详情
    // 模拟API请求
    const loading = ElLoading.service({ text: "加载中..." });
    setTimeout(() => {
      // 模拟SKU详情数据
      formData.id = id as string;
      formData.skuCode = "SKU001";
      formData.skuName = "iPhone 15 Pro 128GB 深空黑色";
      formData.status = "1";
      formData.sort = 0;
      formData.remark = "这是一个测试SKU";
      loading.close();
      generateSkuCombinations();
    }, 1000);
  } else {
    // 新增模式，生成初始SKU组合
    generateSkuCombinations();
  }
});
</script>

<style scoped>
.sku-edit-container {
  padding: 20px;
}

.basic-info-card,
.spec-config-card,
.sku-combination-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-group-item {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}

.spec-group-item:last-child {
  margin-bottom: 0;
}

.spec-group-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.spec-group-header .el-form-item {
  margin-bottom: 0;
  margin-right: 15px;
}

.spec-values-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spec-values-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.batch-operation-buttons {
  display: flex;
  gap: 10px;
}

.spec-value-tag {
  margin-right: 5px;
  padding: 2px 8px;
  background-color: #f0f2f5;
  border-radius: 4px;
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
