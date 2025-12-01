<template>
  <div class="tour-config-container">
    <!-- 遮罩层 -->
    <div class="tour-overlay" v-if="isVisible" @click="closeTour"></div>

    <!-- 引导浮层 -->
    <div class="tour-modal" v-if="isVisible" :style="modalStyle">
      <!-- 关闭按钮 -->
      <button class="tour-close" @click="closeTour">×</button>

      <!-- 步骤内容 -->
      <div class="tour-content">
        <h2 class="tour-title">{{ currentStep.title }}</h2>
        <p class="tour-description">{{ currentStep.description }}</p>

        <!-- 插画占位符 -->
        <div class="tour-illustration">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="#f0f0f0" />
            <text x="100" y="110" font-size="24" fill="#666" text-anchor="middle">Step {{ currentIndex + 1 }}</text>
          </svg>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="tour-navigation">
        <button class="tour-btn prev-btn" @click="prevStep" :disabled="currentIndex === 0">Previous Step</button>
        <button class="tour-btn next-btn" @click="nextStep">
          {{ currentIndex === steps.length - 1 ? "Finish Tour" : "Next Step" }}
        </button>
      </div>

      <!-- 进度指示器 -->
      <div class="tour-progress">
        <div
          class="tour-progress-dot"
          v-for="(step, index) in steps"
          :key="index"
          :class="{ active: index === currentIndex }"
        ></div>
      </div>
    </div>

    <!-- 手动触发按钮 -->
    <button class="tour-trigger" @click="startTour">Begin Tour</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// 引导步骤数据
const steps = ref([
  {
    title: "Upload File",
    description: "Put your files here.",
    target: ".upload-btn" // 指向上传按钮的选择器
  },
  {
    title: "Save",
    description: "Save your changes.",
    target: ".save-btn" // 指向保存按钮的选择器
  },
  {
    title: "Center",
    description: "Displayed in the center of screen.",
    target: ".center-content" // 指向中央展示区的选择器
  },
  {
    title: "Other Actions",
    description: "Click to see other actions.",
    target: ".more-actions" // 指向三点菜单按钮的选择器
  }
]);

// 当前步骤索引
const currentIndex = ref(0);

// 引导是否可见
const isVisible = ref(false);

// 当前步骤
const currentStep = computed(() => steps.value[currentIndex.value]);

// 浮层样式（根据目标元素位置调整）
const modalStyle = computed(() => {
  if (!currentStep.value.target) {
    return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
  }

  // 尝试获取目标元素的位置
  const targetElement = document.querySelector(currentStep.value.target);
  if (targetElement) {
    const rect = targetElement.getBoundingClientRect();
    return {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: "translate(-50%, -50%)"
    };
  }

  // 如果找不到目标元素，默认居中
  return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
});

// 开始引导
const startTour = () => {
  currentIndex.value = 0;
  isVisible.value = true;
};

// 关闭引导
const closeTour = () => {
  isVisible.value = false;
};

// 上一步
const prevStep = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

// 下一步
const nextStep = () => {
  if (currentIndex.value < steps.value.length - 1) {
    currentIndex.value++;
  } else {
    // 最后一步，结束引导
    closeTour();
    // 这里可以添加引导完成后的统计逻辑
    console.log("Tour completed!");
  }
};

// 组件挂载后，检查是否需要自动触发引导
onMounted(() => {
  // 检查是否是首次登录或首次访问
  const hasSeenTour = localStorage.getItem("hasSeenTour");
  if (!hasSeenTour) {
    // 延迟一段时间后自动触发引导，让页面有足够的时间加载
    setTimeout(() => {
      startTour();
      // 标记为已看过引导
      localStorage.setItem("hasSeenTour", "true");
    }, 1000);
  }
});
</script>

<style scoped>
.tour-config-container {
  position: relative;
}

/* 遮罩层 */
.tour-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  cursor: pointer;
}

/* 引导浮层 */
.tour-modal {
  position: fixed;
  width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  padding: 24px;
  box-sizing: border-box;
}

/* 关闭按钮 */
.tour-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.tour-close:hover {
  color: #333;
}

/* 步骤内容 */
.tour-content {
  text-align: center;
  margin-bottom: 24px;
}

.tour-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.tour-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

/* 插画 */
.tour-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}

/* 导航按钮 */
.tour-navigation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.tour-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.prev-btn {
  background-color: #f0f0f0;
  color: #666;
}

.prev-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.prev-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.next-btn {
  background-color: #409eff;
  color: white;
}

.next-btn:hover {
  background-color: #66b1ff;
}

/* 进度指示器 */
.tour-progress {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.tour-progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #d0d0d0;
  transition: background-color 0.2s;
}

.tour-progress-dot.active {
  background-color: #409eff;
}

/* 手动触发按钮 */
.tour-trigger {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.2s;
  z-index: 998;
}

.tour-trigger:hover {
  background-color: #66b1ff;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}
</style>
