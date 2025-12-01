<template>
  <div class="tour-container">
    <div class="tour-content">
      <h1 class="tour-title">欢迎使用 Geeker Admin</h1>
      <p class="tour-subtitle">通过这个简短的引导，快速了解系统功能</p>
      <el-button type="primary" size="large" @click="startTourGuide" class="start-tour-btn"> Begin Tour </el-button>
      <el-button type="text" @click="skipTour" class="skip-tour-btn"> 跳过引导 </el-button>
    </div>

    <!-- 引导内容列表 -->
    <div class="tour-features">
      <div class="feature-item" v-for="feature in tourFeatures" :key="feature.id">
        <div class="feature-icon">
          <el-icon><component :is="feature.icon" /></el-icon>
        </div>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-desc">{{ feature.description }}</p>
      </div>
    </div>

    <!-- 引导浮层 -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showTour" class="tour-overlay" @click.self="closeTour">
          <div class="tour-modal" :style="modalStyle">
            <div class="tour-modal-header">
              <h3>{{ currentStep.title }}</h3>
              <el-button type="text" @click="closeTour" class="close-btn"> ✕ </el-button>
            </div>

            <div class="tour-modal-body">
              <div class="tour-illustration">
                <img :src="currentStep.illustration" :alt="currentStep.title" />
              </div>
              <p class="tour-description-text">{{ currentStep.description }}</p>
            </div>

            <div class="tour-modal-footer">
              <div class="step-indicators">
                <span
                  v-for="(step, index) in steps"
                  :key="index"
                  class="step-indicator"
                  :class="{ active: index === currentStepIndex }"
                ></span>
              </div>

              <div class="tour-actions">
                <el-button v-if="currentStepIndex > 0" @click="prevStep"> 上一步 </el-button>
                <el-button v-if="currentStepIndex < steps.length - 1" type="primary" @click="nextStep"> 下一步 </el-button>
                <el-button v-else type="primary" @click="finishTour"> 结束引导 </el-button>
              </div>
            </div>
          </div>

          <!-- 指向元素的高亮区域 -->
          <div v-if="currentStep.targetSelector" class="tour-highlight" :style="highlightStyle"></div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts" name="TourGuide">
import { useRouter } from "vue-router";
import { useTourGuide, TourStep } from "@/hooks/useTourGuide";
import { ElMessage } from "element-plus";
// 导入图标
import { Upload, Download, Monitor, MoreFilled } from "@element-plus/icons-vue";

const router = useRouter();

// 引导功能特性列表
const tourFeatures = [
  {
    id: 1,
    title: "数据可视化",
    description: "直观展示系统关键指标和数据分析",
    icon: Monitor
  },
  {
    id: 2,
    title: "文件上传",
    description: "轻松上传和管理各类文件",
    icon: Upload
  },
  {
    id: 3,
    title: '数据保存',
    description: '一键保存您的工作进度',
    icon: Download
  },
  {
    id: 4,
    title: "更多功能",
    description: "探索系统提供的丰富功能",
    icon: MoreFilled
  }
];

// 定义真实的引导步骤
const tourSteps: TourStep[] = [
  {
    title: "文件上传",
    description: "通过此区域上传您需要处理的文件，支持多种格式。",
    targetSelector: ".upload-btn",
    illustration: "/vue.svg"
  },
  {
    title: "保存功能",
    description: "点击保存按钮可将您的更改永久保存到系统中。",
    targetSelector: ".save-btn",
    illustration: "/vue.svg"
  },
  {
    title: "中央内容区",
    description: "这是系统的主要工作区域，显示您的核心数据和操作界面。",
    targetSelector: ".main-content",
    illustration: "/vue.svg"
  },
  {
    title: "更多操作",
    description: "点击这里可以访问系统提供的高级功能和设置选项。",
    targetSelector: ".more-actions",
    illustration: "/vue.svg"
  }
];

// 使用引导钩子
const {
  showTour,
  currentStep,
  currentStepIndex,
  steps,
  modalStyle,
  highlightStyle,
  startTour,
  closeTour,
  nextStep,
  prevStep,
  finishTour
} = useTourGuide({
  steps: tourSteps,
  onFinish: () => {
    ElMessage.success("引导完成！");
    localStorage.setItem("hasCompletedTour", "true");
    router.push("/dashboard/dataVisualize");
  },
  onStepChange: (current, total) => {
    console.log(`引导步骤: ${current + 1}/${total}`);
  },
  onClose: () => {
    console.log("用户关闭了引导");
  }
});

// 开始引导
const startTourGuide = async () => {
  // 跳转到Dashboard页面
  await router.push("/dashboard/dataVisualize");
  // 等待页面加载完成后启动引导
  setTimeout(() => {
    // 确保目标元素可见
    const testElements = document.querySelector(".test-tour-elements");
    if (testElements) {
      (testElements as HTMLElement).style.display = "block";
    }
    startTour();
  }, 1000);
};

// 跳过引导
const skipTour = () => {
  localStorage.setItem("hasCompletedTour", "true");
  router.push("/dashboard/dataVisualize");
};
</script>

<style scoped lang="scss">
.tour-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
}

.tour-content {
  text-align: center;
  z-index: 2;
  max-width: 600px;
  padding: 0 20px;
}

.tour-title {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 16px;
  font-weight: 700;
}

.tour-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 40px;
  line-height: 1.6;
}

.start-tour-btn {
  margin-right: 16px;
}

.skip-tour-btn {
  color: #6b7280;
}

.tour-features {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  gap: 30px;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.8));
  z-index: 1;
}

.feature-item {
  text-align: center;
  max-width: 150px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
}

.feature-icon {
  width: 60px;
  height: 60px;
  background-color: #e0f2fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #0ea5e9;
  font-size: 28px;
}

.feature-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
}

/* 以下是全局样式，但需要在组件中定义，因为Teleport到body */
:global(.tour-overlay) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.tour-modal) {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 0;
  position: absolute;
  overflow: hidden;
}

:global(.tour-modal-header) {
  padding: 20px 25px 15px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #1f2937;
  }

  .close-btn {
    font-size: 1.5rem;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  }
}

:global(.tour-modal-body) {
  padding: 25px;

  .tour-illustration {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;

    img {
      width: 100px;
      height: 100px;
      object-fit: contain;
    }
  }

  .tour-description-text {
    font-size: 1.1rem;
    color: #4b5563;
    text-align: center;
    margin: 0;
  }
}

:global(.tour-modal-footer) {
  padding: 0 25px 25px;

  .step-indicators {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .step-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #e5e7eb;
      margin: 0 6px;
      transition: all 0.3s;

      &.active {
        background-color: #3b82f6;
        width: 24px;
        border-radius: 4px;
      }
    }
  }

  .tour-actions {
    display: flex;
    justify-content: space-between;

    button {
      min-width: 100px;
    }
  }
}

:global(.tour-highlight) {
  position: absolute;
  border: 3px solid #3b82f6;
  border-radius: 8px;
  z-index: 9998;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}

:global(.fade-enter-active),
:global(.fade-leave-active) {
  transition: opacity 0.3s;
}

:global(.fade-enter-from),
:global(.fade-leave-to) {
  opacity: 0;
}
</style>
