<template>
  <div class="tour-config-container">
    <div class="tour-content">
      <h1>引导页/新手教程</h1>
      <p>帮助新用户快速熟悉界面核心功能和操作布局</p>
      <el-button type="primary" @click="startTour">Begin Tour</el-button>
    </div>

    <!-- 引导页遮罩层 -->
    <div v-if="isTourActive" class="tour-overlay" @click="closeTour"></div>

    <!-- 引导高亮框 -->
    <div v-if="isTourActive && highlightRect" class="tour-highlight" :style="highlightStyle"></div>

    <!-- 引导页浮层 -->
    <div v-if="isTourActive" class="tour-modal" :style="modalStyle">
      <div class="tour-header">
        <h2>{{ currentStep.title }}</h2>
        <el-button type="text" class="close-btn" @click="closeTour">×</el-button>
      </div>
      <div class="tour-body">
        <div class="tour-illustration">
          <!-- 这里可以添加插画 -->
          <div class="illustration-placeholder">{{ currentStep.title }}</div>
        </div>
        <p class="tour-description">{{ currentStep.description }}</p>
      </div>
      <div class="tour-footer">
        <div class="tour-progress">
          <span
            v-for="(step, index) in tourSteps"
            :key="index"
            class="progress-dot"
            :class="{ active: index === currentStepIndex }"
          ></span>
        </div>
        <div class="tour-buttons">
          <el-button v-if="currentStepIndex > 0" @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="nextStep">
            {{ currentStepIndex === tourSteps.length - 1 ? "结束引导" : "下一步" }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 示例功能按钮 -->
    <div class="example-buttons">
      <el-button type="success" class="upload-btn">Upload</el-button>
      <el-button type="primary" class="save-btn">Save</el-button>
      <el-button type="default" class="more-btn">...</el-button>
    </div>

    <!-- 示例中央展示区 -->
    <div class="example-center">
      <h2>中央展示区</h2>
      <p>这里是页面的主要内容区域</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="TourConfig">
import { ref, reactive, computed, watch } from "vue";

// 引导页状态
const isTourActive = ref(false);
const currentStepIndex = ref(0);
const highlightRect = ref<any>(null);

// 引导步骤配置
const tourSteps = reactive([
  {
    title: "Upload File",
    description: "Put your files here.",
    target: ".upload-btn"
  },
  {
    title: "Save",
    description: "Save your changes.",
    target: ".save-btn"
  },
  {
    title: "Center",
    description: "Displayed in the center of screen.",
    target: ".example-center"
  },
  {
    title: "Other Actions",
    description: "Click to see other actions.",
    target: ".more-btn"
  }
]);

// 当前步骤
const currentStep = ref(tourSteps[0]);

// 计算高亮框样式
const highlightStyle = computed(() => {
  if (!highlightRect.value) return {};
  return {
    position: "fixed",
    top: `${highlightRect.value.top}px`,
    left: `${highlightRect.value.left}px`,
    width: `${highlightRect.value.width}px`,
    height: `${highlightRect.value.height}px`,
    border: "2px solid #409eff",
    borderRadius: "4px",
    zIndex: "9999",
    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
    pointerEvents: "none"
  };
});

// 计算模态框样式
const modalStyle = computed(() => {
  if (!highlightRect.value) return {};
  const modalWidth = 400;
  const modalHeight = 300;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 默认显示在高亮框的下方
  let top = highlightRect.value.top + highlightRect.value.height + 20;
  let left = highlightRect.value.left + highlightRect.value.width / 2 - modalWidth / 2;

  // 调整位置以确保模态框在视口中
  if (top + modalHeight > windowHeight) {
    top = highlightRect.value.top - modalHeight - 20;
  }
  if (left < 0) {
    left = 20;
  } else if (left + modalWidth > windowWidth) {
    left = windowWidth - modalWidth - 20;
  }

  return {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    transform: "none"
  };
});

// 获取目标元素的位置和尺寸
const getTargetRect = (targetSelector: string) => {
  const targetElement = document.querySelector(targetSelector);
  if (!targetElement) return null;
  return targetElement.getBoundingClientRect();
};

// 更新高亮框和模态框位置
const updateHighlightAndModal = () => {
  const rect = getTargetRect(currentStep.value.target);
  if (rect) {
    highlightRect.value = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  } else {
    highlightRect.value = null;
  }
};

// 开始引导
const startTour = () => {
  isTourActive.value = true;
  currentStepIndex.value = 0;
  currentStep.value = tourSteps[0];
  setTimeout(updateHighlightAndModal, 100); // 延迟确保DOM更新
};

// 关闭引导
const closeTour = () => {
  isTourActive.value = false;
  highlightRect.value = null;
};

// 上一步
const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    currentStep.value = tourSteps[currentStepIndex.value];
    updateHighlightAndModal();
  }
};

// 下一步
const nextStep = () => {
  if (currentStepIndex.value < tourSteps.length - 1) {
    currentStepIndex.value++;
    currentStep.value = tourSteps[currentStepIndex.value];
    updateHighlightAndModal();
  } else {
    closeTour();
  }
};

// 监听窗口大小变化，更新位置
const handleResize = () => {
  if (isTourActive.value) {
    updateHighlightAndModal();
  }
};

window.addEventListener("resize", handleResize);

// 组件卸载时移除事件监听
const cleanup = () => {
  window.removeEventListener("resize", handleResize);
};

// 使用watch监听currentStep变化，更新位置
watch(currentStep, () => {
  updateHighlightAndModal();
});
</script>

<style scoped lang="scss">
.tour-config-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.tour-content {
  text-align: center;
  margin-bottom: 40px;
}

.example-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  justify-content: center;
}

.example-center {
  width: 80%;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
}

// 引导页样式
.tour-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.tour-modal {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  z-index: 1000;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.tour-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tour-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  font-size: 24px;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tour-body {
  margin-bottom: 24px;
}

.tour-illustration {
  text-align: center;
  margin-bottom: 16px;
}

.illustration-placeholder {
  width: 120px;
  height: 120px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 14px;
  color: #666;
}

.tour-description {
  text-align: center;
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.tour-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tour-progress {
  display: flex;
  gap: 8px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e0e0e0;
  transition: background-color 0.3s;
}

.progress-dot.active {
  background-color: #409eff;
}

.tour-buttons {
  display: flex;
  gap: 10px;
}
</style>
