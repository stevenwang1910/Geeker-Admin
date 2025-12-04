<template>
  <div class="goods-container">
    <h2 class="page-title">商品列表</h2>
    <draggable
      v-model="goodsList"
      class="goods-grid"
      item-key="id"
      animation="300"
      chosen-class="chosen"
      force-fallback="true"
      @change="handleDragChange"
    >
      <template #item="{ element }">
        <div class="goods-card">
          <div class="goods-image">
            <img :src="element.image" :alt="element.name" />
          </div>
          <div class="goods-info">
            <h3 class="goods-name">{{ element.name }}</h3>
            <p class="goods-desc">{{ element.description }}</p>
            <div class="goods-footer">
              <span class="goods-price">¥{{ element.price }}</span>
              <span class="goods-stock">库存: {{ element.stock }}</span>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts" name="goods">
import { ref } from "vue";
import draggable from "vuedraggable";

// 模拟商品数据
const goodsList = ref([
  {
    id: 1,
    name: "iPhone 15 Pro",
    description: "苹果最新旗舰手机，搭载A17 Pro芯片",
    price: 7999,
    stock: 100,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjODdiYmEyIi8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDE3MCAxMjBMMTUwIDE0MEwxMzAgMTIwTDUwIDEwMCIgZmlsbD0iIzk5OTk5OSIvPgo8dGV4dCB4PSIxNTAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSI+SVBob25lIDE1IFBybyB8PC90ZXh0Pgo8L3N2Zz4K"
  },
  {
    id: 2,
    name: "MacBook Air M2",
    description: "轻薄便携，性能强劲，适合办公和创作",
    price: 8999,
    stock: 50,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmY5YjU0Ii8+CjxwYXRoIGQ9Ik01MCA1MEwyNTAgNTBMMjUwIDE1MEw1MCAxNTAiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iMTUwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiPk1hY0Jvb2sgQWlyIE0yPC90ZXh0Pgo8L3N2Zz4K"
  },
  {
    id: 3,
    name: "AirPods Pro",
    description: "主动降噪，音质出色，无线充电盒",
    price: 1899,
    stock: 200,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjczYyOGEiLz4KPHJlY3QgeD0iNzUiIHk9Ijc1IiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiM5OTk5OTkiLz4KPHJlY3QgeD0iMTc1IiB5PSI3NSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIj5BaXJQb2RzIFBybyB8PC90ZXh0Pgo8L3N2Zz4K"
  },
  {
    id: 4,
    name: "iPad Air 5",
    description: "10.9英寸显示屏，A15仿生芯片，支持Apple Pencil",
    price: 4599,
    stock: 80,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNzZjODkzIi8+CjxwYXRoIGQ9Ik03NSA1MEwyMjUgNTBMMjI1IDE1MEw3NSAxNTAiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iMTUwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiPlBhcCBhaXIgNSA8L3RleHQ+Cjwvc3ZnPgo="
  },
  {
    id: 5,
    name: "Apple Watch Series 9",
    description: "健康监测，运动追踪，智能通知",
    price: 2999,
    stock: 120,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjYjkwNjA4Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iMTUwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiPlNlcmllcyA5PC90ZXh0Pgo8L3N2Zz4K"
  },
  {
    id: 6,
    name: "Magic Keyboard",
    description: "无线蓝牙键盘，舒适打字体验，可充电",
    price: 899,
    stock: 150,
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNTU4MjhiIi8+CjxwYXRoIGQ9Ik01MCA3MEwyNTAgNzBMMjUwIDEzMDBMNTAgMTMwIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIj5NYWdpYyBLZXlib2FyZCA8L3RleHQ+Cjwvc3ZnPgo="
  }
]);

// 拖拽排序变化处理
const handleDragChange = () => {
  console.log(
    "商品排序已更新:",
    goodsList.value.map(item => ({ id: item.id, name: item.name }))
  );
  // 这里可以添加保存排序结果的API调用
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
