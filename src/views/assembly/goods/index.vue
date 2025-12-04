<template>
  <div class="goods-list-container">
    <h2 class="page-title">商品列表</h2>
    <draggable
      v-model="goodsList"
      class="goods-list"
      item-key="id"
      animation="300"
      chosen-class="chosen"
      ghost-class="ghost"
      drag-class="drag"
      force-fallback="true"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <div class="goods-card">
          <div class="goods-image">
            <img :src="element.image" :alt="element.name" />
          </div>
          <div class="goods-info">
            <h3 class="goods-name">{{ element.name }}</h3>
            <p class="goods-description">{{ element.description }}</p>
            <div class="goods-price">¥{{ element.price.toFixed(2) }}</div>
            <div class="goods-stock">库存: {{ element.stock }}</div>
          </div>
        </div>
      </template>
    </draggable>
    <div class="drag-hint">拖拽商品卡片可以重新排序</div>
  </div>
</template>

<script setup lang="ts" name="goods">
import { ref } from "vue";
import draggable from "vuedraggable";

// 模拟商品数据
const goodsList = ref([
  { 
    id: 1, 
    name: "商品1", 
    description: "这是商品1的详细描述", 
    price: 199.99, 
    stock: 100, 
    image: "https://via.placeholder.com/200x200?text=Goods+1" 
  },
  { 
    id: 2, 
    name: "商品2", 
    description: "这是商品2的详细描述", 
    price: 299.99, 
    stock: 50, 
    image: "https://via.placeholder.com/200x200?text=Goods+2" 
  },
  { 
    id: 3, 
    name: "商品3", 
    description: "这是商品3的详细描述", 
    price: 399.99, 
    stock: 200, 
    image: "https://via.placeholder.com/200x200?text=Goods+3" 
  },
  { 
    id: 4, 
    name: "商品4", 
    description: "这是商品4的详细描述", 
    price: 499.99, 
    stock: 150, 
    image: "https://via.placeholder.com/200x200?text=Goods+4" 
  },
  { 
    id: 5, 
    name: "商品5", 
    description: "这是商品5的详细描述", 
    price: 599.99, 
    stock: 80, 
    image: "https://via.placeholder.com/200x200?text=Goods+5" 
  },
  { 
    id: 6, 
    name: "商品6", 
    description: "这是商品6的详细描述", 
    price: 699.99, 
    stock: 120, 
    image: "https://via.placeholder.com/200x200?text=Goods+6" 
  }
]);

// 拖拽结束事件处理
const onDragEnd = () => {
  console.log("拖拽结束，新的排序:", goodsList.value);
  // 这里可以添加保存排序的逻辑
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>