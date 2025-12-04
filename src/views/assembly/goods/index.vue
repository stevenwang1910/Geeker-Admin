<template>
  <div class="goods content-box">
    <div class="goods-header">
      <h2 class="title">商品卡片列表</h2>
      <p class="subtitle">拖拽商品卡片可以重新排序</p>
    </div>
    <draggable
      v-model="goodsList"
      class="goods-grid"
      item-key="id"
      animation="300"
      chosen-class="chosen"
      force-fallback="true"
      ghost-class="ghost"
      drag-class="dragging"
    >
      <template #item="{ element, index }">
        <div class="goods-card" :key="element.id">
          <div class="goods-image">
            <img :src="element.image" :alt="element.name" />
          </div>
          <div class="goods-info">
            <h3 class="goods-name">{{ element.name }}</h3>
            <p class="goods-category">{{ element.category }}</p>
            <div class="goods-price">¥{{ element.price }}</div>
            <div class="goods-stock">库存: {{ element.stock }}</div>
            <div class="goods-status" :class="element.status">
              {{ element.status === "active" ? "在售" : "下架" }}
            </div>
          </div>
          <div class="goods-actions">
            <el-button type="primary" size="small" @click="editGoods(element)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteGoods(index)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </div>
        </div>
      </template>
    </draggable>
    <div class="goods-footer">
      <el-button type="primary" @click="addGoods">
        <el-icon><Plus /></el-icon> 添加商品
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="goods">
import { ref, onMounted } from "vue";
import draggable from "vuedraggable";
import { ElButton, ElIcon, ElMessage } from "element-plus";
import { Edit, Delete, Plus, Check } from "@element-plus/icons-vue";

// 商品数据类型定义
interface GoodsItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  image: string;
  description: string;
}

// 模拟商品数据
const mockGoodsData: GoodsItem[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    category: "手机",
    price: 7999,
    stock: 50,
    status: "active",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    description: "最新款苹果手机，搭载A17 Pro芯片"
  },
  {
    id: "2",
    name: "MacBook Air M2",
    category: "笔记本电脑",
    price: 8999,
    stock: 30,
    status: "active",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    description: "轻薄便携，性能强劲"
  },
  {
    id: "3",
    name: "AirPods Pro",
    category: "耳机",
    price: 1899,
    stock: 100,
    status: "active",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
    description: "主动降噪，音质出色"
  },
  {
    id: "4",
    name: "iPad Air",
    category: "平板电脑",
    price: 4599,
    stock: 40,
    status: "active",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    description: "办公娱乐两不误"
  },
  {
    id: "5",
    name: "Apple Watch Series 9",
    category: "智能手表",
    price: 2999,
    stock: 60,
    status: "active",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    description: "健康监测，运动追踪"
  },
  {
    id: "6",
    name: "Magic Keyboard",
    category: "键盘",
    price: 899,
    stock: 80,
    status: "active",
    image: "https://images.unsplash.com/photo-1587829741315-4492c4574895?w=400",
    description: "无线蓝牙，打字舒适"
  },
  {
    id: "7",
    name: "HomePod mini",
    category: "智能音箱",
    price: 749,
    stock: 90,
    status: "active",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    description: "Siri 助手，音质卓越"
  },
  {
    id: "8",
    name: "AirTag 4件装",
    category: "配件",
    price: 779,
    stock: 120,
    status: "active",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
    description: "防丢追踪，轻松查找"
  },
  {
    id: "9",
    name: "Mac mini M2",
    category: "台式电脑",
    price: 4499,
    stock: 25,
    status: "active",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    description: "小巧机身，强大性能"
  }
];

// 商品列表
const goodsList = ref<GoodsItem[]>([]);

// 初始化商品数据
const initGoodsData = () => {
  goodsList.value = JSON.parse(JSON.stringify(mockGoodsData));
};

// 添加商品
const addGoods = () => {
  const newGoods: GoodsItem = {
    id: Date.now().toString(),
    name: "新商品",
    category: "未分类",
    price: 0,
    stock: 0,
    status: "active",
    image: "https://via.placeholder.com/400x300?text=New+Product",
    description: "这是一个新商品"
  };
  goodsList.value.push(newGoods);
  ElMessage.success("商品添加成功");
};

// 编辑商品
const editGoods = (goods: GoodsItem) => {
  ElMessage.info(`编辑商品: ${goods.name}`);
  // 这里可以打开编辑对话框
};

// 删除商品
const deleteGoods = (index: number) => {
  goodsList.value.splice(index, 1);
  ElMessage.success("商品删除成功");
};

// 组件挂载时初始化数据
onMounted(() => {
  initGoodsData();
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
